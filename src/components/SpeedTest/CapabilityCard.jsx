import React from 'react'

const CapabilityCard = ({ capability }) => {
  return (
    <div className={`bg-gradient-to-br ${capability.color}/20 via-transparent to-transparent p-5 rounded-xl border ${capability.color.replace('from-', 'border-').replace(' to-', '/40 shadow-lg shadow-').split(' ')[0]}/40 shadow-lg`}>
      <div className="flex items-start gap-3">
        <div className="text-4xl mt-1">{capability.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-white font-bold text-lg">{capability.rating}</p>
            <span className="text-white/60 text-xs">Connection Quality</span>
          </div>
          <p className="text-white/80 text-sm mb-2">{capability.description}</p>
          <div className="bg-white/10 rounded-lg p-3 mt-3">
            <p className="text-white/70 text-xs mb-1">🎮 Heavy Game Download Estimate:</p>
            <p className="text-white font-semibold text-sm">{capability.gameDownload}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CapabilityCard
