import React from 'react'
import SpeedMetric from './SpeedMetric'
import CapabilityCard from './CapabilityCard'
import ServerList from './ServerList'
import TestAgainButton from './TestAgainButton'

const ResultsDisplay = ({ results, serverInfo, onTestAgain }) => {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Download Speed */}
      <SpeedMetric
        label="⬇️ Download Speed"
        value={results.download}
        unit="Mbps"
        icon="🌊"
        gradientFrom="from-cyan-500/20"
        gradientVia="via-blue-500/10"
        borderColor="border-cyan-400/40"
        shadowColor="shadow-cyan-500/10"
        textColor="text-cyan-300"
      />

      {/* Upload Speed */}
      <SpeedMetric
        label="⬆️ Upload Speed"
        value={results.upload}
        unit="Mbps"
        icon="🚀"
        gradientFrom="from-indigo-500/20"
        gradientVia="via-violet-500/10"
        borderColor="border-indigo-400/40"
        shadowColor="shadow-indigo-500/10"
        textColor="text-indigo-300"
      />

      {/* Ping */}
      <SpeedMetric
        label="📡 Ping / Latency"
        value={results.ping}
        unit="milliseconds"
        icon="⚡"
        gradientFrom="from-violet-500/20"
        gradientVia="via-purple-500/10"
        borderColor="border-violet-400/40"
        shadowColor="shadow-violet-500/10"
        textColor="text-violet-300"
      />

      {/* Download Capability Assessment */}
      <CapabilityCard capability={results.capability} />

      {/* Server Information */}
      <ServerList serverInfo={serverInfo} />

      {/* Test Again Button */}
      <TestAgainButton onTest={onTestAgain} />
    </div>
  )
}

export default ResultsDisplay
