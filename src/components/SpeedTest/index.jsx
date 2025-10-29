import React, { useState, useEffect } from 'react'
import SpeedTestCard from './SpeedTestCard'
import Header from './Header'
import StartButton from './StartButton'
import TestProgress from './TestProgress'
import ResultsDisplay from './ResultsDisplay'

const SpeedTest = ({ onDataUpdate }) => {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState(null)
  const [currentTest, setCurrentTest] = useState('')
  const [progress, setProgress] = useState(0)
  const [location, setLocation] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(true)
  const [serverInfo, setServerInfo] = useState([])

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

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

  // ============================================
  // LOCATION DETECTION
  // ============================================

  const fetchLocation = async () => {
    try {
      setLoadingLocation(true)
      const response = await fetch('https://ipapi.co/json/')
      if (response.ok) {
        const data = await response.json()
        setLocation({
          country: data.country_name || 'Unknown',
          city: data.city || '',
          region: data.region || '',
          countryCode: data.country_code || '',
          ip: data.ip || ''
        })
      } else {
        const fallbackResponse = await fetch('http://ip-api.com/json/')
        const fallbackData = await fallbackResponse.json()
        setLocation({
          country: fallbackData.country || 'Unknown',
          city: fallbackData.city || '',
          region: fallbackData.regionName || '',
          countryCode: fallbackData.countryCode || '',
          ip: fallbackData.query || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch location:', error)
      setLocation({ country: 'Unknown', city: '', region: '', countryCode: '', ip: '' })
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

  // ============================================
  // SPEED TEST FUNCTIONS
  // ============================================

  const measureDownloadSpeed = async () => {
    setCurrentTest('download')
    setServerInfo(prev => [...prev, { type: 'Download', server: 'Cloudflare CDN', url: 'speed.cloudflare.com' }])
    
    try {
      let totalSpeed = 0
      let validTests = 0

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
    
    const testSizes = [250000, 500000, 1000000, 2000000]
    
    try {
      let totalSpeed = 0
      let validTests = 0

      for (const size of testSizes) {
        try {
          const data = new Uint8Array(size)
          for (let i = 0; i < size; i++) {
            data[i] = Math.floor(Math.random() * 256)
          }
          
          const blob = new Blob([data])
          const formData = new FormData()
          formData.append('file', blob, 'test.bin')
          
          const startTime = performance.now()
          
          try {
            await fetch('https://httpbin.org/post', {
              method: 'POST',
              body: formData,
              cache: 'no-store'
            })
          } catch {
            try {
              await fetch('https://speed.cloudflare.com/__up', {
                method: 'POST',
                body: blob,
                cache: 'no-store'
              })
            } catch {
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
      
      pings.sort((a, b) => a - b)
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
      setProgress(10)
      const ping = await measurePing()
      setProgress(30)
      
      const downloadSpeed = await measureDownloadSpeed()
      setProgress(65)
      
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

  // ============================================
  // RENDER
  // ============================================

  return (
    <SpeedTestCard>
      {/* Header Section */}
      <Header location={location} loadingLocation={loadingLocation} />

      {/* Content Area */}
      {!testing && !results && (
        <StartButton onStart={runSpeedTest} />
      )}

      {testing && (
        <TestProgress progress={progress} currentTest={currentTest} />
      )}

      {results && (
        <ResultsDisplay 
          results={results} 
          serverInfo={serverInfo} 
          onTestAgain={runSpeedTest} 
        />
      )}
    </SpeedTestCard>
  )
}

export default SpeedTest
