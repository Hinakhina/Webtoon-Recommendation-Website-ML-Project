import sys
import pandas as pd
import json
import re

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def recommend_by_genres(input_titles, top_n=10):
    df = pd.read_csv("./webtoon_originals_en.csv")
    df.dropna(subset=['title', 'genre'], inplace=True)
    df['title_clean'] = df['title'].apply(clean_text)
    df['genre_clean'] = df['genre'].apply(clean_text)

    cleaned_titles = [clean_text(t) for t in input_titles]

    # Cari genre semua judul input, bisa gabungkan genre yg muncul
    genres_found = set()
    for ct in cleaned_titles:
        matches = df[df['title_clean'].str.contains(ct)]
        if not matches.empty:
            # ambil semua genre dari matches
            genres_found.update(matches['genre_clean'].tolist())

    if not genres_found:
        return {"message": "No matching webtoon titles found"}

    # Filter rekomendasi berdasar genre yang ditemukan
    genre_pattern = '|'.join(genres_found)  # regex OR
    recommendations = df[df['genre_clean'].str.contains(genre_pattern)].head(top_n)

    return recommendations[['title', 'genre', 'authors', 'rating', 'synopsis']].to_dict(orient='records')

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"message": "No titles provided"}))
        sys.exit()

    # Terima input multiple titles dipisah '*'
    titles_input = sys.argv[1].split('*')
    result = recommend_by_genres(titles_input)
    print(json.dumps(result))
