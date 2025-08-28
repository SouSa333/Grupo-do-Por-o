# ⚛️ Frontend React - Grupo do Porão

Versão moderna do sistema RPG desenvolvida em React.

## 📋 Sobre

Esta é a versão mais recente do projeto, desenvolvida com React e tecnologias modernas. Oferece uma interface mais dinâmica e componentes reutilizáveis.

## 🛠️ Tecnologias

- **React**: Biblioteca principal
- **JSX**: Sintaxe de componentes
- **CSS3**: Estilização moderna
- **HTML5**: Estrutura base

## 📁 Estrutura

```
frontend-react/
├── src/
│   ├── components/     # Componentes React
│   └── styles/         # Arquivos CSS
├── public/             # Arquivos públicos
├── assets/             # Recursos estáticos
└── README.md           # Esta documentação
```

## 🚀 Componentes Principais

### Core Components
- `App.jsx` - Componente principal da aplicação
- `AuthContext.jsx` - Contexto de autenticação
- `GameContext.jsx` - Contexto do jogo

### Interface Components
- `HomePage.jsx` - Página inicial
- `LoginPage.jsx` - Página de login
- `LoadingScreen.jsx` - Tela de carregamento
- `ParticleBackground.jsx` - Fundo com partículas

### Game Components
- `MasterPanel.jsx` - Painel do mestre
- `PlayerPanel.jsx` - Painel do jogador
- `CharacterSheet.jsx` - Ficha de personagem
- `ReadOnlyCharacterSheet.jsx` - Ficha somente leitura

### System Components
- `DiceSystem.jsx` - Sistema de dados
- `ChatSystem.jsx` - Sistema de chat
- `NotesSystem.jsx` - Sistema de notas
- `PlayerControlSystem.jsx` - Controle de jogadores
- `PlayerTagSystem.jsx` - Sistema de tags

## 🎯 Funcionalidades

- Interface moderna e responsiva
- Componentes reutilizáveis
- Gerenciamento de estado com Context API
- Sistema de autenticação
- Painéis interativos para mestre e jogador
- Sistema de dados avançado
- Chat em tempo real
- Gerenciamento de personagens

## 🔧 Desenvolvimento

### Pré-requisitos
- Node.js (versão 14+)
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build
```

### Estrutura de Desenvolvimento
- Componentes em `src/components/`
- Estilos em `src/styles/`
- Assets em `assets/`
- Arquivos públicos em `public/`

## 📱 Responsividade

A interface foi desenvolvida para funcionar em:
- Desktop (1920x1080+)
- Tablet (768x1024)
- Mobile (375x667+)

## 🎨 Temas

Suporte a temas claro e escuro através de CSS variables.

## 🔄 Integração

### Backend
Integra com o backend Python/Flask localizado em `../backend/`

### Legacy
Pode coexistir com a versão legacy em `../frontend-legacy/`

## 📖 Documentação Adicional

Consulte a pasta `../docs/` para:
- Documentação técnica completa
- Guias de desenvolvimento
- Relatórios de funcionalidades

## 🐛 Problemas Conhecidos

Consulte `../docs/todo-correcoes.md` para lista de correções pendentes.

## 🤝 Contribuição

1. Siga os padrões React estabelecidos
2. Use componentes funcionais com hooks
3. Mantenha a responsividade
4. Teste em diferentes navegadores
5. Atualize esta documentação

---

**Versão React - Moderna e Dinâmica** ⚛️

