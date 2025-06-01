import sys
import os
import json
import pickle
import numpy as np
import pandas as pd
import pymysql
import difflib
from scipy.sparse import csr_matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ──── Load model dan data ──────────────────────────────────────────────────────
def load_resources():
    with open(os.path.join(BASE_DIR, "best_webtoon_model (1).pkl"), "rb") as f:
        model = pickle.load(f)
    with open(os.path.join(BASE_DIR, "top_items.pkl"), "rb") as f:
        top_items = pickle.load(f)
    with open(os.path.join(BASE_DIR, "item_features.pkl"), "rb") as f:
        item_features = csr_matrix(pickle.load(f))
    with open(os.path.join(BASE_DIR, "user_mapping.pkl"), "rb") as f:
        user_mapping = pickle.load(f)
    with open(os.path.join(BASE_DIR, "item_mapping.pkl"), "rb") as f:
        item_mapping = pickle.load(f)
    synopsis_embeddings = np.load(os.path.join(BASE_DIR, "synopsis_embeddings.npy"))
    df = pd.read_csv(os.path.join(BASE_DIR, "webtoon_originals_en.csv"), encoding="utf-8")
    return model, top_items, item_features, user_mapping, item_mapping, synopsis_embeddings, df

model, top_items, item_features, user_mapping, item_mapping, synopsis_embeddings, df = load_resources()

# ──── DB Connection ────────────────────────────────────────────────────────────
def get_db_connection():
    return pymysql.connect(
        host="localhost", user="root", password="", database="webtoon_db",
        charset="utf8mb4", cursorclass=pymysql.cursors.Cursor
    )

