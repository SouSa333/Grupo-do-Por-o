import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sword, LogOut, Settings, User, Dice6, MessageCircle, Backpack, BookOpen, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import { useNavigate } from 'react-router-dom'
// Componentes avançados
import DiceSystem from '../components/dice/DiceSystem'
import ChatSystem from '../components/chat/ChatSystem'
import ReadOnlyCharacterSheet from '../components/character/ReadOnlyCharacterSheet'
import PlayerTagSystem from '../components/player/PlayerTagSystem'
export default function PlayerPanel() {
  const { user, logout } = useAuth()
  const { currentCharacter } = useGame()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('character')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  // Dados do personagem (mock para demonstração)
  const character = currentCharacter || {
    name: 'Aventureiro',
    class: 'Guerreiro',
    level: 3,
    hitPoints: { current: 28, max: 35 },
    armorClass: 16,
    proficiencyBonus: 2
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/95 backdrop-blur-sm border-b border-border p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Sword className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Painel do Jogador</h1>
              <p className="text-muted-foreground">
                Bem-vindo, {user?.displayName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Status do Personagem */}
            {character && (
              <div className="flex items-center space-x-4 px-4 py-2 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm font-medium">{character.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {character.class} Nv. {character.level}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs">HP:</div>
                  <Progress 
                    value={(character.hitPoints.current / character.hitPoints.max) * 100}
                    className="w-16 h-2"
                  />
                  <div className="text-xs font-mono">
                    {character.hitPoints.current}/{character.hitPoints.max}
                  </div>
                </div>
                <Badge variant="outline">
                  CA {character.armorClass}
                </Badge>
              </div>
            )}
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
            <TabsTrigger value="character" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Personagem</span>
            </TabsTrigger>
            <TabsTrigger value="dice" className="flex items-center space-x-2">
              <Dice6 className="w-4 h-4" />
              <span>Dados</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <Backpack className="w-4 h-4" />
              <span>Inventário</span>
            </TabsTrigger>
            <TabsTrigger value="tag" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Minha Tag</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Notas</span>
            </TabsTrigger>
          </TabsList>
          {/* Aba Ficha do Personagem */}
          <TabsContent value="character" className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <ReadOnlyCharacterSheet />
            </motion.div>
          </TabsContent>
          {/* Aba Sistema de Dados */}
          <TabsContent value="dice" className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-2">
                  <DiceSystem />
                </div>
                {/* Painel de Ações Rápidas */}
                <Card className="medieval-card">
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button className="w-full medieval-button" variant="outline">
                        <Dice6 className="w-4 h-4 mr-2" />
                        Teste de Atributo
                      </Button>
                      <Button className="w-full medieval-button" variant="outline">
                        <Sword className="w-4 h-4 mr-2" />
                        Ataque
                      </Button>
                      <Button className="w-full medieval-button" variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        Teste de Perícia
                      </Button>
                      <Button className="w-full medieval-button" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Teste de Resistência
                      </Button>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Rolagens Comuns</h4>
                      <div className="space-y-2">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          d20 + Força
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          d20 + Destreza
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          d20 + Constituição
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Iniciativa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
          {/* Aba Chat */}
          <TabsContent value="chat" className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-2">
                  <ChatSystem />
                </div>
                {/* Painel de Comunicação */}
                <Card className="medieval-card">
                  <CardHeader>
                    <CardTitle>Comunicação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button className="w-full medieval-button" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Falar em Voz Alta
                      </Button>
                      <Button className="w-full medieval-button" variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        Sussurrar para Mestre
                      </Button>
                      <Button className="w-full medieval-button" variant="outline">
                        <Dice6 className="w-4 h-4 mr-2" />
                        Rolagem Pública
                      </Button>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Emotes Rápidos</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {['👋', '😄', '😮', '😤', '🤔', '😴', '⚔️', '🛡️', '🎲'].map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            className="text-lg"
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Comandos</h4>
                      <div className="space-y-2 text-sm">
                        <div><code>/roll 1d20</code> - Rolar dados</div>
                        <div><code>/whisper</code> - Sussurrar</div>
                        <div><code>/me [ação]</code> - Ação narrativa</div>
                        <div><code>/ooc</code> - Fora do personagem</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
          {/* Aba Inventário */}
          <TabsContent value="inventory">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Aviso de Somente Leitura */}
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-orange-100">Inventário - Somente Leitura</h3>
                </div>
                <p className="text-gray-300">
                  Todos os itens, equipamentos e inventário são controlados pelo mestre. 
                  Você pode apenas visualizar seus equipamentos, mas não pode adicionar, remover ou modificar itens.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inventário Principal */}
                <div className="lg:col-span-2">
                  <Card className="medieval-card">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Backpack className="w-5 h-5 text-primary" />
                          <span>Inventário</span>
                        </div>
                        <Badge variant="secondary" className="bg-orange-600 text-white">
                          Somente Leitura
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Itens de exemplo (somente leitura) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-black/20 border border-gray-600 rounded-lg p-3 opacity-75">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-700 rounded border flex items-center justify-center">
                                <Sword className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-white">Espada Longa +1</h4>
                                <p className="text-sm text-gray-400">Arma • Dano: 1d8+1</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-black/20 border border-gray-600 rounded-lg p-3 opacity-75">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-700 rounded border flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-white">Armadura de Couro</h4>
                                <p className="text-sm text-gray-400">Armadura • CA: 11 + Mod Des</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-black/20 border border-gray-600 rounded-lg p-3 opacity-75">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-700 rounded border flex items-center justify-center">
                                <span className="text-yellow-400">💰</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-white">Moedas de Ouro</h4>
                                <p className="text-sm text-gray-400">Dinheiro • 150 PO</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-black/20 border border-gray-600 rounded-lg p-3 opacity-75">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-700 rounded border flex items-center justify-center">
                                <span className="text-red-400">🧪</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-white">Poção de Cura</h4>
                                <p className="text-sm text-gray-400">Consumível • Cura 2d4+2 HP</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center py-8 border-t border-gray-600">
                          <Backpack className="w-12 h-12 mx-auto text-gray-500 mb-3" />
                          <p className="text-gray-400 mb-2">
                            Apenas o mestre pode adicionar ou remover itens
                          </p>
                          <p className="text-sm text-gray-500">
                            Peça ao seu mestre para gerenciar seu inventário
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Equipamentos Equipados */}
                <Card className="medieval-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Equipado</span>
                      <Badge variant="secondary" className="bg-orange-600 text-white text-xs">
                        Somente Leitura
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Arma Principal */}
                      <div className="bg-black/20 border border-gray-600 rounded-lg p-3">
                        <div className="text-center">
                          <Sword className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <div className="text-sm font-medium text-white">Espada Longa +1</div>
                          <div className="text-xs text-gray-400">Arma Principal</div>
                        </div>
                      </div>
                      {/* Armadura */}
                      <div className="bg-black/20 border border-gray-600 rounded-lg p-3">
                        <div className="text-center">
                          <User className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <div className="text-sm font-medium text-white">Armadura de Couro</div>
                          <div className="text-xs text-gray-400">Armadura</div>
                        </div>
                      </div>
                      {/* Escudo */}
                      <div className="text-center p-4 border-2 border-dashed border-gray-600 rounded-lg opacity-50">
                        <div className="text-sm text-gray-500">Escudo</div>
                        <div className="text-xs text-gray-600 mt-1">Nenhum equipado</div>
                      </div>
                      <div className="pt-4 border-t border-gray-600">
                        <p className="text-xs text-gray-500 text-center">
                          Equipamentos controlados pelo mestre
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
          {/* Aba Minha Tag */}
          <TabsContent value="tag">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PlayerTagSystem />
            </motion.div>
          </TabsContent>
          {/* Aba Notas */}
          <TabsContent value="notes">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="medieval-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>Notas Pessoais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 space-y-4">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50" />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Sistema de Notas</h3>
                      <p className="text-muted-foreground mb-4">
                        Mantenha suas anotações, objetivos e lembretes organizados
                      </p>
                      <Button className="medieval-button">
                        Nova Nota
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
