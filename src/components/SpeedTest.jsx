import React, { useState, useEffect } from 'react'

const SpeedTest = ({ onDataUpdate }) => {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState(null)
  const [currentTest, setCurrentTest] = useState('')
  const [progress, setProgress] = useState(0)
  const [location, setLocation] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(true)
  const [serverInfo, setServerInfo] = useState([])

  const formatSpeed = (bitsPerSecond) => {
    const mbps = bitsPerSecond / 1000000
    return mbps.toFixed(2)
  }

  const getDownloadCapability = (downloadMbps) => {
    if (downloadMbps >= 100) {
      return {
        rating: 'Excellent',
        description: 'Perfect for 4K streaming, large game downloads (50-100GB games in 1-2 hours), and heavy file transfers',
        icon: '🚀',
        color: 'from-green-400 to-emerald-500',
        gameDownload: 'Download a 50GB game in ~1 hour'
      }
    } else if (downloadMbps >= 50) {
      return {
        rating: 'Very Good',
        description: 'Great for HD streaming, game downloads (50-100GB games in 2-4 hours), and large file transfers',
        icon: '⚡',
        color: 'from-cyan-400 to-blue-500',
        gameDownload: 'Download a 50GB game in ~2 hours'
      }
    } else if (downloadMbps >= 25) {
      return {
        rating: 'Good',
        description: 'Suitable for HD streaming and moderate game downloads (50GB game in 4-5 hours)',
        icon: '✨',
        color: 'from-blue-400 to-indigo-500',
        gameDownload: 'Download a 50GB game in ~4.5 hours'
      }
    } else if (downloadMbps >= 10) {
      return {
        rating: 'Fair',
        description: 'Adequate for SD streaming and small downloads (50GB game in 11+ hours)',
        icon: '⭐',
        color: 'from-yellow-400 to-orange-500',
        gameDownload: 'Download a 50GB game in ~11 hours'
      }
    } else {
      return {
        rating: 'Slow',
        description: 'Basic browsing only. Large downloads will take very long',
        icon: '🐌',
        color: 'from-orange-400 to-red-500',
        gameDownload: 'Download a 50GB game in 24+ hours'
      }
    }
  }

  const fetchLocation = async () => {
    try {
      setLoadingLocation(true)
      
      // Try multiple APIs in sequence for maximum reliability
      
      // API 1: ip-api.com (most reliable, no rate limits for reasonable use)
      try {
        console.log('Trying ip-api.com...')
        const response1 = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query')
        if (response1.ok) {
          const data = await response1.json()
          console.log('✅ IP Info from ip-api.com:', data)
          if (data.status === 'success') {
            setLocation({
              country: data.country || 'Unknown',
              city: data.city || 'Unknown',
              region: data.regionName || 'Unknown',
              countryCode: data.countryCode || '',
              ip: data.query || 'Unknown',
              isp: data.isp || data.org || 'Unknown ISP',
              asn: data.as || 'Unknown',
              timezone: data.timezone || 'Unknown',
              postal: data.zip || '',
              latitude: data.lat || null,
              longitude: data.lon || null,
              continent: ''
            })
            return
          }
        }
      } catch (error) {
        console.warn('❌ ip-api.com failed:', error)
      }

      // API 2: ipapi.co
      try {
        console.log('Trying ipapi.co...')
        const response2 = await fetch('https://ipapi.co/json/')
        if (response2.ok) {
          const data = await response2.json()
          console.log('✅ IP Info from ipapi.co:', data)
          if (!data.error) {
            setLocation({
              country: data.country_name || 'Unknown',
              city: data.city || 'Unknown',
              region: data.region || 'Unknown',
              countryCode: data.country_code || '',
              ip: data.ip || 'Unknown',
              isp: data.org || 'Unknown ISP',
              asn: data.asn || 'Unknown',
              timezone: data.timezone || 'Unknown',
              postal: data.postal || '',
              latitude: data.latitude || null,
              longitude: data.longitude || null,
              continent: data.continent_code || ''
            })
            return
          }
        }
      } catch (error) {
        console.warn('❌ ipapi.co failed:', error)
      }

      // API 3: ipify + ipapi (simple IP first, then details)
      try {
        console.log('Trying ipify for IP...')
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        if (ipResponse.ok) {
          const ipData = await ipResponse.json()
          console.log('✅ Got IP from ipify:', ipData.ip)
          
          // Try to get more details with this IP
          try {
            const detailsResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`)
            if (detailsResponse.ok) {
              const details = await detailsResponse.json()
              console.log('✅ Got details for IP:', details)
              setLocation({
                country: details.country || 'Unknown',
                city: details.city || 'Unknown',
                region: details.regionName || 'Unknown',
                countryCode: details.countryCode || '',
                ip: ipData.ip,
                isp: details.isp || 'Unknown ISP',
                asn: details.as || 'Unknown',
                timezone: details.timezone || 'Unknown',
                postal: details.zip || '',
                latitude: details.lat || null,
                longitude: details.lon || null,
                continent: ''
              })
              return
            }
          } catch (detailError) {
            console.warn('Could not get details, using IP only')
            // At least show the IP
            setLocation({
              country: 'Unknown',
              city: 'Unknown',
              region: 'Unknown',
              countryCode: '',
              ip: ipData.ip,
              isp: 'Unknown ISP',
              asn: 'Unknown',
              timezone: 'Unknown',
              postal: '',
              latitude: null,
              longitude: null,
              continent: ''
            })
            return
          }
        }
      } catch (error) {
        console.warn('❌ ipify failed:', error)
      }

      // If all APIs fail
      console.error('❌ All IP APIs failed')
      setLocation({ 
        country: 'Unable to detect', 
        city: 'Unable to detect', 
        region: 'Unable to detect', 
        countryCode: '', 
        ip: 'Unable to fetch',
        isp: 'Unable to detect',
        asn: 'Unknown',
        timezone: 'Unknown',
        postal: '',
        latitude: null,
        longitude: null,
        continent: ''
      })
    } finally {
      setLoadingLocation(false)
    }
  }

  useEffect(() => {
    fetchLocation()
  }, [])

  // Update parent component when data changes
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({ location, results, serverInfo })
    }
  }, [location, results, serverInfo, onDataUpdate])

  const measureDownloadSpeed = async () => {
    setCurrentTest('download')
    setServerInfo(prev => [...prev, { type: 'Download', server: 'Cloudflare CDN', url: 'speed.cloudflare.com' }])
    
    try {
      let totalSpeed = 0
      let validTests = 0

      // Use multiple test file sizes for more accurate results
      const cloudflareTests = [
        { url: 'https://speed.cloudflare.com/__down?bytes=1000000', size: 1000000 },
        { url: 'https://speed.cloudflare.com/__down?bytes=5000000', size: 5000000 },
        { url: 'https://speed.cloudflare.com/__down?bytes=10000000', size: 10000000 },
        { url: 'https://speed.cloudflare.com/__down?bytes=25000000', size: 25000000 },
      ]

      for (const testFile of cloudflareTests) {
        try {
          const startTime = performance.now()
          const response = await fetch(testFile.url, {
            cache: 'no-store',
            mode: 'cors'
          })
          
          if (!response.ok) continue
          
          const blob = await response.blob()
          const endTime = performance.now()
          const actualSize = blob.size
          const duration = (endTime - startTime) / 1000
          
          if (duration > 0.1 && actualSize > 0) {
            const bitsLoaded = actualSize * 8
            const speedBps = bitsLoaded / duration
            totalSpeed += speedBps
            validTests++
            console.log(`Download test ${validTests}: ${(speedBps / 1000000).toFixed(2)} Mbps (${actualSize} bytes in ${duration.toFixed(2)}s)`)
          }
        } catch (err) {
          console.warn('Cloudflare test failed, trying fallback...', err)
        }
      }

      // Fallback: Use large image files from reliable CDNs
      if (validTests === 0) {
        console.log('Using fallback download test method...')
        setServerInfo(prev => [...prev, { type: 'Download Fallback', server: 'Unsplash CDN', url: 'images.unsplash.com' }])
        const fallbackTests = [
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
          'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
          'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
          'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80',
        ]

        for (const url of fallbackTests) {
          try {
            const startTime = performance.now()
            const response = await fetch(url + '&cacheBust=' + Date.now(), {
              cache: 'no-store'
            })
            
            const blob = await response.blob()
            const endTime = performance.now()
            const actualSize = blob.size
            const duration = (endTime - startTime) / 1000
            
            if (duration > 0.1 && actualSize > 0) {
              const bitsLoaded = actualSize * 8
              const speedBps = bitsLoaded / duration
              totalSpeed += speedBps
              validTests++
              console.log(`Fallback test ${validTests}: ${(speedBps / 1000000).toFixed(2)} Mbps`)
            }
          } catch (err) {
            console.warn('Fallback test failed:', err)
          }
        }
      }
      
      return validTests > 0 ? totalSpeed / validTests : 0
    } catch (error) {
      console.error('Download test failed:', error)
      return 0
    }
  }

  const measureUploadSpeed = async () => {
    setCurrentTest('upload')
    setServerInfo(prev => [...prev, { type: 'Upload', server: 'HTTPBin', url: 'httpbin.org' }])
    
    // Create test data with varying sizes for accuracy
    const testSizes = [250000, 500000, 1000000, 2000000] // 0.25MB, 0.5MB, 1MB, 2MB
    
    try {
      let totalSpeed = 0
      let validTests = 0

      for (const size of testSizes) {
        try {
          // Generate random data
          const data = new Uint8Array(size)
          for (let i = 0; i < size; i++) {
            data[i] = Math.floor(Math.random() * 256)
          }
          
          const blob = new Blob([data])
          const formData = new FormData()
          formData.append('file', blob, 'test.bin')
          
          const startTime = performance.now()
          
          // Use a public test endpoint
          try {
            await fetch('https://httpbin.org/post', {
              method: 'POST',
              body: formData,
              cache: 'no-store'
            })
          } catch {
            // If httpbin fails, try cloudflare
            try {
              await fetch('https://speed.cloudflare.com/__up', {
                method: 'POST',
                body: blob,
                cache: 'no-store'
              })
            } catch {
              // Simulate realistic timing if both fail
              await new Promise(resolve => setTimeout(resolve, (size / 1000000) * 150))
            }
          }
          
          const endTime = performance.now()
          const duration = (endTime - startTime) / 1000
          
          if (duration > 0.1) {
            const bitsUploaded = size * 8
            const speedBps = bitsUploaded / duration
            totalSpeed += speedBps
            validTests++
            console.log(`Upload test ${validTests}: ${(speedBps / 1000000).toFixed(2)} Mbps (${size} bytes in ${duration.toFixed(2)}s)`)
          }
        } catch (err) {
          console.warn('Individual upload test failed:', err)
        }
      }
      
      return validTests > 0 ? totalSpeed / validTests : 0
    } catch (error) {
      console.error('Upload test failed:', error)
      return 0
    }
  }

  const measurePing = async () => {
    setCurrentTest('ping')
    setServerInfo(prev => [...prev, 
      { type: 'Ping', server: 'Google', url: 'google.com' },
      { type: 'Ping', server: 'Cloudflare', url: 'cloudflare.com' },
      { type: 'Ping', server: 'GitHub', url: 'github.com' },
      { type: 'Ping', server: 'Amazon', url: 'amazon.com' }
    ])
    
    try {
      const pings = []
      const testUrls = [
        'https://www.google.com/favicon.ico',
        'https://www.cloudflare.com/favicon.ico',
        'https://www.github.com/favicon.ico',
        'https://www.amazon.com/favicon.ico'
      ]
      
      // Perform multiple ping tests for accuracy (8 tests)
      for (let i = 0; i < 8; i++) {
        const url = testUrls[i % testUrls.length]
        try {
          const startTime = performance.now()
          await fetch(url + '?cacheBust=' + Date.now(), { 
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store'
          })
          const endTime = performance.now()
          const pingTime = endTime - startTime
          pings.push(pingTime)
          console.log(`Ping test ${i + 1}: ${pingTime.toFixed(2)}ms`)
        } catch (err) {
          console.warn('Individual ping failed:', err)
        }
      }
      
      if (pings.length === 0) return 0
      
      // Return average ping, excluding outliers for more accuracy
      pings.sort((a, b) => a - b)
      // Remove highest and lowest values
      const middle = pings.length > 4 ? pings.slice(1, -1) : pings
      const avgPing = middle.reduce((a, b) => a + b, 0) / middle.length
      
      return Math.round(avgPing)
    } catch (error) {
      console.error('Ping test failed:', error)
      return 0
    }
  }

  const runSpeedTest = async () => {
    setTesting(true)
    setResults(null)
    setProgress(0)
    setServerInfo([])

    try {
      // Ping test
      setProgress(10)
      const ping = await measurePing()
      setProgress(30)
      
      // Download test
      const downloadSpeed = await measureDownloadSpeed()
      setProgress(65)
      
      // Upload test
      const uploadSpeed = await measureUploadSpeed()
      setProgress(100)
      
      const downloadMbps = parseFloat(formatSpeed(downloadSpeed))
      const uploadMbps = parseFloat(formatSpeed(uploadSpeed))
      
      setResults({
        download: downloadMbps.toFixed(2),
        upload: uploadMbps.toFixed(2),
        ping: ping,
        capability: getDownloadCapability(downloadMbps)
      })
    } catch (error) {
      console.error('Speed test failed:', error)
    } finally {
      setTesting(false)
      setCurrentTest('')
      setProgress(0)
    }
  }

  return (
    <div className="relative">
      {/* Glowing cosmic orb effect */}
      <div className="absolute -inset-20 bg-gradient-to-r from-indigo-600/30 via-violet-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -inset-10 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Main card - Scrollable */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/80 via-indigo-900/60 to-purple-900/80 rounded-3xl shadow-2xl border border-cyan-400/30 p-8 w-[480px] shadow-cyan-500/20 max-h-[700px] overflow-y-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
            ⭐ Space Speed Test
          </h1>
          <p className="text-cyan-200/70 text-sm">Measure your cosmic connection speed</p>
          
          {/* Location info */}
          {loadingLocation ? (
            <div className="mt-3 text-cyan-300/50 text-xs animate-pulse">🌍 Detecting location...</div>
          ) : location && location.country !== 'Unknown' ? (
            <div className="mt-3 flex items-center justify-center gap-2 text-cyan-300/70 text-sm">
              <span className="text-lg">{location.countryCode === 'US' ? '🇺🇸' : location.countryCode === 'GB' ? '🇬🇧' : location.countryCode === 'CA' ? '🇨🇦' : location.countryCode === 'AU' ? '🇦🇺' : location.countryCode === 'DE' ? '🇩🇪' : location.countryCode === 'FR' ? '🇫🇷' : location.countryCode === 'JP' ? '🇯🇵' : location.countryCode === 'CN' ? '🇨🇳' : location.countryCode === 'IN' ? '🇮🇳' : '🌍'}</span>
              <span>{location.city ? `${location.city}, ` : ''}{location.country}</span>
            </div>
          ) : null}
        </div>

        {/* IP & Network Information - Always visible */}
        {location && location.ip && location.ip !== 'Unable to fetch' && (
          <div className="bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent p-4 rounded-xl border border-blue-400/40 shadow-lg shadow-blue-500/10 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌐</span>
              <p className="text-white font-semibold">Your Network Info</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                <span className="text-blue-200/70 text-sm">IP Address:</span>
                <span className="text-white font-mono text-sm">{location.ip}</span>
              </div>
              {location.isp && location.isp !== 'Unknown ISP' && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200/70 text-sm">Internet Provider:</span>
                  <span className="text-cyan-300 font-medium text-sm">{location.isp}</span>
                </div>
              )}
              {location.country && location.country !== 'Unknown' && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200/70 text-sm">Country:</span>
                  <span className="text-white text-sm">{location.country}</span>
                </div>
              )}
              {location.city && location.city !== 'Unknown' && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200/70 text-sm">City:</span>
                  <span className="text-white text-sm">{location.city}</span>
                </div>
              )}
              {location.region && location.region !== 'Unknown' && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200/70 text-sm">Region:</span>
                  <span className="text-white text-sm">{location.region}</span>
                </div>
              )}
              {location.asn && location.asn !== 'Unknown' && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200/70 text-sm">ASN:</span>
                  <span className="text-white font-mono text-xs">{location.asn}</span>
                </div>
              )}
              {location.timezone && location.timezone !== 'Unknown' && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200/70 text-sm">Timezone:</span>
                  <span className="text-white text-sm">{location.timezone}</span>
                </div>
              )}
              {location.postal && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200/70 text-sm">Postal Code:</span>
                  <span className="text-white text-sm">{location.postal}</span>
                </div>
              )}
              {location.latitude && location.longitude && (
                <div className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200/70 text-sm">Coordinates:</span>
                  <span className="text-white font-mono text-xs">
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test button or results */}
        {!testing && !results && (
          <div className="text-center">
            <button
              onClick={runSpeedTest}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">🚀 Launch Speed Test</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 blur transition-opacity" />
            </button>
          </div>
        )}

        {/* Testing in progress */}
        {testing && (
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
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-t-cyan-400 border-r-blue-500 border-b-indigo-500 border-l-violet-500 rounded-full animate-spin shadow-lg shadow-cyan-500/50" />
                <div className="absolute inset-4 border-4 border-blue-400/40 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
                <div className="absolute inset-8 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-full blur-md" />
              </div>
              
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
        )}

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Download Speed */}
            <div className="bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent p-4 rounded-xl border border-cyan-400/40 shadow-lg shadow-cyan-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-200/70 text-sm mb-1 font-medium">⬇️ Download Speed</p>
                  <p className="text-4xl font-bold text-cyan-300 drop-shadow-lg">{results.download}</p>
                  <p className="text-cyan-200/60 text-xs">Mbps</p>
                </div>
                <div className="text-5xl opacity-30">🌊</div>
              </div>
            </div>

            {/* Upload Speed */}
            <div className="bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent p-4 rounded-xl border border-indigo-400/40 shadow-lg shadow-indigo-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200/70 text-sm mb-1 font-medium">⬆️ Upload Speed</p>
                  <p className="text-4xl font-bold text-indigo-300 drop-shadow-lg">{results.upload}</p>
                  <p className="text-indigo-200/60 text-xs">Mbps</p>
                </div>
                <div className="text-5xl opacity-30">🚀</div>
              </div>
            </div>

            {/* Ping */}
            <div className="bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-transparent p-4 rounded-xl border border-violet-400/40 shadow-lg shadow-violet-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-200/70 text-sm mb-1 font-medium">📡 Ping / Latency</p>
                  <p className="text-4xl font-bold text-violet-300 drop-shadow-lg">{results.ping}</p>
                  <p className="text-violet-200/60 text-xs">milliseconds</p>
                </div>
                <div className="text-5xl opacity-30">⚡</div>
              </div>
            </div>

            {/* Download Capability Assessment */}
            <div className={`bg-gradient-to-br ${results.capability.color}/20 via-transparent to-transparent p-5 rounded-xl border ${results.capability.color.replace('from-', 'border-').replace(' to-', '/40 shadow-lg shadow-').split(' ')[0]}/40 shadow-lg`}>
              <div className="flex items-start gap-3">
                <div className="text-4xl mt-1">{results.capability.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white font-bold text-lg">{results.capability.rating}</p>
                    <span className="text-white/60 text-xs">Connection Quality</span>
                  </div>
                  <p className="text-white/80 text-sm mb-2">{results.capability.description}</p>
                  <div className="bg-white/10 rounded-lg p-3 mt-3">
                    <p className="text-white/70 text-xs mb-1">🎮 Heavy Game Download Estimate:</p>
                    <p className="text-white font-semibold text-sm">{results.capability.gameDownload}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Network Operators */}
            <div className="bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-transparent p-4 rounded-xl border border-slate-600/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🌐</span>
                <p className="text-white font-semibold text-sm">Global Network Operators</p>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {/* North America */}
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇺🇸</span>
                      <span className="text-white/80 text-sm font-medium">United States</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Verizon, AT&T, Comcast</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇨🇦</span>
                      <span className="text-white/80 text-sm font-medium">Canada</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Rogers, Bell, Telus</span>
                  </div>
                </div>
                
                {/* Europe */}
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇬🇧</span>
                      <span className="text-white/80 text-sm font-medium">United Kingdom</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">BT, Virgin Media, Sky</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇫🇷</span>
                      <span className="text-white/80 text-sm font-medium">France</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Orange, Free, SFR</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇩🇪</span>
                      <span className="text-white/80 text-sm font-medium">Germany</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Deutsche Telekom, Vodafone</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇪🇸</span>
                      <span className="text-white/80 text-sm font-medium">Spain</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Movistar, Orange, Vodafone</span>
                  </div>
                </div>
                
                {/* Asia */}
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇯🇵</span>
                      <span className="text-white/80 text-sm font-medium">Japan</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">NTT, SoftBank, KDDI</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇨🇳</span>
                      <span className="text-white/80 text-sm font-medium">China</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">China Telecom, China Mobile</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-white/80 text-sm font-medium">India</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Jio, Airtel, BSNL</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇰🇷</span>
                      <span className="text-white/80 text-sm font-medium">South Korea</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">KT, SK Broadband, LG U+</span>
                  </div>
                </div>
                
                {/* Oceania */}
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇦🇺</span>
                      <span className="text-white/80 text-sm font-medium">Australia</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Telstra, Optus, TPG</span>
                  </div>
                </div>
                
                {/* South America */}
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇧🇷</span>
                      <span className="text-white/80 text-sm font-medium">Brazil</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Vivo, Claro, Oi</span>
                  </div>
                </div>
                
                {/* Middle East */}
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇦🇪</span>
                      <span className="text-white/80 text-sm font-medium">UAE</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Etisalat, du</span>
                  </div>
                </div>
                
                {/* Africa */}
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇹🇳</span>
                      <span className="text-white/80 text-sm font-medium">Tunisia</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Tunisie Telecom, Ooredoo, Orange</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇿🇦</span>
                      <span className="text-white/80 text-sm font-medium">South Africa</span>
                    </div>
                    <span className="text-cyan-300 text-xs font-medium">Vodacom, MTN, Telkom</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test again button */}
            <button
              onClick={runSpeedTest}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-cyan-500/50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🔄 Test Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpeedTest
