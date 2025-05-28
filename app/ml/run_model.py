import sys
import pandas as pd
import json
import re

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def recommend_by_genre(input_title, top_n=10):
    df = pd.read_csv("../../webtoon_originals_en.csv")
    df.dropna(subset=['title', 'genre'], inplace=True)
    df['title_clean'] = df['title'].apply(clean_text)
    df['genre_clean'] = df['genre'].apply(clean_text)

    cleaned_input = clean_text(input_title)

    # 1. Cari judul yang mirip
    matches = df[df['title_clean'].str.contains(cleaned_input)]
    if matches.empty:
        return {"message": "Webtoon not found"}

    # 2. Ambil genre dari hasil terdekat
    target_genre = matches.iloc[0]['genre_clean']

    # 3. Cari rekomendasi berdasarkan genre
    recommendations = df[df['genre_clean'].str.contains(target_genre)].head(top_n)

    return recommendations[['title', 'genre', 'authors', 'rating', 'synopsis']].to_dict(orient='records')

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"message": "No title provided"}))
        sys.exit()

    title = sys.argv[1]
    result = recommend_by_genre(title)
    print(json.dumps(result))
