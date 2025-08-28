import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'
import logoImage from '../assets/logo_grupo_porao_modern.png'
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Logo com animação */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
          className="relative"
        >
          <div className="w-32 h-32 mx-auto relative">
            <img 
              src={logoImage} 
              alt="Grupo do Porão" 
              className="w-full h-full object-contain"
            />
            {/* Efeito de brilho rotativo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(212, 175, 55, 0.3), transparent)',
              }}
            />
          </div>
        </motion.div>
        {/* Título com efeito de digitação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold text-primary">
            Grupo do Porão
          </h1>
          <p className="text-lg text-muted-foreground">
            Sistema RPG Moderno
          </p>
        </motion.div>
        {/* Indicador de carregamento */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex items-center justify-center space-x-3"
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Carregando aventura...</span>
        </motion.div>
        {/* Partículas mágicas */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [null, -100]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
              className="absolute"
            >
              <Sparkles className="w-4 h-4 text-primary/60" />
            </motion.div>
          ))}
        </div>
        {/* Barra de progresso animada */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ delay: 1.5, duration: 1 }}
          className="w-64 mx-auto"
        >
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                delay: 1.5, 
                duration: 1.5, 
                ease: "easeInOut" 
              }}
              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
