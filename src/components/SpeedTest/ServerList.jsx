import React from 'react'

const ServerList = ({ serverInfo }) => {
  if (!serverInfo || serverInfo.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-transparent p-4 rounded-xl border border-slate-600/40">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌐</span>
        <p className="text-white font-semibold text-sm">Test Servers Used</p>
      </div>
      <div className="space-y-2">
        {serverInfo.map((server, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-medium">
                {server.type}
              </span>
              <span className="text-white/80 text-sm font-medium">{server.server}</span>
            </div>
            <span className="text-white/50 text-xs font-mono">{server.url}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServerList
