import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Plus, Minus, RotateCcw, History, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGame } from '../../contexts/GameContext'
import { useAuth } from '../../contexts/AuthContext'
const diceIcons = {
  1: Dice1,
  2: Dice2,
  3: Dice3,
  4: Dice4,
  5: Dice5,
  6: Dice6
}
export default function DiceSystem() {
  const { rollDice, diceHistory, lastRoll } = useGame()
  const { user } = useAuth()
  const [diceConfig, setDiceConfig] = useState({
    sides: 20,
    count: 1,
    modifier: 0,
    advantage: false,
    disadvantage: false
  })
  const [isRolling, setIsRolling] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [rollAnimation, setRollAnimation] = useState(null)
  const diceTypes = [
    { value: 4, label: 'd4', color: 'bg-blue-500' },
    { value: 6, label: 'd6', color: 'bg-green-500' },
    { value: 8, label: 'd8', color: 'bg-yellow-500' },
    { value: 10, label: 'd10', color: 'bg-orange-500' },
    { value: 12, label: 'd12', color: 'bg-red-500' },
    { value: 20, label: 'd20', color: 'bg-purple-500' },
    { value: 100, label: 'd100', color: 'bg-pink-500' }
  ]
  const handleRoll = async () => {
    if (isRolling) return
    setIsRolling(true)
    setRollAnimation('rolling')
    // Simular tempo de rolagem para animação
    await new Promise(resolve => setTimeout(resolve, 1500))
    let rollCount = diceConfig.count
    // Advantage/Disadvantage para d20
    if (diceConfig.sides === 20 && (diceConfig.advantage || diceConfig.disadvantage)) {
      rollCount = 2
    }
    const result = rollDice(
      diceConfig.sides,
      rollCount,
      diceConfig.modifier,
      user?.displayName || 'Jogador'
    )
    // Para advantage/disadvantage, pegar o maior/menor
    if (diceConfig.sides === 20 && diceConfig.advantage) {
      result.total = Math.max(...result.results) + diceConfig.modifier
    } else if (diceConfig.sides === 20 && diceConfig.disadvantage) {
      result.total = Math.min(...result.results) + diceConfig.modifier
    }
    setRollAnimation('result')
    setIsRolling(false)
    // Limpar animação após mostrar resultado
    setTimeout(() => setRollAnimation(null), 3000)
  }
  const getDiceIcon = (value) => {
    if (value <= 6) {
      const IconComponent = diceIcons[value]
      return <IconComponent className="w-8 h-8" />
    }
    return <div className="w-8 h-8 flex items-center justify-center text-lg font-bold">{value}</div>
  }
  const getDiceColor = (sides) => {
    const dice = diceTypes.find(d => d.value === sides)
    return dice?.color || 'bg-gray-500'
  }
  const getCriticalType = (roll, sides) => {
    if (roll === 1) return 'critical-fail'
    if (roll === sides) return 'critical-success'
    return 'normal'
  }
  return (
    <div className="space-y-6">
      {/* Configuração dos Dados */}
      <Card className="medieval-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dice6 className="w-5 h-5 text-primary" />
            <span>Sistema de Dados 3D</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tipo de Dado */}
            <div className="space-y-2">
              <Label>Tipo de Dado</Label>
              <Select 
                value={diceConfig.sides.toString()} 
                onValueChange={(value) => setDiceConfig({...diceConfig, sides: parseInt(value)})}
              >
                <SelectTrigger className="medieval-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {diceTypes.map(dice => (
                    <SelectItem key={dice.value} value={dice.value.toString()}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${dice.color}`}></div>
                        <span>{dice.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Quantidade */}
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDiceConfig({...diceConfig, count: Math.max(1, diceConfig.count - 1)})}
                  disabled={diceConfig.count <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={diceConfig.count}
                  onChange={(e) => setDiceConfig({...diceConfig, count: parseInt(e.target.value) || 1})}
                  className="medieval-input text-center w-16"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDiceConfig({...diceConfig, count: Math.min(10, diceConfig.count + 1)})}
                  disabled={diceConfig.count >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Modificador */}
            <div className="space-y-2">
              <Label>Modificador</Label>
              <Input
                type="number"
                value={diceConfig.modifier}
                onChange={(e) => setDiceConfig({...diceConfig, modifier: parseInt(e.target.value) || 0})}
                className="medieval-input"
                placeholder="0"
              />
            </div>
            {/* Botão de Rolagem */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                onClick={handleRoll}
                disabled={isRolling}
                className="w-full medieval-button"
                size="lg"
              >
                {isRolling ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <Dice6 className="w-5 h-5 mr-2" />
                    Rolar
                  </>
                )}
              </Button>
            </div>
          </div>
          {/* Advantage/Disadvantage para d20 */}
          {diceConfig.sides === 20 && (
            <div className="flex items-center space-x-4">
              <Button
                variant={diceConfig.advantage ? "default" : "outline"}
                size="sm"
                onClick={() => setDiceConfig({
                  ...diceConfig, 
                  advantage: !diceConfig.advantage,
                  disadvantage: false
                })}
              >
                Vantagem
              </Button>
              <Button
                variant={diceConfig.disadvantage ? "default" : "outline"}
                size="sm"
                onClick={() => setDiceConfig({
                  ...diceConfig, 
                  disadvantage: !diceConfig.disadvantage,
                  advantage: false
                })}
              >
                Desvantagem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Área de Resultado */}
      <AnimatePresence>
        {(lastRoll || rollAnimation) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="medieval-card p-8 text-center space-y-6"
          >
            {rollAnimation === 'rolling' ? (
              <div className="space-y-4">
                <motion.div
                  animate={{ 
                    rotateX: [0, 360, 720, 1080],
                    rotateY: [0, 360, 720, 1080],
                    scale: [1, 1.2, 1, 1.2, 1]
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className={`w-24 h-24 mx-auto rounded-lg ${getDiceColor(diceConfig.sides)} flex items-center justify-center text-white text-2xl font-bold shadow-2xl`}
                >
                  <Dice6 className="w-12 h-12" />
                </motion.div>
                <p className="text-lg text-muted-foreground">Rolando dados...</p>
              </div>
            ) : lastRoll && (
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  {lastRoll.results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                      className={`
                        w-16 h-16 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg
                        ${getDiceColor(lastRoll.sides)}
                        ${getCriticalType(result, lastRoll.sides) === 'critical-success' ? 'ring-4 ring-green-400 ring-opacity-75' : ''}
                        ${getCriticalType(result, lastRoll.sides) === 'critical-fail' ? 'ring-4 ring-red-400 ring-opacity-75' : ''}
                      `}
                    >
                      {result}
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {lastRoll.total}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {lastRoll.count}d{lastRoll.sides}
                    {lastRoll.modifier !== 0 && (
                      <span> {lastRoll.modifier > 0 ? '+' : ''}{lastRoll.modifier}</span>
                    )}
                  </div>
                  {/* Badges para críticos */}
                  <div className="flex justify-center space-x-2">
                    {lastRoll.results.map((result, index) => {
                      const critType = getCriticalType(result, lastRoll.sides)
                      if (critType === 'critical-success') {
                        return <Badge key={index} className="bg-green-500">Crítico!</Badge>
                      } else if (critType === 'critical-fail') {
                        return <Badge key={index} variant="destructive">Falha Crítica!</Badge>
                      }
                      return null
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Histórico de Rolagens */}
      <Card className="medieval-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5 text-primary" />
              <span>Histórico de Rolagens</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </CardHeader>
        {showHistory && (
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {diceHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma rolagem ainda
                </p>
              ) : (
                diceHistory.slice(0, 10).map((roll) => (
                  <motion.div
                    key={roll.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded ${getDiceColor(roll.sides)} flex items-center justify-center text-white text-sm font-bold`}>
                        d{roll.sides}
                      </div>
                      <div>
                        <div className="font-medium">{roll.total}</div>
                        <div className="text-xs text-muted-foreground">
                          {roll.results.join(', ')}
                          {roll.modifier !== 0 && ` (${roll.modifier > 0 ? '+' : ''}${roll.modifier})`}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(roll.timestamp).toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
