import React from 'react'

const StartButton = ({ onStart }) => {
  return (
    <div className="text-center">
      <button
        onClick={onStart}
        className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      >
        <span className="relative z-10">🚀 Launch Speed Test</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 blur transition-opacity" />
      </button>
    </div>
  )
}

export default StartButton
