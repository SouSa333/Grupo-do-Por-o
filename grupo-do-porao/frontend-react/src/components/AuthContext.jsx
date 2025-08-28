import { createContext, useContext, useReducer, useEffect } from 'react'
const AuthContext = createContext()
const initialState = {
  user: null,
  isAuthenticated: false,
  userType: null, // 'mestre' ou 'jogador'
  loading: false,
  error: null
}
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        userType: action.payload.userType,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    case 'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...initialState
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    default:
      return state
  }
}
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedAuth = localStorage.getItem('grupodoporao_auth')
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: authData
        })
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error)
        localStorage.removeItem('grupodoporao_auth')
      }
    }
  }, [])
  // Salvar dados no localStorage quando o estado mudar
  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('grupodoporao_auth', JSON.stringify({
        user: state.user,
        userType: state.userType
      }))
    } else {
      localStorage.removeItem('grupodoporao_auth')
    }
  }, [state.isAuthenticated, state.user, state.userType])
  const login = async (credentials, userType) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      // Simular validação de credenciais
      await new Promise(resolve => setTimeout(resolve, 1000))
      const validCredentials = {
        mestre: { username: 'MESTRE', password: '12345677' },
        jogador: { username: 'JOGADOR', password: '123456' }
      }
      const valid = validCredentials[userType]
      if (credentials.username === valid.username && credentials.password === valid.password) {
        const user = {
          id: userType === 'mestre' ? 'master_001' : 'player_001',
          username: credentials.username,
          displayName: userType === 'mestre' ? 'Mestre da Mesa' : 'Aventureiro',
          avatar: null,
          preferences: {
            theme: 'dark',
            notifications: true,
            soundEffects: true
          },
          stats: {
            sessionsPlayed: Math.floor(Math.random() * 50) + 1,
            diceRolled: Math.floor(Math.random() * 1000) + 100,
            charactersCreated: userType === 'jogador' ? Math.floor(Math.random() * 10) + 1 : 0
          }
        }
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, userType }
        })
        return { success: true }
      } else {
        throw new Error('Credenciais inválidas')
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }
  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    })
  }
  const value = {
    ...state,
    login,
    logout,
    updateUser
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
