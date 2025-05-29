import sys
import pandas as pd
import numpy as np
import pickle
import json
import re
from lightfm import LightFM

# Preprocessing Function 
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

# Load Data & Model 
df = pd.read_csv("webtoon_processed.csv")
with open("model.pkl", "rb") as f:
    model = pickle.load(f)
with open("top_items.pkl", "rb") as f:
    top_items = pickle.load(f)
with open("item_features.pkl", "rb") as f:
    item_features = pickle.load(f)
synopsis_embeddings = np.load("synopsis_embeddings.npy")

# Content-Based (Cold Start) 
def content_based_recommendation(input_titles, top_n=10):
    idx_inputs = [top_items[top_items['title'] == t].index[0] for t in input_titles if t in top_items['title'].values]
    if not idx_inputs:
        return []
    input_vectors = synopsis_embeddings[idx_inputs]
    avg_vector = np.mean(input_vectors, axis=0).reshape(1, -1)
    similarities = np.dot(synopsis_embeddings, avg_vector.T).flatten()
    for idx in idx_inputs:
        similarities[idx] = -1  # skip self
    top_indices = np.argsort(-similarities)[:top_n]
    return df.iloc[top_indices][['title', 'genre', 'authors', 'rating', 'synopsis']].to_dict(orient="records")

# Hybrid (LightFM + content) 
def hybrid_recommendation(input_titles, top_n=10):
    item_labels = list(top_items['title'])
    idx_inputs = [item_labels.index(t) for t in input_titles if t in item_labels]
    if not idx_inputs:
        return []
    
    user_id = 0  # default user
    scores = model.predict(user_ids=user_id, item_ids=np.arange(len(item_labels)), item_features=item_features)
    for idx in idx_inputs:
        scores[idx] = -np.inf  # exclude already liked
    top_items_idx = np.argsort(-scores)[:top_n]
    return df.iloc[top_items_idx][['title', 'genre', 'authors', 'rating', 'synopsis']].to_dict(orient="records")

# Entry Point 
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"message": "No titles provided"}))
        sys.exit()

    titles_input = sys.argv[1].split('*')
    cleaned_input = [clean_text(t) for t in titles_input]

    if len(cleaned_input) < 3:
        result = content_based_recommendation(cleaned_input)
    else:
        result = hybrid_recommendation(cleaned_input)

    print(json.dumps(result))
