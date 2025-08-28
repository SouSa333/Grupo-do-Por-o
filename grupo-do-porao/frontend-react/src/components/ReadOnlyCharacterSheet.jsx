import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Heart, Shield, Zap, Brain, Eye, Smile, Dumbbell, 
  Lock, AlertCircle, Info, Star, Award, Sword, Package
} from 'lucide-react'
const attributes = [
  { key: 'strength', label: 'Força', icon: Dumbbell, color: 'text-red-500' },
  { key: 'dexterity', label: 'Destreza', icon: Zap, color: 'text-green-500' },
  { key: 'constitution', label: 'Constituição', icon: Heart, color: 'text-orange-500' },
  { key: 'intelligence', label: 'Inteligência', icon: Brain, color: 'text-blue-500' },
  { key: 'wisdom', label: 'Sabedoria', icon: Eye, color: 'text-purple-500' },
  { key: 'charisma', label: 'Carisma', icon: Smile, color: 'text-pink-500' }
]
const skillsByAttribute = {
  strength: ['Atletismo'],
  dexterity: ['Acrobacia', 'Furtividade', 'Prestidigitação'],
  constitution: [],
  intelligence: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'],
  wisdom: ['Intuição', 'Medicina', 'Percepção', 'Sobrevivência', 'Trato com Animais'],
  charisma: ['Atuação', 'Enganação', 'Intimidação', 'Persuasão']
}
export default function ReadOnlyCharacterSheet() {
  const [character, setCharacter] = useState(null)
  const [playerTag, setPlayerTag] = useState('')
  const [activeTab, setActiveTab] = useState('attributes')
  // Carregar dados do personagem do localStorage (simulação)
  useEffect(() => {
    // Simular dados do personagem controlado pelo mestre
    const mockCharacter = {
      id: 1,
      name: 'Aragorn Montanha',
      class: 'Guerreiro',
      race: 'Humano',
      level: 5,
      background: 'Soldado',
      alignment: 'Leal e Bom',
      // Atributos (controlados pelo mestre)
      attributes: {
        strength: 16,
        dexterity: 13,
        constitution: 14,
        intelligence: 10,
        wisdom: 12,
        charisma: 11
      },
      // Recursos (controlados pelo mestre)
      hitPoints: { current: 42, max: 47, temp: 0 },
      armorClass: 18,
      speed: 30,
      proficiencyBonus: 3,
      experience: { current: 6500, next: 14000 },
      // Perícias (controladas pelo mestre)
      skills: {
        'Atletismo': { proficient: true, expertise: false },
        'Intimidação': { proficient: true, expertise: false },
        'Percepção': { proficient: true, expertise: false },
        'Sobrevivência': { proficient: true, expertise: false }
      },
      // Equipamentos (controlados pelo mestre)
      equipment: [
        'Espada Longa +1',
        'Armadura de Placas',
        'Escudo',
        'Arco Longo',
        'Aljava com 20 Flechas',
        'Kit de Aventureiro',
        'Poção de Cura (x3)',
        'Corda de Seda (15m)',
        'Pederneira'
      ],
      // Notas (somente leitura)
      backstory: 'Um guerreiro veterano das Guerras do Norte, conhecido por sua coragem e lealdade. Busca redimir os erros do passado protegendo os inocentes.',
      notes: 'Tem uma cicatriz no rosto esquerdo. Fala com sotaque do norte. Sempre carrega um medalhão da família.',
      // Aparência
      appearance: {
        age: '32 anos',
        height: '1,85m',
        weight: '85kg',
        eyes: 'Azuis',
        hair: 'Castanho escuro',
        skin: 'Clara com cicatrizes'
      },
      // Tag do jogador
      playerTag: 'warrior123'
    }
    setCharacter(mockCharacter)
    setPlayerTag(mockCharacter.playerTag)
  }, [])
  // Calcular modificador de atributo
  const getModifier = (score) => {
    return Math.floor((score - 10) / 2)
  }
  // Calcular bônus de perícia
  const getSkillBonus = (skill, attribute) => {
    if (!character) return 0
    const modifier = getModifier(character.attributes[attribute])
    const skillData = character.skills[skill]
    const proficient = skillData?.proficient || false
    const expertise = skillData?.expertise || false
    let bonus = modifier
    if (proficient) bonus += character.proficiencyBonus
    if (expertise) bonus += character.proficiencyBonus
    return bonus
  }
  if (!character) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto text-amber-400/50 mb-4" />
          <p className="text-gray-400">Carregando ficha do personagem...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="h-full bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg border border-amber-500/30 overflow-hidden">
      {/* Header com aviso de somente leitura */}
      <div className="bg-amber-900/30 border-b border-amber-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-amber-100">{character.name}</h2>
              <p className="text-amber-200">
                {character.race} {character.class} - Nível {character.level}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-600/20 border border-orange-500/30 rounded-lg">
            <Lock className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-200">Somente Leitura</span>
          </div>
        </div>
        {/* Aviso sobre controle do mestre */}
        <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-200">
              <p className="font-medium mb-1">Sua tag de jogador: @{playerTag}</p>
              <p>Todos os atributos, perícias e equipamentos são controlados pelo mestre. Você pode apenas visualizar as informações do seu personagem.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex-1 p-6">
        <div className="flex space-x-1 mb-6 bg-black/20 p-1 rounded-lg">
          {[
            { id: 'attributes', label: 'Atributos', icon: Dumbbell },
            { id: 'skills', label: 'Perícias', icon: Star },
            { id: 'equipment', label: 'Equipamentos', icon: Package },
            { id: 'character', label: 'Personagem', icon: User }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-black/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        {/* Conteúdo das tabs */}
        <div className="h-full overflow-y-auto">
          {activeTab === 'attributes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Recursos principais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-red-300">Pontos de Vida</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {character.hitPoints.current}/{character.hitPoints.max}
                    </div>
                    {character.hitPoints.temp > 0 && (
                      <div className="text-sm text-blue-300">
                        +{character.hitPoints.temp} temp
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-black/30 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-blue-300">Classe de Armadura</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{character.armorClass}</div>
                  </div>
                </div>
                <div className="bg-black/30 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-purple-300">Experiência</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {character.experience.current.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-300">
                      / {character.experience.next.toLocaleString()} XP
                    </div>
                  </div>
                </div>
              </div>
              {/* Atributos */}
              <div>
                <h3 className="text-lg font-semibold text-amber-200 mb-4">Atributos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {attributes.map((attr) => {
                    const score = character.attributes[attr.key]
                    const modifier = getModifier(score)
                    return (
                      <div
                        key={attr.key}
                        className="bg-black/30 border border-amber-500/30 rounded-lg p-4 text-center"
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <attr.icon className={`w-5 h-5 ${attr.color}`} />
                          <h4 className="font-medium text-gray-200">{attr.label}</h4>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{score}</div>
                        <div className="text-sm text-gray-300">
                          {modifier >= 0 ? '+' : ''}{modifier}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'skills' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-amber-200">Perícias</h3>
              {attributes.map((attr) => {
                const skills = skillsByAttribute[attr.key]
                if (skills.length === 0) return null
                return (
                  <div key={attr.key} className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <attr.icon className={`w-5 h-5 ${attr.color}`} />
                      <h4 className="font-semibold text-gray-200">{attr.label}</h4>
                    </div>
                    <div className="space-y-2">
                      {skills.map((skill) => {
                        const bonus = getSkillBonus(skill, attr.key)
                        const skillData = character.skills[skill]
                        const proficient = skillData?.proficient || false
                        const expertise = skillData?.expertise || false
                        return (
                          <div key={skill} className="flex items-center justify-between p-2 bg-black/20 rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-300">{skill}</span>
                              {proficient && (
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                                  {expertise && <div className="w-2 h-2 bg-amber-400 rounded-full" />}
                                </div>
                              )}
                            </div>
                            <span className="font-mono text-white">
                              {bonus >= 0 ? '+' : ''}{bonus}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}
          {activeTab === 'equipment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-amber-200">Equipamentos</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span>Controlado pelo mestre</span>
                </div>
              </div>
              <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                <div className="space-y-3">
                  {character.equipment.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-black/20 rounded-lg"
                    >
                      <Package className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'character' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Informações básicas */}
              <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-200 mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Antecedente</label>
                    <div className="p-2 bg-black/20 rounded text-gray-200">{character.background}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Tendência</label>
                    <div className="p-2 bg-black/20 rounded text-gray-200">{character.alignment}</div>
                  </div>
                </div>
              </div>
              {/* Aparência */}
              <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-200 mb-4">Aparência</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(character.appearance).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm text-gray-300 mb-1 capitalize">
                        {key === 'age' ? 'Idade' :
                         key === 'height' ? 'Altura' :
                         key === 'weight' ? 'Peso' :
                         key === 'eyes' ? 'Olhos' :
                         key === 'hair' ? 'Cabelo' :
                         key === 'skin' ? 'Pele' : key}
                      </label>
                      <div className="p-2 bg-black/20 rounded text-gray-200">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* História */}
              <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-200 mb-4">História do Personagem</h3>
                <div className="p-3 bg-black/20 rounded text-gray-300 whitespace-pre-wrap">
                  {character.backstory}
                </div>
              </div>
              {/* Notas */}
              <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-200 mb-4">Notas</h3>
                <div className="p-3 bg-black/20 rounded text-gray-300 whitespace-pre-wrap">
                  {character.notes}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
