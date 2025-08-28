import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Plus, Search, Settings, Eye, Edit3, Trash2, 
  UserPlus, Shield, Heart, Zap, Star, Award, Lock, Unlock,
  Save, X, Check, AlertCircle
} from 'lucide-react'
const PlayerControlSystem = () => {
  const [invitedPlayers, setInvitedPlayers] = useState([])
  const [inviteTag, setInviteTag] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [editingLimits, setEditingLimits] = useState(null)
  // Carregar jogadores convidados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('invited-players')
    if (saved) {
      setInvitedPlayers(JSON.parse(saved))
    }
  }, [])
  // Salvar jogadores no localStorage
  const savePlayersToStorage = (players) => {
    localStorage.setItem('invited-players', JSON.stringify(players))
    setInvitedPlayers(players)
  }
  // Simular busca de jogador por tag
  const searchPlayerByTag = (tag) => {
    // Simulação de jogadores disponíveis
    const availablePlayers = [
      { tag: 'warrior123', name: 'João Silva', level: 5, class: 'Guerreiro' },
      { tag: 'mage456', name: 'Maria Santos', level: 3, class: 'Mago' },
      { tag: 'rogue789', name: 'Pedro Costa', level: 7, class: 'Ladino' },
      { tag: 'cleric101', name: 'Ana Oliveira', level: 4, class: 'Clérigo' }
    ]
    return availablePlayers.find(p => p.tag.toLowerCase() === tag.toLowerCase())
  }
  // Convidar jogador
  const invitePlayer = () => {
    if (!inviteTag.trim()) return
    const foundPlayer = searchPlayerByTag(inviteTag)
    if (!foundPlayer) {
      alert('Jogador não encontrado com essa tag!')
      return
    }
    // Verificar se já foi convidado
    if (invitedPlayers.some(p => p.tag === foundPlayer.tag)) {
      alert('Este jogador já foi convidado!')
      return
    }
    const newPlayer = {
      id: Date.now(),
      ...foundPlayer,
      invitedAt: new Date().toISOString(),
      status: 'pending', // pending, accepted, declined
      character: {
        name: `${foundPlayer.name} - ${foundPlayer.class}`,
        level: foundPlayer.level,
        hp: { current: 50, max: 50 },
        xp: { current: 1000, next: 2000 },
        attributes: {
          strength: 14,
          dexterity: 12,
          constitution: 16,
          intelligence: 10,
          wisdom: 13,
          charisma: 11
        },
        skills: {
          athletics: 5,
          stealth: 3,
          investigation: 2,
          perception: 4,
          persuasion: 1
        },
        equipment: [
          'Espada Longa',
          'Armadura de Couro',
          'Escudo',
          'Poção de Cura'
        ]
      },
      limits: {
        maxHpIncrease: 10,
        maxXpGain: 500,
        canEditAttributes: false,
        canEditSkills: false,
        canEditEquipment: false
      }
    }
    const updatedPlayers = [...invitedPlayers, newPlayer]
    savePlayersToStorage(updatedPlayers)
    setInviteTag('')
    setShowInviteForm(false)
  }
  // Remover jogador
  const removePlayer = (playerId) => {
    if (confirm('Tem certeza que deseja remover este jogador?')) {
      const updatedPlayers = invitedPlayers.filter(p => p.id !== playerId)
      savePlayersToStorage(updatedPlayers)
      if (selectedPlayer?.id === playerId) {
        setSelectedPlayer(null)
      }
    }
  }
  // Atualizar atributos do jogador
  const updatePlayerAttribute = (playerId, attribute, value) => {
    const updatedPlayers = invitedPlayers.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          character: {
            ...player.character,
            attributes: {
              ...player.character.attributes,
              [attribute]: parseInt(value)
            }
          }
        }
      }
      return player
    })
    savePlayersToStorage(updatedPlayers)
    // Atualizar jogador selecionado se for o mesmo
    if (selectedPlayer?.id === playerId) {
      setSelectedPlayer(updatedPlayers.find(p => p.id === playerId))
    }
  }
  // Atualizar HP/XP do jogador
  const updatePlayerStat = (playerId, statType, field, value) => {
    const updatedPlayers = invitedPlayers.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          character: {
            ...player.character,
            [statType]: {
              ...player.character[statType],
              [field]: parseInt(value)
            }
          }
        }
      }
      return player
    })
    savePlayersToStorage(updatedPlayers)
    if (selectedPlayer?.id === playerId) {
      setSelectedPlayer(updatedPlayers.find(p => p.id === playerId))
    }
  }
  // Atualizar limitadores
  const updatePlayerLimits = (playerId, newLimits) => {
    const updatedPlayers = invitedPlayers.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          limits: newLimits
        }
      }
      return player
    })
    savePlayersToStorage(updatedPlayers)
    setEditingLimits(null)
  }
  // Adicionar equipamento
  const addEquipment = (playerId, equipment) => {
    if (!equipment.trim()) return
    const updatedPlayers = invitedPlayers.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          character: {
            ...player.character,
            equipment: [...player.character.equipment, equipment]
          }
        }
      }
      return player
    })
    savePlayersToStorage(updatedPlayers)
    if (selectedPlayer?.id === playerId) {
      setSelectedPlayer(updatedPlayers.find(p => p.id === playerId))
    }
  }
  // Remover equipamento
  const removeEquipment = (playerId, equipmentIndex) => {
    const updatedPlayers = invitedPlayers.map(player => {
      if (player.id === playerId) {
        const newEquipment = [...player.character.equipment]
        newEquipment.splice(equipmentIndex, 1)
        return {
          ...player,
          character: {
            ...player.character,
            equipment: newEquipment
          }
        }
      }
      return player
    })
    savePlayersToStorage(updatedPlayers)
    if (selectedPlayer?.id === playerId) {
      setSelectedPlayer(updatedPlayers.find(p => p.id === playerId))
    }
  }
  if (selectedPlayer) {
    return <PlayerDetailView 
      player={selectedPlayer}
      onBack={() => setSelectedPlayer(null)}
      onUpdateAttribute={updatePlayerAttribute}
      onUpdateStat={updatePlayerStat}
      onAddEquipment={addEquipment}
      onRemoveEquipment={removeEquipment}
      onUpdateLimits={updatePlayerLimits}
      editingLimits={editingLimits}
      setEditingLimits={setEditingLimits}
    />
  }
  return (
    <div className="h-full bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg border border-amber-500/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-100">Controle de Jogadores</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInviteForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Convidar Jogador
        </motion.button>
      </div>
      {/* Lista de jogadores */}
      <div className="space-y-4">
        {invitedPlayers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-amber-400/50 mb-4" />
            <h3 className="text-lg font-medium text-amber-200 mb-2">Nenhum jogador convidado</h3>
            <p className="text-amber-200/70 mb-4">Convide jogadores para começar a controlar suas fichas</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInviteForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors mx-auto"
            >
              <UserPlus className="w-4 h-4" />
              Convidar Primeiro Jogador
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invitedPlayers.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/30 border border-amber-500/30 rounded-lg p-4 hover:border-amber-400/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-amber-100">{player.name}</h3>
                    <p className="text-sm text-gray-300">@{player.tag}</p>
                    <p className="text-sm text-amber-300">{player.class} - Nível {player.character.level}</p>
                  </div>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedPlayer(player)}
                      className="p-1 text-amber-400 hover:text-amber-300 transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removePlayer(player.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Remover jogador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                {/* Status do jogador */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">HP:</span>
                    <span className="text-red-400">
                      {player.character.hp.current}/{player.character.hp.max}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">XP:</span>
                    <span className="text-blue-400">
                      {player.character.xp.current}/{player.character.xp.next}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      player.status === 'accepted' ? 'bg-green-600 text-white' :
                      player.status === 'pending' ? 'bg-yellow-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {player.status === 'accepted' ? 'Aceito' :
                       player.status === 'pending' ? 'Pendente' : 'Recusado'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {/* Modal de convite */}
      <AnimatePresence>
        {showInviteForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-amber-500/30 rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-amber-100 mb-4">Convidar Jogador</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">
                    Tag do Jogador
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteTag}
                      onChange={(e) => setInviteTag(e.target.value)}
                      placeholder="Ex: warrior123"
                      className="flex-1 px-3 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={invitePlayer}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <p>Tags de exemplo para teste:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• warrior123 (João Silva - Guerreiro)</li>
                    <li>• mage456 (Maria Santos - Mago)</li>
                    <li>• rogue789 (Pedro Costa - Ladino)</li>
                    <li>• cleric101 (Ana Oliveira - Clérigo)</li>
                  </ul>
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
// Componente de visualização detalhada do jogador
const PlayerDetailView = ({ 
  player, 
  onBack, 
  onUpdateAttribute, 
  onUpdateStat, 
  onAddEquipment, 
  onRemoveEquipment,
  onUpdateLimits,
  editingLimits,
  setEditingLimits
}) => {
  const [newEquipment, setNewEquipment] = useState('')
  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      onAddEquipment(player.id, newEquipment)
      setNewEquipment('')
    }
  }
  return (
    <div className="h-full bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg border border-amber-500/30 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
          </motion.button>
          <div>
            <h2 className="text-xl font-bold text-amber-100">{player.name}</h2>
            <p className="text-amber-200">@{player.tag} - {player.class}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditingLimits(player.limits)}
          className="flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          Limitadores
        </motion.button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estatísticas principais */}
        <div className="space-y-6">
          {/* HP e XP */}
          <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-amber-200 mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Pontos de Vida</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={player.character.hp.current}
                    onChange={(e) => onUpdateStat(player.id, 'hp', 'current', e.target.value)}
                    className="px-3 py-2 bg-black/30 border border-red-500/30 rounded text-white focus:border-red-400 focus:outline-none"
                    placeholder="Atual"
                  />
                  <input
                    type="number"
                    value={player.character.hp.max}
                    onChange={(e) => onUpdateStat(player.id, 'hp', 'max', e.target.value)}
                    className="px-3 py-2 bg-black/30 border border-red-500/30 rounded text-white focus:border-red-400 focus:outline-none"
                    placeholder="Máximo"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Experiência</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={player.character.xp.current}
                    onChange={(e) => onUpdateStat(player.id, 'xp', 'current', e.target.value)}
                    className="px-3 py-2 bg-black/30 border border-blue-500/30 rounded text-white focus:border-blue-400 focus:outline-none"
                    placeholder="Atual"
                  />
                  <input
                    type="number"
                    value={player.character.xp.next}
                    onChange={(e) => onUpdateStat(player.id, 'xp', 'next', e.target.value)}
                    className="px-3 py-2 bg-black/30 border border-blue-500/30 rounded text-white focus:border-blue-400 focus:outline-none"
                    placeholder="Próximo"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Atributos */}
          <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-amber-200 mb-4">Atributos</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(player.character.attributes).map(([attr, value]) => (
                <div key={attr}>
                  <label className="block text-sm text-gray-300 mb-1 capitalize">{attr}</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={value}
                    onChange={(e) => onUpdateAttribute(player.id, attr, e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-amber-500/30 rounded text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Equipamentos e perícias */}
        <div className="space-y-6">
          {/* Equipamentos */}
          <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-amber-200 mb-4">Equipamentos</h3>
            <div className="space-y-3 mb-4">
              {player.character.equipment.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-black/30 rounded">
                  <span className="text-gray-300">{item}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemoveEquipment(player.id, index)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                placeholder="Novo equipamento..."
                className="flex-1 px-3 py-2 bg-black/30 border border-amber-500/30 rounded text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleAddEquipment()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddEquipment}
                className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          {/* Perícias */}
          <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-amber-200 mb-4">Perícias</h3>
            <div className="space-y-3">
              {Object.entries(player.character.skills).map(([skill, value]) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{skill}</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={value}
                    onChange={(e) => {
                      // Atualizar perícias (implementar função similar)
                    }}
                    className="w-16 px-2 py-1 bg-black/30 border border-amber-500/30 rounded text-white text-center focus:border-amber-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Modal de limitadores */}
      <AnimatePresence>
        {editingLimits && (
          <LimitsEditModal
            limits={editingLimits}
            onSave={(newLimits) => onUpdateLimits(player.id, newLimits)}
            onCancel={() => setEditingLimits(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
// Modal para editar limitadores
const LimitsEditModal = ({ limits, onSave, onCancel }) => {
  const [editData, setEditData] = useState(limits)
  const handleSave = () => {
    onSave(editData)
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-amber-500/30 rounded-lg p-6 max-w-md w-full"
      >
        <h3 className="text-xl font-bold text-amber-100 mb-4">Configurar Limitadores</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">
              Aumento máximo de HP por sessão
            </label>
            <input
              type="number"
              min="0"
              value={editData.maxHpIncrease}
              onChange={(e) => setEditData({...editData, maxHpIncrease: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">
              Ganho máximo de XP por sessão
            </label>
            <input
              type="number"
              min="0"
              value={editData.maxXpGain}
              onChange={(e) => setEditData({...editData, maxXpGain: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-amber-200">Permissões do Jogador</h4>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editData.canEditAttributes}
                onChange={(e) => setEditData({...editData, canEditAttributes: e.target.checked})}
                className="rounded"
              />
              <span className="text-gray-300">Pode editar atributos</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editData.canEditSkills}
                onChange={(e) => setEditData({...editData, canEditSkills: e.target.checked})}
                className="rounded"
              />
              <span className="text-gray-300">Pode editar perícias</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editData.canEditEquipment}
                onChange={(e) => setEditData({...editData, canEditEquipment: e.target.checked})}
                className="rounded"
              />
              <span className="text-gray-300">Pode editar equipamentos</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default PlayerControlSystem
