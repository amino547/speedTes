import React from 'react'

const Planet = ({ size, color, position, animationDelay }) => {
  return (
    <div 
      className={`absolute ${position} animate-float`}
      style={{ animationDelay }}
    >
      {/* Outer glow */}
      <div 
        className={`absolute rounded-full bg-gradient-to-br ${color} blur-2xl opacity-20`}
        style={{ 
          width: `${size * 1.5}px`, 
          height: `${size * 1.5}px`,
          left: `${-size * 0.25}px`,
          top: `${-size * 0.25}px`
        }}
      />
      {/* Planet body */}
      <div 
        className={`relative rounded-full bg-gradient-to-br ${color} opacity-30 shadow-2xl`}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          boxShadow: `0 0 ${size * 0.5}px rgba(100, 200, 255, 0.3)`
        }}
      >
        {/* Highlight */}
        <div 
          className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full bg-white/20 blur-sm"
        />
      </div>
    </div>
  )
}

export default Planet
