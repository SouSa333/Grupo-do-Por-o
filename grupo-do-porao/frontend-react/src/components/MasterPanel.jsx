import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, LogOut, Settings, Users, Dice6, MessageCircle, Map, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import { useNavigate } from 'react-router-dom'
// Componentes avançados
import DiceSystem from '../components/dice/DiceSystem'
import ChatSystem from '../components/chat/ChatSystem'
import NotesSystem from '../components/notes/NotesSystem'
import PlayerControlSystem from '../components/players/PlayerControlSystem'
export default function MasterPanel() {
  const { user, logout } = useAuth()
  const { players, currentSession } = useGame()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dice')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  const stats = {
    playersOnline: players.length,
    sessionTime: '2h 15m',
    diceRolled: 47,
    messagesExchanged: 23
  }
  return (
    <div className="min-h-screen flex">
      {/* Sidebar de Jogadores */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        className="w-80 bg-card/95 backdrop-blur-sm border-r border-border p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Jogadores</span>
          </h3>
          <Badge variant="outline">
            {stats.playersOnline} Online
          </Badge>
        </div>
        {/* Lista de Jogadores */}
        <div className="space-y-3">
          {players.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum jogador conectado</p>
              <Button variant="outline" size="sm" className="mt-3">
                Convidar Jogadores
              </Button>
            </div>
          ) : (
            players.map((player) => (
              <motion.div
                key={player.id}
                whileHover={{ scale: 1.02 }}
                className="medieval-card p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{player.name}</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {player.character || 'Sem personagem'}
                </div>
              </motion.div>
            ))
          )}
        </div>
        {/* Ferramentas Rápidas */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">FERRAMENTAS RÁPIDAS</h4>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Gerador de NPCs
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Map className="w-4 h-4 mr-2" />
            Mapas Interativos
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Dice6 className="w-4 h-4 mr-2" />
            Rolagem Secreta
          </Button>
        </div>
        {/* Estatísticas da Sessão */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">SESSÃO ATUAL</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{stats.sessionTime}</div>
              <div className="text-xs text-muted-foreground">Tempo</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{stats.diceRolled}</div>
              <div className="text-xs text-muted-foreground">Dados</div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/95 backdrop-blur-sm border-b border-border p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Users className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Painel do Mestre</h1>
                  <p className="text-muted-foreground">
                    Bem-vindo, {user?.displayName}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 mr-2" />
                ) : (
                  <VolumeX className="w-4 h-4 mr-2" />
                )}
                Som
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </motion.div>
        {/* Área Principal com Tabs */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="dice" className="flex items-center space-x-2">
                <Dice6 className="w-4 h-4" />
                <span>Dados</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="maps" className="flex items-center space-x-2">
                <Map className="w-4 h-4" />
                <span>Mapas</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Ferramentas</span>
              </TabsTrigger>
              <TabsTrigger value="players" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Jogadores</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Notas</span>
              </TabsTrigger>
            </TabsList>
            {/* Aba Sistema de Dados */}
            <TabsContent value="dice" className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <DiceSystem />
              </motion.div>
            </TabsContent>
            {/* Aba Chat */}
            <TabsContent value="chat" className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  <ChatSystem />
                  {/* Painel de Controle do Chat */}
                  <Card className="medieval-card">
                    <CardHeader>
                      <CardTitle>Controles do Mestre</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <Button className="w-full medieval-button" variant="outline">
                          <Dice6 className="w-4 h-4 mr-2" />
                          Rolagem Pública
                        </Button>
                        <Button className="w-full medieval-button" variant="outline">
                          <Users className="w-4 h-4 mr-2" />
                          Mensagem para Todos
                        </Button>
                        <Button className="w-full medieval-button" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Sussurro Privado
                        </Button>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Comandos Rápidos</h4>
                        <div className="space-y-2 text-sm">
                          <div><code>/roll 1d20</code> - Rolar dados</div>
                          <div><code>/whisper [jogador]</code> - Sussurrar</div>
                          <div><code>/initiative</code> - Rolar iniciativa</div>
                          <div><code>/hp [valor]</code> - Ajustar HP</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
            {/* Aba Mapas */}
            <TabsContent value="maps" className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
              </motion.div>
            </TabsContent>
            {/* Aba Ferramentas */}
            <TabsContent value="tools" className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
              </motion.div>
            </TabsContent>
            {/* Aba Controle de Jogadores */}
            <TabsContent value="players" className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <PlayerControlSystem />
              </motion.div>
            </TabsContent>
            {/* Aba Notas */}
            <TabsContent value="notes" className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <NotesSystem />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
