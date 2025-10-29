import React, { useEffect, useState, useRef } from 'react'

// Shooting star component with trail
const ShootingStar = ({ delay }) => (
  <div
    className="absolute shooting-star"
    style={{
      top: `${Math.random() * 40}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`
    }}
  >
    <div className="w-2 h-2 bg-white rounded-full" style={{ boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)' }} />
  </div>
)

const StarField = () => {
  const [stars, setStars] = useState([])
  const containerRef = useRef(null)

  useEffect(() => {
    // Generate random stars with 3D depth and realistic properties
    const generateStars = () => {
      const starArray = []
      const starColors = [
        { color: '#ffffff', name: 'white' },
        { color: '#a5f3fc', name: 'cyan' },
        { color: '#93c5fd', name: 'blue' },
        { color: '#c4b5fd', name: 'indigo' },
        { color: '#ddd6fe', name: 'violet' },
        { color: '#fef9c3', name: 'yellow' }
      ]
      
      // Create more stars for a denser field (500 stars)
      for (let i = 0; i < 500; i++) {
        const sizeCategory = Math.random()
        const depth = Math.random() // 0 = far, 1 = near
        let size, opacity, blur
        
        if (sizeCategory < 0.6) {
          // Tiny distant stars (60%)
          size = Math.random() * 1 + 0.5
          opacity = Math.random() * 0.4 + 0.2
          blur = depth < 0.3 ? 0.5 : 0
        } else if (sizeCategory < 0.85) {
          // Small stars (25%)
          size = Math.random() * 1.5 + 1
          opacity = Math.random() * 0.4 + 0.4
          blur = depth < 0.4 ? 0.3 : 0
        } else if (sizeCategory < 0.96) {
          // Medium stars (11%)
          size = Math.random() * 2 + 1.5
          opacity = Math.random() * 0.3 + 0.6
          blur = 0
        } else {
          // Large bright stars (4%)
          size = Math.random() * 2.5 + 2.5
          opacity = Math.random() * 0.2 + 0.8
          blur = 0
        }
        
        const colorData = starColors[Math.floor(Math.random() * starColors.length)]
        
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size,
          opacity,
          depth,
          blur,
          delay: Math.random() * 5,
          duration: Math.random() * 3 + 2,
          color: colorData.color,
          colorName: colorData.name
        })
      }
      setStars(starArray)
    }
    
    generateStars()

    // Add parallax effect on mouse move
    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const xPercent = (clientX / innerWidth - 0.5) * 2
      const yPercent = (clientY / innerHeight - 0.5) * 2
      
      containerRef.current.style.transform = `translate(${xPercent * 10}px, ${yPercent * 10}px)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 transition-transform duration-300 ease-out">
        {stars.map(star => {
          const glowSize = star.size > 2 ? star.size * 3 : star.size * 2
          const glowIntensity = star.opacity * 0.6
          
          return (
            <div
              key={star.id}
              className="absolute rounded-full star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                opacity: star.opacity,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
                boxShadow: star.size > 1.5 
                  ? `0 0 ${glowSize}px ${glowSize / 2}px ${star.color}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')}`
                  : 'none',
                filter: star.blur > 0 ? `blur(${star.blur}px)` : 'none',
                transform: `scale(${0.8 + star.depth * 0.4})`,
                zIndex: Math.floor(star.depth * 10)
              }}
            />
          )
        })}
      </div>
      
      {/* Shooting stars */}
      <ShootingStar delay={0} />
      <ShootingStar delay={6} />
      <ShootingStar delay={12} />
      <ShootingStar delay={18} />
    </div>
  )
}

export default StarField
