import sys
import pandas as pd
import numpy as np
import pickle
import json
import os
import pymysql
import difflib
from scipy.sparse import csr_matrix  # LightFM expects sparse matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "best_webtoon_model.pkl"), "rb") as f:
    model = pickle.load(f)
with open(os.path.join(BASE_DIR, "top_items.pkl"), "rb") as f:
    top_items = pickle.load(f)
with open(os.path.join(BASE_DIR, "item_features.pkl"), "rb") as f:
    item_features = csr_matrix(pickle.load(f))  # Fix: convert to CSR
synopsis_embeddings = np.load(os.path.join(BASE_DIR, "synopsis_embeddings.npy"))
df = pd.read_csv(os.path.join(BASE_DIR, "webtoon_originals_en.csv"), encoding="utf-8")

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

def content_based_recommendation(input_titles, genres=None, top_n=10):
    idx_inputs = [find_title_index(t) for t in input_titles]
    idx_inputs = [i for i in idx_inputs if i is not None]
    input_vectors = synopsis_embeddings[idx_inputs] if idx_inputs else []

    genre_vectors = []
    if genres:
        for genre in genres:
            genre_matches = df[df['genre'].str.lower().str.contains(genre.lower())]
            genre_idx = [find_title_index(t) for t in genre_matches['title']]
            genre_idx = [i for i in genre_idx if i is not None]
            genre_vectors.extend(synopsis_embeddings[i] for i in genre_idx)

    if genre_vectors:
        genre_vectors = np.vstack(genre_vectors)
        input_vectors = np.vstack([input_vectors, genre_vectors]) if len(input_vectors) else genre_vectors

    if len(input_vectors) == 0:
        sys.stderr.write("[WARN] No matching vectors for titles or genres.\n")
        return []

    avg_vector = np.mean(input_vectors, axis=0).reshape(1, -1)
    similarities = np.dot(synopsis_embeddings, avg_vector.T).flatten()
    for idx in idx_inputs:
        similarities[idx] = -1
    top_indices = np.argsort(-similarities)[:top_n]
    return df[df['title'].isin(top_items['title'].iloc[top_indices].tolist())][['title', 'genre', 'rating', 'synopsis', 'authors']].to_dict(orient="records")

def hybrid_recommendation(user_id, input_titles, top_n=10):
    user_idx = 0
    item_labels = list(top_items['title'])
    item_labels_lower = [t.lower() for t in item_labels]
    idx_inputs = [i for i, label in enumerate(item_labels_lower) if label in [t.lower() for t in input_titles]]
    if not idx_inputs:
        sys.stderr.write("[WARN] No matched titles for hybrid mode.\n")
        return []
    scores = model.predict(user_ids=user_idx, item_ids=np.arange(len(item_labels)), item_features=item_features)
    for idx in idx_inputs:
        scores[idx] = -np.inf
    top_items_idx = np.argsort(-scores)[:top_n]
    return df[df['title'].isin([item_labels[i] for i in top_items_idx])][['title', 'genre', 'rating', 'synopsis', 'authors']].to_dict(orient="records")

# ─── Make stdout utf-8 safe for JSON output ────────
sys.stdout.reconfigure(encoding="utf-8")

# ─── MAIN ──────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(1)

    user_id = sys.argv[1]
    title_history = get_history_titles(user_id)
    genre_prefs = get_user_genres(user_id)

    sys.stderr.write(f"[INFO] Titles from DB: {title_history}\n")
    sys.stderr.write(f"[INFO] Genres from DB: {genre_prefs}\n")

    if len(title_history) < 3:
        sys.stderr.write("[INFO] Mode: Content-based (genre + title)\n")
        result = content_based_recommendation(title_history, genres=genre_prefs)
    else:
        sys.stderr.write("[INFO] Mode: Hybrid\n")
        result = hybrid_recommendation(user_id, title_history)

    print(json.dumps(result, ensure_ascii=False))
