import React from 'react'

const Header = ({ location, loadingLocation }) => {
  return (
    <div className="text-center mb-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
        ⭐ Space Speed Test
      </h1>
      <p className="text-cyan-200/70 text-sm">Measure your cosmic connection speed</p>
      
      {/* Location info */}
      {loadingLocation ? (
        <div className="mt-3 text-cyan-300/50 text-xs animate-pulse">
          🌍 Detecting location...
        </div>
      ) : location && location.country !== 'Unknown' ? (
        <div className="mt-3 flex items-center justify-center gap-2 text-cyan-300/70 text-sm">
          <span className="text-lg">
            {location.countryCode === 'US' ? '🇺🇸' : 
             location.countryCode === 'GB' ? '🇬🇧' : 
             location.countryCode === 'CA' ? '🇨🇦' : 
             location.countryCode === 'AU' ? '🇦🇺' : 
             location.countryCode === 'DE' ? '🇩🇪' : 
             location.countryCode === 'FR' ? '🇫🇷' : 
             location.countryCode === 'JP' ? '🇯🇵' : 
             location.countryCode === 'CN' ? '🇨🇳' : 
             location.countryCode === 'IN' ? '🇮🇳' : '🌍'}
          </span>
          <span>{location.city ? `${location.city}, ` : ''}{location.country}</span>
        </div>
      ) : null}
    </div>
  )
}

export default Header
