from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_master = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    players = db.relationship('Player', backref='master', lazy=True, cascade='all, delete-orphan')
    notes = db.relationship('Note', backref='master', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_master': self.is_master,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    money = db.Column(db.Integer, default=0)
    health = db.Column(db.Integer, default=100)
    mana = db.Column(db.Integer, default=50)
    vigor = db.Column(db.Integer, default=75)
    items = db.Column(db.Text)  # JSON string
    debuffs = db.Column(db.Text)  # JSON string
    avatar_url = db.Column(db.String(255))
    master_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Credenciais para login do jogador
    player_username = db.Column(db.String(80))
    player_password_hash = db.Column(db.String(255))

    def set_player_password(self, password):
        if password:
            self.player_password_hash = generate_password_hash(password)

    def check_player_password(self, password):
        if not self.player_password_hash:
            return False
        return check_password_hash(self.player_password_hash, password)

    def get_items(self):
        if self.items:
            try:
                return json.loads(self.items)
            except:
                return []
        return []

    def set_items(self, items_list):
        self.items = json.dumps(items_list)

    def get_debuffs(self):
        if self.debuffs:
            try:
                return json.loads(self.debuffs)
            except:
                return []
        return []

    def set_debuffs(self, debuffs_list):
        self.debuffs = json.dumps(debuffs_list)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'money': self.money,
            'health': self.health,
            'mana': self.mana,
            'vigor': self.vigor,
            'items': self.get_items(),
            'debuffs': self.get_debuffs(),
            'avatar_url': self.avatar_url,
            'player_username': self.player_username,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    theme = db.Column(db.String(100))
    master_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'theme': self.theme,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class DiceRoll(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dice_type = db.Column(db.Integer, nullable=False)  # 4, 20, 100
    result = db.Column(db.Integer, nullable=False)
    master_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'dice_type': self.dice_type,
            'result': self.result,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

