from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import difflib

app = Flask(__name__)
CORS(app)

# Simpan percakapan dalam list
conversations = []

def load_faq(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    faq = {}
    question_list = []
    answer = None
    for line in lines:
        line = line.strip()
        if line.startswith("Q:"):
            question_list.append(line[2:].strip())
        elif line.startswith("A:"):
            answer = line[2:].strip()
            for question in question_list:
                faq[question] = answer
            question_list = []
        elif line == "":
            question_list = []
            answer = None
    
    return faq

faq = load_faq('faq.txt')
questions = list(faq.keys())
answers = list(faq.values())

vectorizer = TfidfVectorizer().fit(questions)
faq_vectors = vectorizer.transform(questions)

def levenshtein_distance(str1, str2):
    return difflib.SequenceMatcher(None, str1, str2).ratio()

def find_best_match(user_input, threshold=0.4):
    user_input_vector = vectorizer.transform([user_input])
    cosine_similarities = cosine_similarity(user_input_vector, faq_vectors)
    max_similarity = cosine_similarities.max()

    if max_similarity >= threshold:
        best_match_index = cosine_similarities.argmax()
        best_match_question = questions[best_match_index]
        
        # Apply Levenshtein distance as a secondary check
        levenshtein_ratio = levenshtein_distance(user_input, best_match_question)
        
        if levenshtein_ratio >= threshold:
            return best_match_question, faq[best_match_question]
    
    return None, "Maaf, saya tidak mengerti pertanyaan Anda."

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_input = data['question']
    best_match, response = find_best_match(user_input, threshold=0.4)  # Set threshold to 0.5 or other suitable value

    # Simpan pertanyaan dan jawaban dalam percakapan
    conversations.append({'question': user_input, 'answer': response})

    return jsonify({"answer": response, "conversations": conversations})

if __name__ == '__main__':
    app.run(debug=True)