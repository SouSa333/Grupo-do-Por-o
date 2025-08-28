import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Trash2, Save, X, FileText, Calendar, Clock } from 'lucide-react'
const NotesSystem = () => {
  const [notes, setNotes] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'geral' })
  // Carregar notas do localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('session-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])
  // Salvar notas no localStorage
  const saveNotes = (updatedNotes) => {
    localStorage.setItem('session-notes', JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }
  // Criar nova nota
  const createNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return
    const note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updatedNotes = [note, ...notes]
    saveNotes(updatedNotes)
    setNewNote({ title: '', content: '', category: 'geral' })
    setIsCreating(false)
  }
  // Editar nota
  const updateNote = (id, updatedData) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, ...updatedData, updatedAt: new Date().toISOString() }
        : note
    )
    saveNotes(updatedNotes)
    setEditingId(null)
  }
  // Excluir nota
  const deleteNote = (id) => {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      const updatedNotes = notes.filter(note => note.id !== id)
      saveNotes(updatedNotes)
    }
  }
  // Categorias disponíveis
  const categories = [
    { value: 'geral', label: 'Geral', color: 'bg-blue-500' },
    { value: 'combate', label: 'Combate', color: 'bg-red-500' },
    { value: 'historia', label: 'História', color: 'bg-purple-500' },
    { value: 'npcs', label: 'NPCs', color: 'bg-green-500' },
    { value: 'locais', label: 'Locais', color: 'bg-yellow-500' },
    { value: 'tesouros', label: 'Tesouros', color: 'bg-orange-500' }
  ]
  const getCategoryColor = (category) => {
    return categories.find(cat => cat.value === category)?.color || 'bg-gray-500'
  }
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg border border-amber-500/30">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-500/30">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-amber-100">Notas da Sessão</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Nota
        </motion.button>
      </div>
      {/* Formulário de criação */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-amber-500/30 bg-amber-900/20"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Digite o título da nota..."
                  className="w-full px-3 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-1">
                  Categoria
                </label>
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  className="w-full px-3 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-1">
                  Conteúdo
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Digite o conteúdo da nota..."
                  rows={4}
                  className="w-full px-3 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createNote}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsCreating(false)
                    setNewNote({ title: '', content: '', category: 'geral' })
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Lista de notas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {notes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-400"
            >
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma nota criada ainda</p>
              <p className="text-sm">Clique em "Nova Nota" para começar</p>
            </motion.div>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isEditing={editingId === note.id}
                onEdit={() => setEditingId(note.id)}
                onSave={(updatedData) => updateNote(note.id, updatedData)}
                onCancel={() => setEditingId(null)}
                onDelete={() => deleteNote(note.id)}
                getCategoryColor={getCategoryColor}
                formatDate={formatDate}
                categories={categories}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
// Componente para cada nota
const NoteCard = ({ note, isEditing, onEdit, onSave, onCancel, onDelete, getCategoryColor, formatDate, categories }) => {
  const [editData, setEditData] = useState({
    title: note.title,
    content: note.content,
    category: note.category
  })
  const handleSave = () => {
    if (!editData.title.trim() || !editData.content.trim()) return
    onSave(editData)
  }
  if (isEditing) {
    return (
      <motion.div
        layout
        className="p-4 bg-black/30 border border-amber-500/30 rounded-lg"
      >
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-white focus:border-amber-400 focus:outline-none"
          />
          <select
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            className="w-full px-3 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-white focus:border-amber-400 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <textarea
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 bg-black/30 border border-amber-500/30 rounded-lg text-white focus:border-amber-400 focus:outline-none resize-none"
          />
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 bg-black/30 border border-amber-500/30 rounded-lg hover:border-amber-400/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor(note.category)}`} />
          <h3 className="font-semibold text-amber-100">{note.title}</h3>
        </div>
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="p-1 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      <p className="text-gray-300 mb-3 whitespace-pre-wrap">{note.content}</p>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Criado: {formatDate(note.createdAt)}</span>
        </div>
        {note.updatedAt !== note.createdAt && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Editado: {formatDate(note.updatedAt)}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
export default NotesSystem
