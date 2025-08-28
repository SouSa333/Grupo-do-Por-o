from flask import Blueprint, request, jsonify, session
from src.models.user import db, User, Player
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import string
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

# Armazenamento temporário para tokens de recuperação (em produção, usar Redis ou banco)
password_reset_tokens = {}

def generate_reset_token():
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))

def send_reset_email(email, token):
    """Simula envio de email de recuperação de senha"""
    # Em produção, configurar SMTP real
    print(f"Email de recuperação enviado para {email}")
    print(f"Token de recuperação: {token}")
    print(f"Link: http://localhost:5000/reset-password?token={token}")
    return True

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Todos os campos são obrigatórios'}), 400
        
        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        
        # Verificar se usuário já existe
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Nome de usuário já existe'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Criar novo usuário
        user = User(username=username, email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Fazer login automático
        session['user_id'] = user.id
        session['username'] = user.username
        session['is_master'] = user.is_master
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username e senha são obrigatórios'}), 400
        
        username = data['username'].strip()
        password = data['password']
        
        # Buscar usuário
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        # Fazer login
        session['user_id'] = user.id
        session['username'] = user.username
        session['is_master'] = user.is_master
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/login-player', methods=['POST'])
def login_player():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username e senha são obrigatórios'}), 400
        
        username = data['username'].strip()
        password = data['password']
        
        # Buscar jogador
        player = Player.query.filter_by(player_username=username).first()
        
        if not player or not player.check_player_password(password):
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        # Fazer login do jogador
        session['player_id'] = player.id
        session['player_name'] = player.name
        session['master_id'] = player.master_id
        session['is_player'] = True
        
        return jsonify({
            'message': 'Login do jogador realizado com sucesso',
            'player': player.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email é obrigatório'}), 400
        
        email = data['email'].strip().lower()
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Por segurança, não revelar se o email existe
            return jsonify({'message': 'Se o email existir, um link de recuperação será enviado'}), 200
        
        # Gerar token de recuperação
        token = generate_reset_token()
        password_reset_tokens[token] = {
            'user_id': user.id,
            'expires_at': datetime.utcnow() + timedelta(hours=1)
        }
        
        # Enviar email
        if send_reset_email(email, token):
            return jsonify({'message': 'Email de recuperação enviado com sucesso'}), 200
        else:
            return jsonify({'error': 'Erro ao enviar email'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        
        if not data or not data.get('token') or not data.get('new_password'):
            return jsonify({'error': 'Token e nova senha são obrigatórios'}), 400
        
        token = data['token']
        new_password = data['new_password']
        
        # Verificar token
        if token not in password_reset_tokens:
            return jsonify({'error': 'Token inválido'}), 400
        
        token_data = password_reset_tokens[token]
        
        if datetime.utcnow() > token_data['expires_at']:
            del password_reset_tokens[token]
            return jsonify({'error': 'Token expirado'}), 400
        
        # Atualizar senha
        user = User.query.get(token_data['user_id'])
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        user.set_password(new_password)
        db.session.commit()
        
        # Remover token usado
        del password_reset_tokens[token]
        
        return jsonify({'message': 'Senha alterada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({
                'logged_in': True,
                'user': user.to_dict()
            }), 200
    
    if 'player_id' in session:
        player = Player.query.get(session['player_id'])
        if player:
            return jsonify({
                'logged_in': True,
                'is_player': True,
                'player': player.to_dict()
            }), 200
    
    return jsonify({'logged_in': False}), 200

