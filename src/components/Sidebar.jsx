import React, { useState, useEffect } from 'react'

const Sidebar = ({ isOpen, toggleSidebar, location, results, serverInfo }) => {
  const [ipInfo, setIpInfo] = useState(null)
  const [customServer, setCustomServer] = useState('')
  const [serverPing, setServerPing] = useState(null)
  const [pingHistory, setPingHistory] = useState([])
  const [isPinging, setIsPinging] = useState(false)

  useEffect(() => {
    fetchDetailedIP()
  }, [])

  const fetchDetailedIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (response.ok) {
        const data = await response.json()
        setIpInfo({
          ip: data.ip,
          ipv6: data.version === 'IPv6' ? data.ip : 'Not available',
          isp: data.org || 'Unknown ISP',
          asn: data.asn || 'Unknown',
          timezone: data.timezone || 'Unknown',
          postal: data.postal || 'Unknown',
          latitude: data.latitude,
          longitude: data.longitude
        })
      }
    } catch (error) {
      console.error('Failed to fetch IP details:', error)
    }
  }

  const pingCustomServer = async () => {
    if (!customServer.trim()) return
    
    setIsPinging(true)
    const pings = []
    
    try {
      // Perform 5 ping tests
      for (let i = 0; i < 5; i++) {
        try {
          const startTime = performance.now()
          await fetch(`https://${customServer}/favicon.ico`, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store'
          })
          const endTime = performance.now()
          pings.push(endTime - startTime)
        } catch (err) {
          console.warn('Ping failed:', err)
        }
      }

      if (pings.length > 0) {
        const avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length)
        const newPingResult = {
          server: customServer,
          ping: avgPing,
          timestamp: new Date().toLocaleTimeString()
        }
        setServerPing(newPingResult)
        setPingHistory(prev => [newPingResult, ...prev].slice(0, 5))
      }
    } catch (error) {
      console.error('Ping test failed:', error)
    } finally {
      setIsPinging(false)
    }
  }

  const getConnectionQuality = (ping) => {
    if (ping < 30) return { label: 'Excellent', color: 'text-green-400', icon: '🟢' }
    if (ping < 60) return { label: 'Good', color: 'text-cyan-400', icon: '🔵' }
    if (ping < 100) return { label: 'Fair', color: 'text-yellow-400', icon: '🟡' }
    return { label: 'Poor', color: 'text-red-400', icon: '🔴' }
  }

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 right-6 z-50 p-3 bg-gradient-to-br from-cyan-500/80 to-blue-600/80 backdrop-blur-xl rounded-full shadow-lg hover:shadow-cyan-500/50 hover:scale-110 transition-all duration-300 border border-cyan-400/30"
        aria-label="Toggle sidebar"
      >
        <svg
          className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-slate-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-xl border-l border-cyan-400/30 shadow-2xl shadow-cyan-500/20 z-40 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center border-b border-cyan-400/30 pb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              📊 Network Dashboard
            </h2>
            <p className="text-cyan-200/60 text-xs mt-1">Complete Network Information</p>
          </div>

          {/* IP Information Section */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-4 border border-cyan-400/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌐</span>
              <h3 className="text-white font-semibold">Your IP Information</h3>
            </div>
            {ipInfo ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-cyan-300/70">IPv4 Address:</span>
                  <span className="text-white font-mono">{ipInfo.ip}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-cyan-300/70">IPv6 Address:</span>
                  <span className="text-white font-mono text-xs">{ipInfo.ipv6}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-cyan-300/70">ISP:</span>
                  <span className="text-white text-xs">{ipInfo.isp}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-cyan-300/70">ASN:</span>
                  <span className="text-white font-mono">{ipInfo.asn}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-cyan-300/70">Timezone:</span>
                  <span className="text-white">{ipInfo.timezone}</span>
                </div>
                {ipInfo.latitude && ipInfo.longitude && (
                  <div className="flex justify-between items-center bg-white/5 rounded p-2">
                    <span className="text-cyan-300/70">Coordinates:</span>
                    <span className="text-white text-xs font-mono">
                      {ipInfo.latitude.toFixed(4)}, {ipInfo.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-cyan-300/50 py-4 animate-pulse">
                Loading IP information...
              </div>
            )}
          </div>

          {/* Location Information */}
          {location && location.country !== 'Unknown' && (
            <div className="bg-gradient-to-br from-indigo-800/60 to-indigo-900/60 rounded-xl p-4 border border-indigo-400/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📍</span>
                <h3 className="text-white font-semibold">Location Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-indigo-300/70">Country:</span>
                  <span className="text-white">{location.country}</span>
                </div>
                {location.city && (
                  <div className="flex justify-between items-center bg-white/5 rounded p-2">
                    <span className="text-indigo-300/70">City:</span>
                    <span className="text-white">{location.city}</span>
                  </div>
                )}
                {location.region && (
                  <div className="flex justify-between items-center bg-white/5 rounded p-2">
                    <span className="text-indigo-300/70">Region:</span>
                    <span className="text-white">{location.region}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Speed Test Results Summary */}
          {results && (
            <div className="bg-gradient-to-br from-violet-800/60 to-violet-900/60 rounded-xl p-4 border border-violet-400/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚡</span>
                <h3 className="text-white font-semibold">Current Speed</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-violet-300/70">Download:</span>
                  <span className="text-cyan-300 font-bold">{results.download} Mbps</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-violet-300/70">Upload:</span>
                  <span className="text-indigo-300 font-bold">{results.upload} Mbps</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-violet-300/70">Ping:</span>
                  <span className="text-violet-300 font-bold">{results.ping} ms</span>
                </div>
              </div>
            </div>
          )}

          {/* Custom Server Ping */}
          <div className="bg-gradient-to-br from-blue-800/60 to-blue-900/60 rounded-xl p-4 border border-blue-400/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎯</span>
              <h3 className="text-white font-semibold">Ping Custom Server</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customServer}
                  onChange={(e) => setCustomServer(e.target.value)}
                  placeholder="example.com"
                  className="flex-1 bg-white/10 border border-blue-400/30 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-400/60 focus:ring-1 focus:ring-blue-400/30"
                  onKeyPress={(e) => e.key === 'Enter' && pingCustomServer()}
                />
                <button
                  onClick={pingCustomServer}
                  disabled={isPinging || !customServer.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isPinging ? '...' : 'Ping'}
                </button>
              </div>

              {/* Current Ping Result */}
              {serverPing && (
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{serverPing.server}</span>
                    <span className="text-xs text-white/60">{serverPing.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-lg ${getConnectionQuality(serverPing.ping).color}`}>
                      {serverPing.ping} ms
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{getConnectionQuality(serverPing.ping).icon}</span>
                      <span className={`text-xs ${getConnectionQuality(serverPing.ping).color}`}>
                        {getConnectionQuality(serverPing.ping).label}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Ping History */}
              {pingHistory.length > 0 && (
                <div>
                  <p className="text-white/60 text-xs mb-2">Recent Pings:</p>
                  <div className="space-y-1">
                    {pingHistory.map((ping, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded p-2 text-xs">
                        <span className="text-white/70 truncate flex-1">{ping.server}</span>
                        <span className={`font-semibold ${getConnectionQuality(ping.ping).color}`}>
                          {ping.ping}ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test Servers List */}
          {serverInfo && serverInfo.length > 0 && (
            <div className="bg-gradient-to-br from-purple-800/60 to-purple-900/60 rounded-xl p-4 border border-purple-400/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🖥️</span>
                <h3 className="text-white font-semibold">Test Servers</h3>
              </div>
              <div className="space-y-2">
                {serverInfo.map((server, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-medium">
                          {server.type}
                        </span>
                        <span className="text-white text-sm">{server.server}</span>
                      </div>
                    </div>
                    <div className="text-white/50 text-xs font-mono mt-1">{server.url}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Info */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-4 border border-slate-600/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💻</span>
              <h3 className="text-white font-semibold">System Info</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center bg-white/5 rounded p-2">
                <span className="text-slate-300/70">Browser:</span>
                <span className="text-white text-xs">{navigator.userAgent.split(' ').slice(-2).join(' ')}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 rounded p-2">
                <span className="text-slate-300/70">Platform:</span>
                <span className="text-white">{navigator.platform}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 rounded p-2">
                <span className="text-slate-300/70">Language:</span>
                <span className="text-white">{navigator.language}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 rounded p-2">
                <span className="text-slate-300/70">Screen:</span>
                <span className="text-white">{window.screen.width} × {window.screen.height}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}

export default Sidebar