def get_history_titles(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT title FROM search_history WHERE user_id = %s", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return list(dict.fromkeys([row[0] for row in rows]))

def get_user_genres(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT genre FROM user_genres WHERE user_id = %s", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [row[0] for row in rows]

# ──── Utility Functions ────────────────────────────────────────────────────────
def fuzzy_match_title(input_title):
    candidates = top_items['title'].tolist()
    match = difflib.get_close_matches(input_title, candidates, n=1, cutoff=0.6)
    return match[0] if match else None

def find_title_index(title):
    title_lower = title.lower()
    match = top_items[top_items['title'].str.lower() == title_lower]
    if not match.empty:
        return match.index[0]
    fuzzy_title = fuzzy_match_title(title)
    if fuzzy_title:
        match = top_items[top_items['title'] == fuzzy_title]
        return match.index[0] if not match.empty else None
    return None

# ──── Proxy Selection ──────────────────────────────────────────────────────────
def get_proxy_user_id(user_id, title_history):
    input_titles_set = set(t.lower() for t in title_history)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT user_id FROM search_history WHERE user_id != %s", (user_id,))
    candidate_users = [row[0] for row in cursor.fetchall()]
    
    max_shared, best_uid = 0, None
    for candidate_id in candidate_users:
        cursor.execute("SELECT title FROM search_history WHERE user_id = %s", (candidate_id,))
        candidate_titles = set(row[0].lower() for row in cursor.fetchall())
        overlap = len(input_titles_set & candidate_titles)
        if overlap >= 2:
            sys.stderr.write(f"[INFO] Proxy by title: {user_id} is {candidate_id} (shared titles: {overlap})\n")
            conn.close()
            return candidate_id
        if overlap > max_shared:
            max_shared = overlap
            best_uid = candidate_id
    conn.close()

    genre_db = set(get_user_genres(user_id))
    genre_from_titles = {
        df[df['title'].str.lower() == title.lower()].iloc[0]['genre']
        for title in title_history if not df[df['title'].str.lower() == title.lower()].empty
    }
    combined_genres = genre_db.union(genre_from_titles)
    if not combined_genres:
        return "default_user"

    max_overlap, best_match_id = 0, None
    for uid in user_mapping:
        user_genres = set(get_user_genres(uid))
        overlap = len(combined_genres & user_genres)
        if overlap == len(combined_genres):
            return uid
        if overlap > max_overlap:
            best_match_id = uid
            max_overlap = overlap
    if best_match_id:
        sys.stderr.write(f"[INFO] Proxy by genre: {user_id} → {best_match_id} (shared genres: {max_overlap})\n")
    return best_match_id or "default_user"

# ──── Recommenders ─────────────────────────────────────────────────────────────
def content_based_recommendation(input_titles, genres=None, top_n=10, user_id=None):
    idx_inputs = [find_title_index(t) for t in input_titles if find_title_index(t) is not None]
    for t, idx in zip(input_titles, idx_inputs):
        sys.stderr.write(f"[DEBUG] Title '{t}' mapped to index {idx}\n")

    input_vectors = synopsis_embeddings[idx_inputs] if idx_inputs else []

    genre_vectors = []
    if genres:
        for genre in genres:
            genre_titles = df[df['genre'] == genre]['title']
            genre_idx = [find_title_index(t) for t in genre_titles if find_title_index(t) is not None]
            genre_vectors += [synopsis_embeddings[i] for i in genre_idx if i < synopsis_embeddings.shape[0]]

    if genre_vectors:
        genre_vectors = np.vstack(genre_vectors)
        input_vectors = np.vstack([input_vectors, genre_vectors]) if len(input_vectors) else genre_vectors

    if len(input_vectors) == 0:
        sys.stderr.write("[WARN] No vectors found for input.\n")
        return []

    if idx_inputs and genre_vectors != []:
        avg_vector = (0.7 * np.mean(synopsis_embeddings[idx_inputs], axis=0)) + (0.3 * np.mean(genre_vectors, axis=0))
    else:
        avg_vector = np.mean(input_vectors, axis=0)
    avg_vector = avg_vector.reshape(1, -1)

    similarities = np.dot(synopsis_embeddings, avg_vector.T).flatten()
    seen_titles = set(t.lower() for t in input_titles)
    seen_titles.update(t.lower() for t in get_history_titles(user_id))
    exclude_indices = [i for i, t in enumerate(top_items['title']) if t.lower() in seen_titles]
    for idx in exclude_indices:
        similarities[idx] = -1e9

    top_indices = np.argsort(-similarities)[:30]
    np.random.shuffle(top_indices)
    top_indices = top_indices[:top_n]

    return df[df['title'].isin(top_items['title'].iloc[top_indices])][['title', 'genre', 'rating', 'synopsis', 'authors']].to_dict(orient="records")

def hybrid_recommendation(user_id, input_titles, top_n=10):
    idx_inputs = [find_title_index(t) for t in input_titles if find_title_index(t) is not None]
    if not idx_inputs:
        return []

    proxy_id = get_proxy_user_id(user_id, input_titles)
    key = f"user_{int(proxy_id)}"
    if key not in user_mapping:
        return []

    user_idx = user_mapping[key]
    scores = model.predict(user_ids=user_idx, item_ids=np.arange(len(top_items)), item_features=item_features)
    for idx in idx_inputs:
        scores[idx] = -1e9

    top_items_idx = np.argsort(-scores)
    top_items_filtered = [i for i in top_items_idx if scores[i] > 0.1][:top_n]
    if not top_items_filtered:
        sys.stderr.write("[INFO] Hybrid produced no results. Switching to content-based fallback.\n")
        return content_based_recommendation(input_titles, genres=get_user_genres(user_id), user_id=user_id)

    sys.stderr.write(f"[INFO] Returning {len(top_items_filtered)} items from hybrid.\n")
    return df[df['title'].isin(top_items['title'].iloc[top_items_filtered])][['title', 'genre', 'rating', 'synopsis', 'authors']].to_dict(orient="records")

# ──── Main ─────────────────────────────────────────────────────────────────────
sys.stdout.reconfigure(encoding="utf-8")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(1)

    user_id = sys.argv[1]
    title_history = get_history_titles(user_id)
    genre_prefs = get_user_genres(user_id)

    sys.stderr.write(f"[INFO] Titles from DB: {title_history}\n")
    sys.stderr.write(f"[INFO] Genres from DB: {genre_prefs}\n")

    if len(title_history) == 0 and genre_prefs:
        sys.stderr.write("[INFO] Mode: Content-based (genre only)\n")
        result = content_based_recommendation([], genres=genre_prefs, user_id=user_id)
    elif len(title_history) < 3 and genre_prefs:
        sys.stderr.write("[INFO] Mode: Content-based (genre + title)\n")
        result = content_based_recommendation(title_history, genres=genre_prefs, user_id=user_id)
    else:
        sys.stderr.write("[INFO] Mode: Hybrid\n")
        result = hybrid_recommendation(user_id, title_history)
        if not result:
            sys.stderr.write("[INFO] Fallback: Hybrid empty, switching to content-based\n")
            result = content_based_recommendation(title_history, genres=genre_prefs, user_id=user_id)

    print(json.dumps(result, ensure_ascii=False))
