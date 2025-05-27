import sys
import json
from ml_training import content_based_recommendation, hybrid_recommendation

input_titles = sys.argv[1].split('|')  # e.g., "title1|title2|title3"
recommendations = hybrid_recommendation('user_0', input_titles) if len(input_titles) >= 3 else content_based_recommendation(input_titles)

print(json.dumps(recommendations))
