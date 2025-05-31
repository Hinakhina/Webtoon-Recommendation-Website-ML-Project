# run_model.py
import sys
import pandas as pd
import numpy as np
import pickle
import json
import re
import os
import pymysql

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load serialized model components
with open(os.path.join(BASE_DIR, "best_webtoon_model.pkl"), "rb") as f:
    model = pickle.load(f)
with open(os.path.join(BASE_DIR, "top_items.pkl"), "rb") as f:
    top_items = pickle.load(f)
with open(os.path.join(BASE_DIR, "item_features.pkl"), "rb") as f:
    item_features = pickle.load(f)
synopsis_embeddings = np.load(os.path.join(BASE_DIR, "synopsis_embeddings.npy"))

def get_history_titles(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT title FROM search_history 
        WHERE user_id = %s
    """, (user_id,))
    titles = [row[0] for row in cursor.fetchall()]
    conn.close()
    return titles


def get_titles_from_input(input_arg):
    # user_id numeric? → use DB, else → use genre input
    if input_arg.isdigit():
        return get_history_titles(int(input_arg))
    else:
        return input_arg.split('*')

def content_based_recommendation(inputs, top_n=10):
    idx_inputs = [top_items[top_items['title'] == t].index[0] for t in inputs if t in top_items['title'].values]
    if not idx_inputs:
        pattern = '|'.join(inputs)
        matched = top_items[top_items['genre'].str.contains(pattern, case=False, na=False)]
        if matched.empty:
            return []
        idx_inputs = matched.index.tolist()
    input_vectors = synopsis_embeddings[idx_inputs]
    avg_vector = np.mean(input_vectors, axis=0).reshape(1, -1)
    similarities = np.dot(synopsis_embeddings, avg_vector.T).flatten()
    for idx in idx_inputs:
        similarities[idx] = -1
    top_indices = np.argsort(-similarities)[:top_n]
    return top_items.iloc[top_indices].to_dict(orient="records")

def hybrid_recommendation(user_id, input_titles, top_n=10):
    user_idx = 0
    item_labels = list(top_items['title'])
    idx_inputs = [item_labels.index(t) for t in input_titles if t in item_labels]
    if not idx_inputs:
        return []
    scores = model.predict(user_ids=user_idx, item_ids=np.arange(len(item_labels)), item_features=item_features)
    for idx in idx_inputs:
        scores[idx] = -np.inf
    top_items_idx = np.argsort(-scores)[:top_n]
    return top_items.iloc[top_items_idx].to_dict(orient="records")

# MAIN
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(1)

    input_arg = sys.argv[1]
    input_titles = get_titles_from_input(input_arg)

    if len(input_titles) < 3:
        result = content_based_recommendation(input_titles)
    else:
        result = hybrid_recommendation(input_arg, input_titles)

    print(json.dumps(result))
