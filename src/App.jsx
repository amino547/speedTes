import React, { useState, useEffect } from 'react'
import SpeedTest from './components/SpeedTest'
import StarField from './components/StarField'
import Planet from './components/Planet'
import Sidebar from './components/Sidebar'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [speedTestData, setSpeedTestData] = useState({
    location: null,
    results: null,
    serverInfo: []
  })

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const updateSpeedTestData = (data) => {
    setSpeedTestData(prev => ({ ...prev, ...data }))
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950">
      {/* Animated background gradient - Deep space colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-blue-900/30 to-violet-900/40 animate-gradient"></div>
      {/* Deep space nebula effect with cyan and purple tones */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-purple-900/20"></div>
      {/* Additional depth layer */}
      <div className="absolute inset-0 bg-gradient-to-bl from-blue-950/30 via-transparent to-indigo-950/30"></div>
      
      {/* Star field background */}
      <StarField />
      
      {/* Decorative planets and celestial bodies */}
      <Planet 
        size={180} 
        color="from-indigo-500 to-violet-600" 
        position="top-10 right-10" 
        animationDelay="0s"
      />
      <Planet 
        size={120} 
        color="from-cyan-400 to-blue-600" 
        position="bottom-20 left-20" 
        animationDelay="2s"
      />
      <Planet 
        size={90} 
        color="from-purple-500 to-indigo-600" 
        position="top-1/3 left-10" 
        animationDelay="4s"
      />
      <Planet 
        size={60} 
        color="from-blue-400 to-cyan-500" 
        position="top-1/2 right-1/4" 
        animationDelay="1s"
      />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        location={speedTestData.location}
        results={speedTestData.results}
        serverInfo={speedTestData.serverInfo}
      />
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <SpeedTest onDataUpdate={updateSpeedTestData} />
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-cyan-300/40 text-sm font-light">
          ✨ Powered by cosmic technology • Exploring the digital universe
        </p>
      </div>
    </div>
  )
}

export default App
