import React, { useRef } from 'react'
import ScrollIndicator from './ScrollIndicator'

const SpeedTestCard = ({ children, className = '' }) => {
  const scrollContainerRef = useRef(null)

  return (
    <div className="relative">
      {/* Glowing cosmic orb effect */}
      <div className="absolute -inset-20 bg-gradient-to-r from-indigo-600/30 via-violet-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -inset-10 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Main card container with fixed height and scroll */}
      <div className={`relative backdrop-blur-xl bg-gradient-to-br from-slate-900/80 via-indigo-900/60 to-purple-900/80 rounded-3xl shadow-2xl border border-cyan-400/30 w-[480px] shadow-cyan-500/20 overflow-hidden ${className}`}>
        {/* Scrollable content area */}
        <div 
          ref={scrollContainerRef}
          className="max-h-[85vh] overflow-y-auto p-8 scroll-smooth custom-scrollbar"
        >
          {children}
        </div>
        
        {/* Scroll indicator */}
        <ScrollIndicator containerRef={scrollContainerRef} />
      </div>
    </div>
  )
}

export default SpeedTestCard
