import React from 'react'

const TestProgress = ({ progress, currentTest }) => {
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden border border-cyan-500/30">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-500 rounded-full shadow-lg shadow-cyan-500/50"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current test status */}
      <div className="text-center space-y-4">
        {/* Animated spinner */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-ping" />
          <div className="absolute inset-0 border-4 border-t-cyan-400 border-r-blue-500 border-b-indigo-500 border-l-violet-500 rounded-full animate-spin shadow-lg shadow-cyan-500/50" />
          <div className="absolute inset-4 border-4 border-blue-400/40 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-8 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-full blur-md" />
        </div>
        
        {/* Status text */}
        <div className="space-y-2">
          <p className="text-white font-semibold capitalize">
            {currentTest === 'download' && '📥 Testing Download Speed...'}
            {currentTest === 'upload' && '📤 Testing Upload Speed...'}
            {currentTest === 'ping' && '📡 Measuring Latency...'}
          </p>
          <p className="text-white/60 text-sm">{progress}% Complete</p>
        </div>
      </div>
    </div>
  )
}

export default TestProgress
