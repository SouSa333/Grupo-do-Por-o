import { createContext, useContext, useReducer, useEffect } from 'react'
const GameContext = createContext()
const initialState = {
  // Sistema de dados
  diceHistory: [],
  lastRoll: null,
  // Jogadores e personagens
  players: [],
  characters: [],
  // Chat e comunicação
  chatMessages: [],
  notifications: [],
  // Sessão atual
  currentSession: {
    id: null,
    name: '',
    date: null,
    notes: [],
    duration: 0
  },
  // Configurações do jogo
  gameSettings: {
    diceSound: true,
    autoSave: true,
    theme: 'dark',
    language: 'pt-BR'
  },
  // Estados da interface
  ui: {
    sidebarOpen: false,
    activePanel: 'dice',
    loading: false
  }
}
function gameReducer(state, action) {
  switch (action.type) {
    case 'ROLL_DICE':
      const newRoll = {
        id: Date.now(),
        timestamp: new Date(),
        type: action.payload.type,
        sides: action.payload.sides,
        count: action.payload.count,
        modifier: action.payload.modifier,
        results: action.payload.results,
        total: action.payload.total,
        user: action.payload.user
      }
      return {
        ...state,
        diceHistory: [newRoll, ...state.diceHistory.slice(0, 49)], // Manter apenas 50 rolagens
        lastRoll: newRoll
      }
    case 'ADD_CHAT_MESSAGE':
      const newMessage = {
        id: Date.now(),
        timestamp: new Date(),
        user: action.payload.user,
        message: action.payload.message,
        type: action.payload.type || 'text'
      }
      return {
        ...state,
        chatMessages: [...state.chatMessages, newMessage]
      }
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.payload]
      }
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.payload)
      }
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.id ? { ...player, ...action.payload.data } : player
        )
      }
    case 'ADD_CHARACTER':
      return {
        ...state,
        characters: [...state.characters, action.payload]
      }
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(char =>
          char.id === action.payload.id ? { ...char, ...action.payload.data } : char
        )
      }
    case 'ADD_SESSION_NOTE':
      const newNote = {
        id: Date.now(),
        timestamp: new Date(),
        content: action.payload.content,
        author: action.payload.author,
        type: action.payload.type || 'note'
      }
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          notes: [...state.currentSession.notes, newNote]
        }
      }
    case 'START_SESSION':
      return {
        ...state,
        currentSession: {
          id: Date.now(),
          name: action.payload.name,
          date: new Date(),
          notes: [],
          duration: 0
        }
      }
    case 'END_SESSION':
      return {
        ...state,
        currentSession: initialState.currentSession
      }
    case 'UPDATE_GAME_SETTINGS':
      return {
        ...state,
        gameSettings: { ...state.gameSettings, ...action.payload }
      }
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
      }
    case 'SET_ACTIVE_PANEL':
      return {
        ...state,
        ui: { ...state.ui, activePanel: action.payload }
      }
    case 'ADD_NOTIFICATION':
      const notification = {
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || 'info',
        timestamp: new Date()
      }
      return {
        ...state,
        notifications: [...state.notifications, notification]
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      }
    case 'CLEAR_CHAT':
      return {
        ...state,
        chatMessages: []
      }
    case 'CLEAR_DICE_HISTORY':
      return {
        ...state,
        diceHistory: [],
        lastRoll: null
      }
    default:
      return state
  }
}
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedGame = localStorage.getItem('grupodoporao_game')
    if (savedGame) {
      try {
        const gameData = JSON.parse(savedGame)
        // Restaurar apenas dados persistentes (não UI state)
        Object.keys(gameData).forEach(key => {
          if (key !== 'ui') {
            dispatch({
              type: `RESTORE_${key.toUpperCase()}`,
              payload: gameData[key]
            })
          }
        })
      } catch (error) {
        console.error('Erro ao carregar dados do jogo:', error)
      }
    }
  }, [])
  // Salvar dados no localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const dataToSave = {
        diceHistory: state.diceHistory,
        players: state.players,
        characters: state.characters,
        chatMessages: state.chatMessages,
        currentSession: state.currentSession,
        gameSettings: state.gameSettings
      }
      localStorage.setItem('grupodoporao_game', JSON.stringify(dataToSave))
    }, 1000)
    return () => clearTimeout(timer)
  }, [state])
  // Funções auxiliares
  const rollDice = (sides, count = 1, modifier = 0, user = 'Sistema') => {
    const results = []
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * sides) + 1)
    }
    const total = results.reduce((sum, result) => sum + result, 0) + modifier
    dispatch({
      type: 'ROLL_DICE',
      payload: {
        type: 'standard',
        sides,
        count,
        modifier,
        results,
        total,
        user
      }
    })
    return { results, total }
  }
  const addChatMessage = (message, user = 'Sistema', type = 'text') => {
    dispatch({
      type: 'ADD_CHAT_MESSAGE',
      payload: { message, user, type }
    })
  }
  const addNotification = (message, type = 'info') => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { message, type }
    })
    // Auto-remover notificação após 5 segundos
    setTimeout(() => {
      dispatch({
        type: 'REMOVE_NOTIFICATION',
        payload: Date.now()
      })
    }, 5000)
  }
  const value = {
    ...state,
    dispatch,
    rollDice,
    addChatMessage,
    addNotification
  }
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}
export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame deve ser usado dentro de um GameProvider')
  }
  return context
}
