from flask import Blueprint, request, jsonify, session
from src.models.user import db, Note
from datetime import datetime

notes_bp = Blueprint('notes', __name__)

def require_master():
    """Decorator para verificar se o usuário é um mestre logado"""
    if 'user_id' not in session or not session.get('is_master'):
        return jsonify({'error': 'Acesso negado. Apenas mestres podem acessar esta funcionalidade'}), 403
    return None

@notes_bp.route('/notes', methods=['GET'])
def get_notes():
    auth_error = require_master()
    if auth_error:
        return auth_error
    
    try:
        master_id = session['user_id']
        notes = Note.query.filter_by(master_id=master_id).order_by(Note.created_at.desc()).all()
        
        return jsonify({
            'notes': [note.to_dict() for note in notes]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@notes_bp.route('/notes', methods=['POST'])
def create_note():
    auth_error = require_master()
    if auth_error:
        return auth_error
    
    try:
        data = request.get_json()
        
        if not data or not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Título e conteúdo são obrigatórios'}), 400
        
        master_id = session['user_id']
        
        note = Note(
            title=data['title'],
            content=data['content'],
            theme=data.get('theme', ''),
            master_id=master_id
        )
        
        db.session.add(note)
        db.session.commit()
        
        return jsonify({
            'message': 'Anotação criada com sucesso',
            'note': note.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@notes_bp.route('/notes/<int:note_id>', methods=['GET'])
def get_note(note_id):
    auth_error = require_master()
    if auth_error:
        return auth_error
    
    try:
        master_id = session['user_id']
        note = Note.query.filter_by(id=note_id, master_id=master_id).first()
        
        if not note:
            return jsonify({'error': 'Anotação não encontrada'}), 404
        
        return jsonify({'note': note.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@notes_bp.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    auth_error = require_master()
    if auth_error:
        return auth_error
    
    try:
        master_id = session['user_id']
        note = Note.query.filter_by(id=note_id, master_id=master_id).first()
        
        if not note:
            return jsonify({'error': 'Anotação não encontrada'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            note.title = data['title']
        if 'content' in data:
            note.content = data['content']
        if 'theme' in data:
            note.theme = data['theme']
        
        note.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Anotação atualizada com sucesso',
            'note': note.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@notes_bp.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    auth_error = require_master()
    if auth_error:
        return auth_error
    
    try:
        master_id = session['user_id']
        note = Note.query.filter_by(id=note_id, master_id=master_id).first()
        
        if not note:
            return jsonify({'error': 'Anotação não encontrada'}), 404
        
        db.session.delete(note)
        db.session.commit()
        
        return jsonify({'message': 'Anotação removida com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

