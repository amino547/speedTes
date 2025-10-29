import React, { useState, useEffect, useRef } from 'react'

const ScrollIndicator = ({ containerRef }) => {
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isScrollable = scrollHeight > clientHeight
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
      
      setShowIndicator(isScrollable && !isAtBottom)
    }

    checkScroll()
    container.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      container.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [containerRef])

  if (!showIndicator) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="text-cyan-400/60 text-xs mb-1 animate-pulse">Scroll for more</div>
        <div className="text-cyan-400/70 text-2xl animate-bounce">⌄</div>
      </div>
    </div>
  )
}

export default ScrollIndicator
