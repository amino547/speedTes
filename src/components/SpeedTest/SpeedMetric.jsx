import React from 'react'

const SpeedMetric = ({ 
  label, 
  value, 
  unit, 
  icon, 
  gradientFrom, 
  gradientVia, 
  borderColor, 
  shadowColor,
  textColor 
}) => {
  return (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientVia} to-transparent p-4 rounded-xl border ${borderColor} shadow-lg ${shadowColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${textColor}/70 text-sm mb-1 font-medium`}>{label}</p>
          <p className={`text-4xl font-bold ${textColor} drop-shadow-lg`}>{value}</p>
          <p className={`${textColor}/60 text-xs`}>{unit}</p>
        </div>
        <div className="text-5xl opacity-30">{icon}</div>
      </div>
    </div>
  )
}

export default SpeedMetric
