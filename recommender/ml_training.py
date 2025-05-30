# -*- coding: utf-8 -*-
"""ML_training.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/10tEDDisHqLDoMgYO-Eb0YJvxN6ykPBXy
"""

# grid_search_optimized_with_recommendation.py
import pandas as pd
import numpy as np
import random
import re
import pickle
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.evaluation import precision_at_k, auc_score
from lightfm.cross_validation import random_train_test_split
from sklearn.preprocessing import MinMaxScaler
from sentence_transformers import SentenceTransformer
import os

random.seed(42)
np.random.seed(42)

file_path = 'webtoon_originals_en.csv'
df = pd.read_csv(file_path)
df = df[['title', 'genre', 'authors', 'subscribers', 'views', 'likes', 'rating', 'synopsis']].dropna()

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

df['genre'] = df['genre'].apply(clean_text)
df['authors'] = df['authors'].fillna('unknown').apply(clean_text)
df['synopsis'] = df['synopsis'].fillna('').apply(clean_text)

scaler = MinMaxScaler()
df[['views', 'likes', 'subscribers']] = scaler.fit_transform(df[['views', 'likes', 'subscribers']])
df['implicit_score'] = df['views'] * 0.5 + df['likes'] * 0.3 + df['subscribers'] * 0.2 + 0.1 * (df['rating'] / 10)

num_users = 100
user_ids = [f"user_{i}" for i in range(num_users)]
webtoons = df['title'].tolist()
interaction_data = []
preferred_genres = ['romance', 'action', 'comedy', 'fantasy']

for i, user in enumerate(user_ids):
    genre = preferred_genres[i % len(preferred_genres)]
    preferred_titles = df[df['genre'].str.contains(genre)]['title'].tolist()
    if len(preferred_titles) < 10:
        preferred_titles = webtoons
    liked = random.sample(preferred_titles, min(80, len(preferred_titles)))
    for title in liked:
        score = df[df['title'] == title]['implicit_score'].values[0]
        interaction_data.append((user, title, score))

# Langsung generate embedding
model_bert = SentenceTransformer('all-MiniLM-L6-v2', device='cuda')
synopsis_embeddings = model_bert.encode(df['synopsis'].tolist(), batch_size=128, show_progress_bar=True)

# Dataset setup
dataset = Dataset()
dataset.fit(users=user_ids, items=df['title'])

df['item_features'] = df['genre'] + ',' + df['authors']
embedding_features = [f'synopsis_dim_{i}' for i in range(synopsis_embeddings.shape[1])]
embedding_df = pd.DataFrame(synopsis_embeddings, columns=embedding_features)
df = pd.concat([df.reset_index(drop=True), embedding_df.reset_index(drop=True)], axis=1)
for feat in embedding_features:
    df['item_features'] += ',' + feat

df['item_features'] = df['item_features'].fillna('unknown').astype(str)
all_item_features = set()
for feats in df['item_features']:
    all_item_features.update(feats.split(','))

dataset.fit_partial(items=df['title'], item_features=all_item_features)
interactions, _ = dataset.build_interactions(interaction_data)
item_features = dataset.build_item_features(((title, feats.split(',')) for title, feats in zip(df['title'], df['item_features'])))

train, test = random_train_test_split(interactions, test_percentage=0.2)

# Train final model
model = LightFM(loss='warp', learning_rate=0.05, no_components=64)
model.fit(train, item_features=item_features, epochs=30, num_threads=2)

# Top items DataFrame untuk rekomendasi
top_items = df[['title']].reset_index(drop=True)

# Cold-start: Content-based recommendation
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
    user_idx = 0  # hanya user_0
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