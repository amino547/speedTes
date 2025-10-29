import React from 'react'

const TestAgainButton = ({ onTest }) => {
  return (
    <button
      onClick={onTest}
      className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-cyan-500/50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
    >
      🔄 Test Again
    </button>
  )
}

export default TestAgainButton
