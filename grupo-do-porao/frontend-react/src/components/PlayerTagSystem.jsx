import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Edit, Save, Copy, Check, AlertCircle } from 'lucide-react'
const PlayerTagSystem = () => {
  const [playerTag, setPlayerTag] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [tempTag, setTempTag] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    // Carregar tag salva do localStorage
    const savedTag = localStorage.getItem('player-tag')
    if (savedTag) {
      setPlayerTag(savedTag)
    } else {
      // Gerar tag inicial sugerida
      generateSuggestedTag()
    }
  }, [])
  const generateSuggestedTag = () => {
    const adjectives = ['brave', 'wise', 'swift', 'mighty', 'clever', 'bold', 'noble', 'fierce']
    const nouns = ['warrior', 'mage', 'rogue', 'paladin', 'ranger', 'bard', 'cleric', 'monk']
    const numbers = Math.floor(Math.random() * 999) + 1
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    const suggestedTag = `${randomAdjective}${randomNoun}${numbers}`
    setTempTag(suggestedTag)
  }
  const validateTag = (tag) => {
    if (!tag) {
      return 'Tag não pode estar vazia'
    }
    if (tag.length < 3) {
      return 'Tag deve ter pelo menos 3 caracteres'
    }
    if (tag.length > 20) {
      return 'Tag deve ter no máximo 20 caracteres'
    }
    if (!/^[a-zA-Z0-9_]+$/.test(tag)) {
      return 'Tag pode conter apenas letras, números e underscore'
    }
    if (tag.startsWith('_') || tag.endsWith('_')) {
      return 'Tag não pode começar ou terminar com underscore'
    }
    return null
  }
  const startEditing = () => {
    setTempTag(playerTag)
    setIsEditing(true)
    setError('')
  }
  const cancelEditing = () => {
    setIsEditing(false)
    setTempTag('')
    setError('')
  }
  const saveTag = () => {
    const validationError = validateTag(tempTag)
    if (validationError) {
      setError(validationError)
      return
    }
    setPlayerTag(tempTag)
    localStorage.setItem('player-tag', tempTag)
    setIsEditing(false)
    setError('')
    // Notificar sucesso
    alert('Tag salva com sucesso!')
  }
  const copyTag = async () => {
    if (!playerTag) return
    try {
      await navigator.clipboard.writeText(playerTag)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback para navegadores que não suportam clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = playerTag
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <div className="bg-black/30 border border-orange-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-semibold text-orange-100">Sua Tag de Jogador</h3>
      </div>
      <div className="space-y-4">
        <div className="bg-black/20 border border-orange-500/20 rounded-lg p-4">
          <p className="text-sm text-gray-300 mb-3">
            Sua tag é um identificador único que o mestre usa para te convidar para a mesa. 
            Compartilhe esta tag com seu mestre para que ele possa adicionar você ao jogo.
          </p>
          {!isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-orange-200 mb-1">
                    Sua Tag Atual:
                  </label>
                  {playerTag ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono text-white bg-black/30 px-3 py-2 rounded border border-orange-500/30">
                        @{playerTag}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyTag}
                        className="flex items-center gap-1 px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar
                          </>
                        )}
                      </motion.button>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Nenhuma tag definida</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startEditing}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {playerTag ? 'Editar Tag' : 'Criar Tag'}
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-orange-200 mb-2">
                  Nova Tag:
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-white">@</span>
                  <input
                    type="text"
                    value={tempTag}
                    onChange={(e) => {
                      setTempTag(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                      setError('')
                    }}
                    placeholder="digite_sua_tag_aqui"
                    className="flex-1 px-3 py-2 bg-black/30 border border-orange-500/30 rounded-lg text-white focus:border-orange-400 focus:outline-none"
                    maxLength={20}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-400">
                  <p>• 3-20 caracteres</p>
                  <p>• Apenas letras, números e underscore (_)</p>
                  <p>• Não pode começar ou terminar com underscore</p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveTag}
                  disabled={!!error || !tempTag}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelEditing}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateSuggestedTag}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
                >
                  Sugerir
                </motion.button>
              </div>
            </div>
          )}
        </div>
        {playerTag && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <h4 className="text-sm font-medium text-green-200 mb-2">Como usar sua tag:</h4>
            <ol className="text-sm text-gray-300 space-y-1">
              <li>1. Copie sua tag usando o botão "Copiar"</li>
              <li>2. Envie para seu mestre via chat ou mensagem</li>
              <li>3. O mestre usará sua tag para te convidar para a mesa</li>
              <li>4. Após o convite, o mestre poderá controlar sua ficha</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
export default PlayerTagSystem
