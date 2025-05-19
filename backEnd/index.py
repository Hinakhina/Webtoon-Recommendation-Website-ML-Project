from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a random secret key in production
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///webtoon.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Database Models
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    # Stores questionnaire response as JSON string.
    # Example JSON format:
    # {
    #   "favorite_genres": ["action", "fantasy"],
    #   "reading_frequency": ["daily"]
    # }
    questionnaire_response = db.Column(db.String(2000), nullable=True)

class Webtoon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    genre = db.Column(db.String(100), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username and password required"}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400
    new_user = User(
        username=data['username'],
        password=generate_password_hash(data['password'])
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Username and password required"}), 400
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        login_user(user)
        return jsonify({"message": "Login successful!"}), 200
    return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully!"}), 200

@app.route('/questionnaire', methods=['POST'])
@login_required
def questionnaire():
    data = request.json
    if not data or not data.get('response'):
        return jsonify({"message": "Questionnaire response required"}), 400
    try:
        # Save questionnaire as JSON string
        current_user.questionnaire_response = json.dumps(data['response'])
        db.session.commit()
        return jsonify({"message": "Questionnaire response saved!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to save response", "details": str(e)}), 400

@app.route('/recommendations', methods=['GET'])
@login_required
def recommendations():
    # Basic recommendation logic. For now, return all webtoons.
    # You can improve this logic using questionnaire_response later.
    webtoons = Webtoon.query.all()
    return jsonify([{"id": w.id, "title": w.title, "genre": w.genre} for w in webtoons]), 200

if __name__ == '__main__':
    db.create_all()
    # Add sample webtoons if not present
    if Webtoon.query.count() == 0:
        sample_webtoons = [
            Webtoon(title="Hero's Journey", genre="action"),
            Webtoon(title="Mystic Tales", genre="fantasy"),
            Webtoon(title="Love in the City", genre="romance"),
            Webtoon(title="Outlaw Chronicles", genre="drama")
        ]
        db.session.bulk_save_objects(sample_webtoons)
        db.session.commit()
    app.run(debug=True)


