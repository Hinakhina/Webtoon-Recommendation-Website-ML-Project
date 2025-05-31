import pickle
import numpy as np
import pandas as pd

# Load all required files
with open("best_webtoon_model (1).pkl", "rb") as f:
    model = pickle.load(f)

with open("top_items.pkl", "rb") as f:
    top_items = pickle.load(f)

with open("item_features.pkl", "rb") as f:
    item_features = pickle.load(f)

synopsis_embeddings = np.load("synopsis_embeddings.npy")

# Cold-start: content-based recommendation
def content_based_recommendation(input_titles, top_n=10):
    idx_inputs = [top_items[top_items['title'] == t].index[0] for t in input_titles if t in top_items['title'].values]
    if not idx_inputs:
        return "Judul tidak ditemukan."
    input_vectors = synopsis_embeddings[idx_inputs]
    avg_vector = np.mean(input_vectors, axis=0).reshape(1, -1)
    similarities = np.dot(synopsis_embeddings, avg_vector.T).flatten()
    for idx in idx_inputs:
        similarities[idx] = -1
    top_indices = np.argsort(-similarities)[:top_n]
    return top_items['title'].iloc[top_indices].tolist()

# Hybrid recommendation
def hybrid_recommendation(user_id, input_titles, top_n=10):
    user_idx = 0
    item_labels = list(top_items['title'])
    idx_inputs = [item_labels.index(t) for t in input_titles if t in item_labels]
    if not idx_inputs:
        return "Judul tidak ditemukan."
    scores = model.predict(user_ids=user_idx, item_ids=np.arange(len(item_labels)), item_features=item_features)
    for idx in idx_inputs:
        scores[idx] = -np.inf
    top_items_idx = np.argsort(-scores)[:top_n]
    return [item_labels[i] for i in top_items_idx]

# Adaptif input menu
user_history_file = 'user_input_history.txt'
user_id = 'user_0'
input_titles = []

print("\n🎯 Sistem Rekomendasi Webtoon")
genre_input = input("Masukkan genre favoritmu (e.g. romance, action): ").lower()

while True:
    title = input("Masukkan judul Webtoon favoritmu (atau 'exit'): ")
    if title.lower() == 'exit':
        break
    if title not in top_items['title'].values:
        print(f"Judul '{title}' tidak ditemukan.")
        continue
    input_titles.append(title)
    with open(user_history_file, 'a') as f:
        f.write(f"{user_id},{title}\n")

    if len(input_titles) < 3:
        print("\n🔍 Rekomendasi awal (cold start):")
        rekomendasi = content_based_recommendation(input_titles)
    else:
        print("\n🤖 Rekomendasi campuran (hybrid):")
        rekomendasi = hybrid_recommendation(user_id, input_titles)

    for i, rec in enumerate(rekomendasi, 1):
        print(f"{i}. {rec}")
