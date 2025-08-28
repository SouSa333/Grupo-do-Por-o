import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Sword, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../contexts/AuthContext'
import logoImage from '../assets/logo_grupo_porao_modern.png'
export default function LoginPage() {
  const { userType } = useParams()
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  // Pré-preencher credenciais para demonstração
  useEffect(() => {
    if (userType === 'mestre') {
      setFormData({
        username: 'MESTRE',
        password: '12345677'
      })
    } else if (userType === 'jogador') {
      setFormData({
        username: 'JOGADOR',
        password: '123456'
      })
    }
  }, [userType])
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    const result = await login(formData, userType)
    if (result.success) {
      // Redirecionar para o painel apropriado
      navigate(userType === 'mestre' ? '/mestre' : '/jogador')
    } else {
      setLoginError(result.error)
    }
  }
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const userConfig = {
    mestre: {
      icon: Crown,
      title: 'Painel do Mestre',
      subtitle: 'Controle total da aventura',
      color: 'text-primary',
      bgGradient: 'from-primary/20 to-primary/5'
    },
    jogador: {
      icon: Sword,
      title: 'Painel do Jogador',
      subtitle: 'Viva sua aventura',
      color: 'text-primary',
      bgGradient: 'from-primary/20 to-primary/5'
    }
  }
  const config = userConfig[userType] || userConfig.jogador
  const IconComponent = config.icon
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Botão Voltar */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="medieval-card p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto relative"
            >
              <img 
                src={logoImage} 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-3">
                <IconComponent className={`w-6 h-6 ${config.color}`} />
                <h1 className="text-2xl font-bold">{config.title}</h1>
              </div>
              <p className="text-muted-foreground">{config.subtitle}</p>
            </div>
          </div>
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Usuário */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Usuário
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className="medieval-input"
                placeholder="Digite seu usuário"
                required
              />
            </div>
            {/* Campo Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="medieval-input pr-10"
                  placeholder="Digite sua senha"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            {/* Erro de Login */}
            {(loginError || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <p className="text-sm text-destructive text-center">
                  {loginError || error}
                </p>
              </motion.div>
            )}
            {/* Botão de Login */}
            <Button
              type="submit"
              className="w-full medieval-button h-12 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-5 h-5" />
                  <span>Entrar</span>
                </div>
              )}
            </Button>
          </form>
          {/* Credenciais de Demonstração */}
          <div className="text-center space-y-3">
            <div className="h-px bg-border"></div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Credenciais de Demonstração:</p>
              <div className="space-y-1">
                <p><strong>Mestre:</strong> MESTRE / 12345677</p>
                <p><strong>Jogador:</strong> JOGADOR / 123456</p>
              </div>
            </div>
          </div>
          {/* Link para outro tipo de usuário */}
          <div className="text-center">
            <Link 
              to={`/login/${userType === 'mestre' ? 'jogador' : 'mestre'}`}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {userType === 'mestre' ? 'Entrar como Jogador' : 'Entrar como Mestre'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
