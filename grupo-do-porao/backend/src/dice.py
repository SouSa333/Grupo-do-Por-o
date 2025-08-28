from flask import Blueprint, request, jsonify, session
from src.models.user import db, DiceRoll
import random

dice_bp = Blueprint('dice', __name__)

@dice_bp.route('/roll', methods=['POST'])
def roll_dice():
    try:
        data = request.get_json()
        
        if not data or 'dice_type' not in data:
            return jsonify({'error': 'Tipo de dado é obrigatório'}), 400
        
        dice_type = int(data['dice_type'])
        
        if dice_type not in [4, 20, 100]:
            return jsonify({'error': 'Tipo de dado inválido. Use 4, 20 ou 100'}), 400
        
        # Rolar o dado
        result = random.randint(1, dice_type)
        
        # Salvar no histórico se houver usuário logado
        if 'user_id' in session:
            dice_roll = DiceRoll(
                dice_type=dice_type,
                result=result,
                master_id=session['user_id'],
                player_id=data.get('player_id')
            )
            db.session.add(dice_roll)
            db.session.commit()
        elif 'player_id' in session:
            dice_roll = DiceRoll(
                dice_type=dice_type,
                result=result,
                master_id=session['master_id'],
                player_id=session['player_id']
            )
            db.session.add(dice_roll)
            db.session.commit()
        
        # Determinar efeitos especiais
        special_effect = None
        if dice_type == 20:
            if result == 20:
                special_effect = 'critical_success'
            elif result == 1:
                special_effect = 'critical_failure'
        
        return jsonify({
            'dice_type': dice_type,
            'result': result,
            'special_effect': special_effect,
            'timestamp': dice_roll.created_at.isoformat() if 'dice_roll' in locals() else None
        }), 200
        
    except Exception as e:
        if 'dice_roll' in locals():
            db.session.rollback()
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

@dice_bp.route('/history', methods=['GET'])
def get_dice_history():
    try:
        if 'user_id' in session:
            # Mestre pode ver todo o histórico
            master_id = session['user_id']
            rolls = DiceRoll.query.filter_by(master_id=master_id).order_by(DiceRoll.created_at.desc()).limit(50).all()
        elif 'player_id' in session:
            # Jogador vê apenas suas rolagens
            player_id = session['player_id']
            rolls = DiceRoll.query.filter_by(player_id=player_id).order_by(DiceRoll.created_at.desc()).limit(20).all()
        else:
            return jsonify({'error': 'Acesso negado'}), 403
        
        return jsonify({
            'rolls': [roll.to_dict() for roll in rolls]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

