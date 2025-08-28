import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Crown, Sword, Sparkles, Shield, Dice6, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import logoImage from '../assets/logo_grupo_porao_modern.png'
export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Círculos decorativos */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-primary/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-primary/5 rounded-full"
        />
        {/* Elementos mágicos flutuantes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={floatingVariants}
            animate="animate"
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            <Sparkles className="w-6 h-6 text-primary/30" />
          </motion.div>
        ))}
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center space-y-12 relative z-10"
      >
        {/* Logo e Título Principal */}
        <motion.div variants={itemVariants} className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative inline-block"
          >
            <div className="w-40 h-40 mx-auto relative">
              <img 
                src={logoImage} 
                alt="Grupo do Porão" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
              {/* Efeito de brilho no hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-full opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Grupo do Porão
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Sistema RPG de Nova Geração
            </p>
          </div>
        </motion.div>
        {/* Subtítulo e Descrição */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Seja Bem-Vindo, <span className="text-primary">Aventureiro!</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mergulhe em uma experiência RPG completamente renovada. Interface moderna, 
            dados 3D, chat em tempo real e ferramentas avançadas para mestres e jogadores.
          </p>
        </motion.div>
        {/* Botões de Acesso */}
        <motion.div variants={itemVariants} className="space-y-8">
          <p className="text-lg text-muted-foreground">
            Escolha seu caminho na aventura:
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {/* Botão Mestre */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link to="/login/mestre">
                <Button 
                  size="lg" 
                  className="medieval-button h-20 px-12 text-lg font-semibold group relative overflow-hidden"
                >
                  <div className="flex items-center space-x-4">
                    <Crown className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="text-left">
                      <div className="text-xl font-bold">Mestre</div>
                      <div className="text-sm opacity-90">Controle a aventura</div>
                    </div>
                  </div>
                  {/* Efeito de brilho no hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                    whileHover={{ translateX: "200%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </Link>
            </motion.div>
            {/* Botão Jogador */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link to="/login/jogador">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="medieval-button h-20 px-12 text-lg font-semibold group relative overflow-hidden border-primary/50 hover:border-primary"
                >
                  <div className="flex items-center space-x-4">
                    <Sword className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="text-left">
                      <div className="text-xl font-bold">Jogador</div>
                      <div className="text-sm opacity-90">Viva a aventura</div>
                    </div>
                  </div>
                  {/* Efeito de brilho no hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full"
                    whileHover={{ translateX: "200%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        {/* Features em Destaque */}
        <motion.div variants={itemVariants} className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Dice6,
                title: "Dados 3D",
                description: "Sistema avançado com animações realistas"
              },
              {
                icon: Users,
                title: "Multiplayer",
                description: "Chat em tempo real e sincronização"
              },
              {
                icon: Shield,
                title: "Ferramentas",
                description: "Geradores, mapas e muito mais"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="medieval-card p-6 text-center space-y-3 group cursor-pointer"
              >
                <feature.icon className="w-8 h-8 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Footer */}
        <motion.div variants={itemVariants} className="pt-8 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Versão 2.0 - Completamente Reformulado</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025 Grupo do Porão LTDA - Que suas aventuras sejam épicas!
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
