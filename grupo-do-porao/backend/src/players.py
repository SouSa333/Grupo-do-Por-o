from flask import Blueprint, request, jsonify, session
from src.models.user import db, User, Player
import secrets
import string

players_bp = Blueprint('players', __name__)

def require_master():
    """Decorator para verificar se o usuário é um mestre logado"""
    if 'user_id' not in session or not session.get('is_master'):
        return jsonify({'error': 'Acesso negado. Apenas mestres podem acessar esta funcionalidade'}), 403
    return None

def generate_player_password():
    """Gera uma senha aleatória para o jogador"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(8))

@players_bp.route('/players', methods=['GET'])
def get_players():
    auth_error = require_master()
    if auth_error:
        return auth_error
    
    try:
        master_id = session['user_id']
        players = Player.query.filter_by(master_id=master_id).all()
        
        return jsonify({
            'players': [player.to_dict() for player in players]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@players_bp.route('/players', methods=['POST'])
def create_player():
    auth_error = require_master()
    if auth_error:
        return auth_error
    
    try:
        data = request.get_json()
        
        if not data or not data.get('name'):
            return jsonify({'error': 'Nome do jogador é obrigatório'}), 400
        
        master_id = session['user_id']
        
        # Gerar credenciais para o jogador
        player_username = data.get('player_username', data['name'].lower().replace(' ', '_'))
        player_password = generate_player_password()
        
        # Verificar se o username do jogador já existe
        existing_player = Player.query.filter_by(player_username=player_username).first()
        if existing_player:
            player_username = f"{player_username}_{secrets.randbelow(1000)}"
        
        player = Player(
            name=data['name'],
            age=data.get('age'),
            money=data.get('money', 0),
            health=data.get('health', 100),
            mana=data.get('mana', 50),
            vigor=data.get('vigor', 75),
            master_id=master_id,
            player_username=player_username
        )
        
        player.set_player_password(player_password)
        player.set_items(data.get('items', []))
        player.set_debuffs(data.get('debuffs', []))
        
        db.session.add(player)
        db.session.commit()
        
        # Retornar dados do jogador incluindo a senha gerada
        player_data = player.to_dict()
        player_data['generated_password'] = player_password
        
        return jsonify({
            'message': 'Jogador criado com sucesso',
            'player': player_data
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@players_bp.route('/players/<int:player_id>', methods=['GET'])
def get_player(player_id):
    try:
        # Verificar se é mestre ou jogador
        if 'user_id' in session and session.get('is_master'):
            master_id = session['user_id']
            player = Player.query.filter_by(id=player_id, master_id=master_id).first()
        elif 'player_id' in session:
            if session['player_id'] != player_id:
                return jsonify({'error': 'Acesso negado'}), 403
            player = Player.query.get(player_id)
        else:
            return jsonify({'error': 'Acesso negado'}), 403
        
        if not player:
            return jsonify({'error': 'Jogador não encontrado'}), 404
        
        return jsonify({'player': player.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@players_bp.route('/players/<int:player_id>', methods=['PUT'])
def update_player(player_id):
    auth_error = require_master()
    if auth_error:
        return auth_error
    
    try:
        master_id = session['user_id']
        player = Player.query.filter_by(id=player_id, master_id=master_id).first()
        
        if not player:
            return jsonify({'error': 'Jogador não encontrado'}), 404
        
        data = request.get_json()
        
        # Atualizar campos
        if 'name' in data:
            player.name = data['name']
        if 'age' in data:
            player.age = data['age']
        if 'money' in data:
            player.money = data['money']
        if 'health' in data:
            player.health = max(0, min(100, data['health']))
        if 'mana' in data:
            player.mana = max(0, min(100, data['mana']))
        if 'vigor' in data:
            player.vigor = max(0, min(100, data['vigor']))
        if 'items' in data:
            player.set_items(data['items'])
        if 'debuffs' in data:
            player.set_debuffs(data['debuffs'])
        if 'avatar_url' in data:
            player.avatar_url = data['avatar_url']
        
        # Atualizar credenciais do jogador se fornecidas
        if 'player_username' in data:
            # Verificar se o novo username não está em uso
            existing = Player.query.filter(
                Player.player_username == data['player_username'],
                Player.id != player_id
            ).first()
            if existing:
                return jsonify({'error': 'Username do jogador já está em uso'}), 400
            player.player_username = data['player_username']
        
        if 'player_password' in data and data['player_password']:
            player.set_player_password(data['player_password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Jogador atualizado com sucesso',
            'player': player.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@players_bp.route('/players/<int:player_id>', methods=['DELETE'])
def delete_player(player_id):
    auth_error = require_master()
    if auth_error:
        return auth_error
    
    try:
        master_id = session['user_id']
        player = Player.query.filter_by(id=player_id, master_id=master_id).first()
        
        if not player:
            return jsonify({'error': 'Jogador não encontrado'}), 404
        
        db.session.delete(player)
        db.session.commit()
        
        return jsonify({'message': 'Jogador removido com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@players_bp.route('/players/<int:player_id>/status', methods=['PUT'])
def update_player_status(player_id):
    try:
        # Permitir que tanto mestre quanto jogador atualizem status
        if 'user_id' in session and session.get('is_master'):
            master_id = session['user_id']
            player = Player.query.filter_by(id=player_id, master_id=master_id).first()
        elif 'player_id' in session and session['player_id'] == player_id:
            player = Player.query.get(player_id)
        else:
            return jsonify({'error': 'Acesso negado'}), 403
        
        if not player:
            return jsonify({'error': 'Jogador não encontrado'}), 404
        
        data = request.get_json()
        
        # Atualizar apenas status
        if 'health' in data:
            player.health = max(0, min(100, data['health']))
        if 'mana' in data:
            player.mana = max(0, min(100, data['mana']))
        if 'vigor' in data:
            player.vigor = max(0, min(100, data['vigor']))
        
        db.session.commit()
        
        return jsonify({
            'message': 'Status atualizado com sucesso',
            'player': player.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

