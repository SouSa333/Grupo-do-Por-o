# 🐍 Backend - Grupo do Porão

Backend Python/Flask para o sistema RPG Grupo do Porão.

## 📋 Sobre

Este é o backend do sistema, desenvolvido em Python com Flask. Fornece API REST, autenticação, gerenciamento de dados e integração com banco de dados SQLite.

## 🛠️ Tecnologias

- **Python 3.8+**: Linguagem principal
- **Flask**: Framework web
- **SQLite**: Banco de dados
- **SQLAlchemy**: ORM (se aplicável)
- **JSON**: Formato de dados

## 📁 Estrutura

```
backend/
├── main.py             # Arquivo principal da aplicação
├── requirements.txt    # Dependências Python
├── src/                # Código fonte
│   ├── __init__.py     # Inicialização do módulo
│   ├── auth.py         # Sistema de autenticação
│   ├── dice.py         # Sistema de dados
│   ├── notes.py        # Sistema de notas
│   ├── players.py      # Gerenciamento de jogadores
│   └── models/         # Modelos de dados
│       ├── __init__.py
│       ├── user.py     # Modelo de usuário
│       └── settings.json # Configurações
├── database/           # Banco de dados
│   └── app.db         # Banco SQLite
└── README.md          # Esta documentação
```

## 🚀 Funcionalidades

### Autenticação (`auth.py`)
- Sistema de login para mestre e jogadores
- Gerenciamento de sessões
- Validação de credenciais
- Controle de acesso

### Sistema de Dados (`dice.py`)
- API para rolagem de dados
- Suporte a diferentes tipos (d4, d6, d8, d10, d12, d20, d100)
- Modificadores e vantagem/desvantagem
- Histórico de rolagens

### Sistema de Notas (`notes.py`)
- CRUD de notas de sessão
- Organização por timestamp
- Busca e filtros
- Persistência no banco

### Gerenciamento de Jogadores (`players.py`)
- Cadastro e edição de jogadores
- Sistema de tags únicas
- Controle de atributos
- Gerenciamento de equipamentos
- Fichas de personagem

### Modelos de Dados (`models/`)
- Estruturas de dados padronizadas
- Validação de entrada
- Configurações do sistema

## 🔧 Instalação

### Pré-requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Configuração
```bash
# Criar ambiente virtual (recomendado)
python -m venv venv

# Ativar ambiente virtual
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

### Executar
```bash
# Executar servidor de desenvolvimento
python main.py

# Ou usando Flask diretamente
flask run
```

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/logout` - Logout
- `GET /api/auth/status` - Status da sessão

### Dados
- `POST /api/dice/roll` - Rolar dados
- `GET /api/dice/history` - Histórico de rolagens

### Notas
- `GET /api/notes` - Listar notas
- `POST /api/notes` - Criar nota
- `PUT /api/notes/{id}` - Editar nota
- `DELETE /api/notes/{id}` - Excluir nota

### Jogadores
- `GET /api/players` - Listar jogadores
- `POST /api/players` - Adicionar jogador
- `PUT /api/players/{id}` - Editar jogador
- `DELETE /api/players/{id}` - Remover jogador
- `GET /api/players/{id}/character` - Ficha do personagem

## 🗄️ Banco de Dados

### SQLite (`database/app.db`)
- Banco leve e portátil
- Sem necessidade de servidor separado
- Backup simples (copiar arquivo)

### Tabelas Principais
- `users` - Usuários do sistema
- `players` - Jogadores e personagens
- `notes` - Notas de sessão
- `dice_history` - Histórico de rolagens
- `settings` - Configurações do sistema

## ⚙️ Configuração

### Arquivo `src/models/settings.json`
```json
{
  "database_url": "sqlite:///database/app.db",
  "secret_key": "sua-chave-secreta",
  "debug": false,
  "port": 5000
}
```

### Variáveis de Ambiente
- `FLASK_ENV` - Ambiente (development/production)
- `FLASK_DEBUG` - Debug mode (True/False)
- `DATABASE_URL` - URL do banco de dados

## 🔒 Segurança

### Implementado
- Validação de entrada
- Sanitização de dados
- Controle de sessão
- Proteção CSRF (se aplicável)

### Recomendações
- Use HTTPS em produção
- Configure firewall adequadamente
- Mantenha dependências atualizadas
- Faça backup regular do banco

## 🚀 Deploy

### Desenvolvimento
```bash
python main.py
```

### Produção
```bash
# Usando Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 main:app

# Usando uWSGI
pip install uwsgi
uwsgi --http :5000 --wsgi-file main.py --callable app
```

### Docker (se aplicável)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "main.py"]
```

## 🔄 Integração

### Frontend React
Configurar CORS para permitir requisições do frontend React.

### Frontend Legacy
API compatível com JavaScript vanilla.

### Banco de Dados
SQLite para desenvolvimento, PostgreSQL/MySQL para produção.

## 📊 Monitoramento

### Logs
- Logs de acesso
- Logs de erro
- Logs de debug (desenvolvimento)

### Métricas
- Tempo de resposta
- Uso de memória
- Conexões ativas

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
python -m pytest tests/

# Testes de integração
python -m pytest tests/integration/

# Cobertura
python -m pytest --cov=src tests/
```

## 📖 Documentação Adicional

Consulte a pasta `../docs/` para:
- Documentação técnica completa
- Guias de desenvolvimento
- Relatórios de funcionalidades

## 🐛 Problemas Conhecidos

Consulte `../docs/todo-correcoes.md` para correções pendentes.

## 🤝 Contribuição

1. Siga PEP 8 para estilo de código Python
2. Adicione testes para novas funcionalidades
3. Documente APIs adequadamente
4. Mantenha compatibilidade com versões anteriores
5. Atualize esta documentação

## 📦 Dependências

### Principais
- Flask - Framework web
- SQLAlchemy - ORM
- Werkzeug - Utilitários WSGI
- Jinja2 - Template engine

### Desenvolvimento
- pytest - Testes
- black - Formatação de código
- flake8 - Linting
- mypy - Type checking

---

**Backend Python/Flask - Robusto e Escalável** 🐍

