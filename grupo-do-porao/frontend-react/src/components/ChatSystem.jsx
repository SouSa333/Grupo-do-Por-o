import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, Dice6, Crown, Sword, MessageCircle, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useGame } from '../../contexts/GameContext'
import { useAuth } from '../../contexts/AuthContext'
const emojis = ['🎲', '⚔️', '🛡️', '🏰', '🐉', '💎', '🔥', '⚡', '🌟', '💀', '👑', '🗡️']
const diceCommands = [
  { command: '/d20', description: 'Rola 1d20' },
  { command: '/d6', description: 'Rola 1d6' },
  { command: '/2d6', description: 'Rola 2d6' },
  { command: '/advantage', description: 'Rola d20 com vantagem' },
  { command: '/disadvantage', description: 'Rola d20 com desvantagem' }
]
export default function ChatSystem() {
  const { chatMessages, addChatMessage, rollDice } = useGame()
  const { user, userType } = useAuth()
  const [message, setMessage] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [showCommands, setShowCommands] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])
  // Detectar comandos de dados
  useEffect(() => {
    if (message.startsWith('/')) {
      setShowCommands(true)
    } else {
      setShowCommands(false)
    }
  }, [message])
  const handleSendMessage = () => {
    if (!message.trim()) return
    // Verificar se é um comando de dados
    if (message.startsWith('/')) {
      handleDiceCommand(message)
    } else {
      // Mensagem normal
      addChatMessage(message, user?.displayName || 'Anônimo', 'text')
    }
    setMessage('')
    setShowEmojis(false)
    setShowCommands(false)
  }
  const handleDiceCommand = (command) => {
    const cmd = command.toLowerCase().trim()
    let rollResult = null
    switch (cmd) {
      case '/d20':
        rollResult = rollDice(20, 1, 0, user?.displayName || 'Anônimo')
        break
      case '/d6':
        rollResult = rollDice(6, 1, 0, user?.displayName || 'Anônimo')
        break
      case '/2d6':
        rollResult = rollDice(6, 2, 0, user?.displayName || 'Anônimo')
        break
      case '/advantage':
        rollResult = rollDice(20, 2, 0, user?.displayName || 'Anônimo')
        rollResult.total = Math.max(...rollResult.results)
        rollResult.type = 'advantage'
        break
      case '/disadvantage':
        rollResult = rollDice(20, 2, 0, user?.displayName || 'Anônimo')
        rollResult.total = Math.min(...rollResult.results)
        rollResult.type = 'disadvantage'
        break
      default:
        addChatMessage(`Comando não reconhecido: ${command}`, 'Sistema', 'error')
        return
    }
    if (rollResult) {
      const diceMessage = `🎲 ${rollResult.count}d${rollResult.sides}: ${rollResult.results.join(', ')} = **${rollResult.total}**`
      addChatMessage(diceMessage, user?.displayName || 'Anônimo', 'dice')
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  const addEmoji = (emoji) => {
    setMessage(message + emoji)
    setShowEmojis(false)
    inputRef.current?.focus()
  }
  const executeCommand = (command) => {
    setMessage(command)
    setShowCommands(false)
    inputRef.current?.focus()
  }
  const getMessageIcon = (type, userType) => {
    switch (type) {
      case 'dice':
        return <Dice6 className="w-4 h-4 text-primary" />
      case 'system':
        return <Settings className="w-4 h-4 text-muted-foreground" />
      case 'error':
        return <MessageCircle className="w-4 h-4 text-destructive" />
      default:
        return userType === 'mestre' ? 
          <Crown className="w-4 h-4 text-primary" /> : 
          <Sword className="w-4 h-4 text-primary" />
    }
  }
  const formatMessage = (text) => {
    // Converter **texto** para negrito
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }
  return (
    <Card className="medieval-card h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <span>Chat da Mesa</span>
          <Badge variant="outline" className="ml-auto">
            <Users className="w-3 h-3 mr-1" />
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3 p-4">
        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          <AnimatePresence>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={`flex items-start space-x-3 ${
                  msg.user === user?.displayName ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {msg.user?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${msg.user === user?.displayName ? 'text-right' : ''}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {getMessageIcon(msg.type, msg.userType)}
                    <span className="text-sm font-medium">{msg.user}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`
                    inline-block p-3 rounded-lg max-w-xs
                    ${msg.user === user?.displayName 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                    }
                    ${msg.type === 'dice' ? 'border-l-4 border-primary' : ''}
                    ${msg.type === 'error' ? 'border-l-4 border-destructive' : ''}
                  `}>
                    <div 
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        {/* Comandos de Dados */}
        <AnimatePresence>
          {showCommands && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-muted/50 rounded-lg p-3 space-y-2"
            >
              <div className="text-xs font-medium text-muted-foreground">Comandos de Dados:</div>
              <div className="grid grid-cols-2 gap-2">
                {diceCommands.map((cmd) => (
                  <button
                    key={cmd.command}
                    onClick={() => executeCommand(cmd.command)}
                    className="text-left p-2 rounded hover:bg-muted transition-colors"
                  >
                    <div className="text-sm font-medium text-primary">{cmd.command}</div>
                    <div className="text-xs text-muted-foreground">{cmd.description}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Emojis */}
        <AnimatePresence>
          {showEmojis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-muted/50 rounded-lg p-3"
            >
              <div className="grid grid-cols-6 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="p-2 text-lg hover:bg-muted rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Input de Mensagem */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmojis(!showEmojis)}
            className="px-3"
          >
            <Smile className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem ou /comando..."
              className="medieval-input pr-12"
              maxLength={500}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              {message.length}/500
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="medieval-button px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
