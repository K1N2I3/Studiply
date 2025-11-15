import React, { useState, useEffect, useRef } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Battery, BatteryLow, BatteryMedium, BatteryFull, AlertCircle, Infinity, GripVertical } from 'lucide-react'
import { getUserLimits, subscribeToLimits } from '../services/limitsService'

const LimitsIndicator = () => {
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const [limits, setLimits] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const indicatorRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!user?.id) return

    // Initial fetch
    getUserLimits(user.id).then(result => {
      if (result.success) {
        setLimits(result)
        checkWarning(result)
      }
    })

    // Subscribe to updates
    const unsubscribe = subscribeToLimits(user.id, (result) => {
      if (result.success) {
        setLimits(result)
        checkWarning(result)
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user?.id])

  // Initialize position from localStorage or default
  useEffect(() => {
    const savedPosition = localStorage.getItem('limits-indicator-position')
    if (savedPosition) {
      try {
        const pos = JSON.parse(savedPosition)
        setPosition(pos)
      } catch (e) {
        console.error('Error parsing saved position:', e)
        // Default position: top-right (will be calculated on first render)
        setPosition({ x: 0, y: 0 })
      }
    } else {
      // Default position: calculate top-right position on first render
      setTimeout(() => {
        if (containerRef.current && indicatorRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect()
          const indicatorRect = indicatorRef.current.getBoundingClientRect()
          const defaultX = containerRect.width - indicatorRect.width - 16
          const defaultY = 16
          setPosition({ x: defaultX, y: defaultY })
        }
      }, 100)
    }
  }, [])

  // Handle drag start
  const handleMouseDown = (e) => {
    if (!indicatorRef.current || !containerRef.current) return
    
    const rect = indicatorRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    
    setDragOffset({
      x: e.clientX - rect.left - position.x,
      y: e.clientY - rect.top - position.y
    })
    setIsDragging(true)
  }

  // Handle drag
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      if (!containerRef.current || !indicatorRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const indicatorRect = indicatorRef.current.getBoundingClientRect()
      
      let newX = e.clientX - containerRect.left - dragOffset.x
      let newY = e.clientY - containerRect.top - dragOffset.y

      // Constrain to container bounds
      const maxX = containerRect.width - indicatorRect.width
      const maxY = containerRect.height - indicatorRect.height

      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))

      const newPosition = { x: newX, y: newY }
      setPosition(newPosition)
      // Save position to localStorage
      localStorage.setItem('limits-indicator-position', JSON.stringify(newPosition))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, position])

  const checkWarning = (limitsData) => {
    const { remaining, hasStudiplyPass } = limitsData
    
    // Show warning if last attempt remaining
    const isLastSessionRequest = !hasStudiplyPass && remaining.sessionRequests === 1
    const isLastVideoCall = remaining.videoCalls === 1
    
    setShowWarning(isLastSessionRequest || isLastVideoCall)
  }

  if (!user || !limits) {
    return null
  }

  const { remaining, hasStudiplyPass } = limits

  // Get battery icon based on remaining limits
  const getBatteryIcon = () => {
    if (hasStudiplyPass && remaining.sessionRequests === Infinity) {
      return <Infinity className="w-7 h-7 text-green-500" />
    }
    
    const sessionPercent = hasStudiplyPass 
      ? 100 
      : (remaining.sessionRequests / 3) * 100
    const videoPercent = (remaining.videoCalls / (hasStudiplyPass ? 3 : 1)) * 100
    
    // Use the lower of the two percentages
    const overallPercent = Math.min(sessionPercent, videoPercent)
    
    if (overallPercent === 0) {
      return <Battery className="w-7 h-7 text-red-500" />
    } else if (overallPercent <= 33) {
      return <BatteryLow className="w-7 h-7 text-yellow-500" />
    } else if (overallPercent <= 66) {
      return <BatteryMedium className="w-7 h-7 text-yellow-400" />
    } else {
      return <BatteryFull className="w-7 h-7 text-green-500" />
    }
  }

  const getColorClass = () => {
    if (hasStudiplyPass && remaining.sessionRequests === Infinity) {
      return 'text-green-600'
    }
    
    const sessionRemaining = hasStudiplyPass ? Infinity : remaining.sessionRequests
    const videoRemaining = remaining.videoCalls
    
    if (sessionRemaining === 0 || videoRemaining === 0) {
      return 'text-red-600'
    } else if (sessionRemaining === 1 || videoRemaining === 1) {
      return 'text-yellow-600'
    } else {
      return 'text-green-600'
    }
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-50"
    >
      <div
        ref={indicatorRef}
        className={`absolute cursor-move transition-all duration-200 ${
          showWarning && !isDragging ? 'animate-pulse' : ''
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: 'auto'
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          // Only toggle expand if not dragging
          if (!isDragging) {
            setIsExpanded(!isExpanded)
          }
        }}
      >
        {/* Main indicator button */}
        <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 shadow-2xl ${
          isDark
            ? 'bg-slate-800 border-slate-600 hover:bg-slate-700'
            : 'bg-white border-slate-400 hover:bg-slate-50'
        }`}>
          {/* Drag handle */}
          <div 
            className="flex-shrink-0 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              e.stopPropagation()
              handleMouseDown(e)
            }}
          >
            <GripVertical className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <div className="flex-shrink-0">
            {getBatteryIcon()}
          </div>
          <div className="flex flex-col items-start min-w-[80px] gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-black ${getColorClass()}`}>
                {hasStudiplyPass && remaining.sessionRequests === Infinity 
                  ? '∞' 
                  : remaining.sessionRequests}
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                /{hasStudiplyPass ? '∞' : '3'}
              </span>
              <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Session
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-black ${getColorClass()}`}>
                {remaining.videoCalls}
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                /{hasStudiplyPass ? '3' : '1'}
              </span>
              <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Video
              </span>
            </div>
          </div>
          {showWarning && (
            <AlertCircle className="w-6 h-6 text-yellow-500 animate-pulse flex-shrink-0" />
          )}
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className={`absolute top-full left-0 mt-3 w-80 rounded-2xl border-2 shadow-2xl p-6 ${
            isDark
              ? 'bg-slate-800 border-slate-600'
              : 'bg-white border-slate-300'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Daily Limits
                </span>
                {hasStudiplyPass && (
                  <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                    Pro
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                      Session Requests
                    </span>
                    <span className={`text-sm font-bold ${getColorClass()}`}>
                      {hasStudiplyPass && remaining.sessionRequests === Infinity
                        ? '∞ / ∞'
                        : `${remaining.sessionRequests} / ${hasStudiplyPass ? '∞' : '3'}`}
                    </span>
                  </div>
                  {!hasStudiplyPass && (
                    <div className={`h-3 rounded-full overflow-hidden ${
                      isDark ? 'bg-white/10' : 'bg-slate-200'
                    }`}>
                      <div
                        className={`h-full transition-all ${
                          remaining.sessionRequests === 0
                            ? 'bg-red-500'
                            : remaining.sessionRequests === 1
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(remaining.sessionRequests / 3) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                      Video Calls
                    </span>
                    <span className={`text-sm font-bold ${getColorClass()}`}>
                      {remaining.videoCalls} / {hasStudiplyPass ? '3' : '1'}
                    </span>
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden ${
                    isDark ? 'bg-white/10' : 'bg-slate-200'
                  }`}>
                    <div
                      className={`h-full transition-all ${
                        remaining.videoCalls === 0
                          ? 'bg-red-500'
                          : remaining.videoCalls === 1
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(remaining.videoCalls / (hasStudiplyPass ? 3 : 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {showWarning && (
                <div className={`mt-4 p-3 rounded-xl border-2 ${
                  isDark ? 'bg-yellow-500/20 border-yellow-500/40' : 'bg-yellow-50 border-yellow-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                      isDark ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      isDark ? 'text-yellow-300' : 'text-yellow-800'
                    }`}>
                      Last attempt remaining!
                    </p>
                  </div>
                </div>
              )}

              {!hasStudiplyPass && (
                <div className="mt-4 pt-4 border-t-2 border-white/10">
                  <p className={`text-sm text-center font-medium ${
                    isDark ? 'text-white/70' : 'text-slate-600'
                  }`}>
                    Upgrade to Pro for unlimited requests
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LimitsIndicator

