import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
export default function ParticleBackground() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const particles = []
    const particleCount = 50
    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    // Classe Particle
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
        this.color = this.getRandomColor()
        this.life = Math.random() * 200 + 100
        this.maxLife = this.life
      }
      getRandomColor() {
        const colors = [
          'rgba(212, 175, 55, ',  // Dourado
          'rgba(184, 134, 11, ',  // Dourado escuro
          'rgba(160, 82, 45, ',   // Marrom
          'rgba(139, 69, 19, ',   // Marrom escuro
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.life--
        // Efeito de fade baseado na vida
        this.opacity = (this.life / this.maxLife) * 0.5
        // Reposicionar quando sair da tela ou morrer
        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height || 
            this.life <= 0) {
          this.reset()
        }
      }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.life = Math.random() * 200 + 100
        this.maxLife = this.life
        this.opacity = Math.random() * 0.5 + 0.2
      }
      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color + this.opacity + ')'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        // Efeito de brilho
        ctx.shadowColor = this.color + '0.8)'
        ctx.shadowBlur = this.size * 2
        ctx.fill()
        ctx.restore()
      }
    }
    // Criar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
    // Loop de animação
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      // Conectar partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 100) {
            ctx.save()
            ctx.globalAlpha = (100 - distance) / 100 * 0.1
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
      requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  return (
    <>
      {/* Canvas para partículas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />
      {/* Partículas CSS adicionais para efeito */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </>
  )
}
