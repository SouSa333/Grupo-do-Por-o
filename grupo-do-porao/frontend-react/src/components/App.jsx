import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
// Páginas
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MasterPanel from './pages/MasterPanel'
import PlayerPanel from './pages/PlayerPanel'
// Contextos
import { AuthProvider } from './contexts/AuthContext'
import { GameProvider } from './contexts/GameContext'
// Componentes
import LoadingScreen from './components/LoadingScreen'
import ParticleBackground from './components/ParticleBackground'
function App() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])
  if (isLoading) {
    return <LoadingScreen />
  }
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen relative overflow-hidden">
            <ParticleBackground />
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <HomePage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/login/:userType" 
                  element={
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LoginPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/mestre" 
                  element={
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <MasterPanel />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/jogador" 
                  element={
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.4 }}
                    >
                      <PlayerPanel />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </GameProvider>
    </AuthProvider>
  )
}
export default App
