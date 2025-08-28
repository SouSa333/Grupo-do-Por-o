import os
import sys

# Adiciona o diretório pai (grupodoporao) ao sys.path para que os módulos em src sejam encontrados
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, send_from_directory, render_template
from flask_cors import CORS
from src.models.user import db

# Importar blueprints diretamente da pasta src
from src.auth import auth_bp
from src.players import players_bp
from src.notes import notes_bp
from src.dice import dice_bp

app = Flask(__name__,
            static_folder=os.path.join(os.path.dirname(__file__), '..', 'static'),
            template_folder=os.path.join(os.path.dirname(__file__), '..', 'templates'))
app.config["SECRET_KEY"] = "rpg_grupo_porao_secret_key_2025"

# Habilitar CORS para todas as rotas
CORS(app, supports_credentials=True)

# Registrar blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(players_bp, url_prefix="/api")
app.register_blueprint(notes_bp, url_prefix="/api")
app.register_blueprint(dice_bp, url_prefix="/api/dice")

# Configuração do banco de dados
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/logins/<path:filename>")
def serve_logins(filename):
    # Agora os arquivos de login estão diretamente na pasta templates
    return render_template(filename)

@app.route("/painemestre/<path:filename>")
def serve_painel_mestre(filename):
    # Agora os arquivos do painel do mestre estão diretamente na pasta templates
    return render_template(filename)

@app.route("/jogador/<path:filename>")
def serve_jogador(filename):
    # Agora os arquivos do jogador estão diretamente na pasta templates
    return render_template(filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


