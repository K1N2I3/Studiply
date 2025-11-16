import React, { useState, useEffect, useRef } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Battery, BatteryLow, BatteryMedium, BatteryFull, AlertCircle, Infinity, GripVertical, X, Zap, Video, MessageSquare } from 'lucide-react'
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
    
    e.preventDefault()
    e.stopPropagation()
    
    const rect = indicatorRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    
    const offsetX = e.clientX - containerRect.left - position.x
    const offsetY = e.clientY - containerRect.top - position.y
    
    setDragOffset({ x: offsetX, y: offsetY })
    setIsDragging(true)
    setIsExpanded(false)
  }

  // Handle drag
  useEffect(() => {
    if (!isDragging) return

    let rafId = null
    let lastSaveTime = 0

    const handleMouseMove = (e) => {
      if (!containerRef.current || !indicatorRef.current) return

      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const containerRect = containerRef.current.getBoundingClientRect()
        const indicatorRect = indicatorRef.current.getBoundingClientRect()
        
        let newX = e.clientX - containerRect.left - dragOffset.x
        let newY = e.clientY - containerRect.top - dragOffset.y

        const maxX = containerRect.width - indicatorRect.width
        const maxY = containerRect.height - indicatorRect.height

        newX = Math.max(0, Math.min(newX, maxX))
        newY = Math.max(0, Math.min(newY, maxY))

        const newPosition = { x: newX, y: newY }
        setPosition(newPosition)
        
        const now = Date.now()
        if (now - lastSaveTime > 200) {
          localStorage.setItem('limits-indicator-position', JSON.stringify(newPosition))
          lastSaveTime = now
        }
      })
    }

    const handleMouseUp = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      setIsDragging(false)
      if (containerRef.current && indicatorRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const indicatorRect = indicatorRef.current.getBoundingClientRect()
        const finalX = Math.max(0, Math.min(position.x, containerRect.width - indicatorRect.width))
        const finalY = Math.max(0, Math.min(position.y, containerRect.height - indicatorRect.height))
        localStorage.setItem('limits-indicator-position', JSON.stringify({ x: finalX, y: finalY }))
      }
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const checkWarning = (limitsData) => {
    const { remaining, hasStudiplyPass } = limitsData
    
    const isLastSessionRequest = !hasStudiplyPass && remaining.sessionRequests === 1
    const isLastVideoCall = remaining.videoCalls === 1
    
    setShowWarning(isLastSessionRequest || isLastVideoCall)
  }

  if (!user || !limits) {
    return null
  }

  const { remaining, hasStudiplyPass } = limits

  // Get status color and icon
  const getStatusInfo = () => {
    const sessionRemaining = hasStudiplyPass ? Infinity : remaining.sessionRequests
    const videoRemaining = remaining.videoCalls
    
    if (sessionRemaining === 0 || videoRemaining === 0) {
      return {
        color: 'red',
        bgColor: isDark ? 'bg-red-500/20' : 'bg-red-50',
        borderColor: isDark ? 'border-red-500/50' : 'border-red-200',
        textColor: 'text-red-600',
        icon: Battery,
        status: 'Exhausted'
      }
    } else if (sessionRemaining === 1 || videoRemaining === 1) {
      return {
        color: 'yellow',
        bgColor: isDark ? 'bg-yellow-500/20' : 'bg-yellow-50',
        borderColor: isDark ? 'border-yellow-500/50' : 'border-yellow-200',
        textColor: 'text-yellow-600',
        icon: BatteryLow,
        status: 'Low'
      }
    } else {
      return {
        color: 'green',
        bgColor: isDark ? 'bg-green-500/20' : 'bg-green-50',
        borderColor: isDark ? 'border-green-500/50' : 'border-green-200',
        textColor: 'text-green-600',
        icon: hasStudiplyPass && sessionRemaining === Infinity ? Infinity : BatteryFull,
        status: 'Good'
      }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-50"
    >
      <div
        ref={indicatorRef}
        className={`absolute transition-none ${
          showWarning && !isDragging ? 'animate-pulse' : ''
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: 'auto',
          willChange: isDragging ? 'transform' : 'auto'
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          if (!isDragging) {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }
        }}
      >
        {/* Compact View */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 shadow-xl ${
          isDark
            ? `${statusInfo.bgColor} ${statusInfo.borderColor}`
            : `${statusInfo.bgColor} ${statusInfo.borderColor}`
        }`}>
          {/* Drag Handle */}
          <div 
            className="flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={(e) => {
              e.stopPropagation()
              handleMouseDown(e)
            }}
            style={{ userSelect: 'none' }}
          >
            <GripVertical className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>

          {/* Status Icon */}
          <div className="flex-shrink-0">
            <StatusIcon className={`w-6 h-6 ${statusInfo.textColor}`} />
          </div>

          {/* Limits Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <MessageSquare className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
              <span className={`text-base font-bold ${statusInfo.textColor}`}>
                {hasStudiplyPass && remaining.sessionRequests === Infinity ? '∞' : remaining.sessionRequests}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                /{hasStudiplyPass ? '∞' : '3'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Video className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
              <span className={`text-base font-bold ${statusInfo.textColor}`}>
                {remaining.videoCalls}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                /{hasStudiplyPass ? '3' : '1'}
              </span>
            </div>
          </div>

          {/* Warning Icon */}
          {showWarning && (
            <AlertCircle className={`w-5 h-5 ${statusInfo.textColor} animate-pulse flex-shrink-0`} />
          )}

          {/* Close button when expanded */}
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(false)
              }}
              className={`flex-shrink-0 p-1 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              <X className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            </button>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && !isDragging && (
          <div className={`absolute top-full left-0 mt-3 w-96 rounded-2xl border-2 shadow-2xl p-6 ${
            isDark
              ? 'bg-slate-800 border-slate-600'
              : 'bg-white border-slate-300'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${statusInfo.bgColor}`}>
                  <StatusIcon className={`w-6 h-6 ${statusInfo.textColor}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Daily Limits
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {statusInfo.status} • {hasStudiplyPass ? 'Pro Account' : 'Free Account'}
                  </p>
                </div>
              </div>
              {hasStudiplyPass && (
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold">
                  Pro
                </span>
              )}
            </div>

            {/* Limits Cards */}
            <div className="space-y-4 mb-6">
              {/* Session Requests Card */}
              <div className={`p-4 rounded-xl border-2 ${
                isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Session Requests
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${statusInfo.textColor}`}>
                      {hasStudiplyPass && remaining.sessionRequests === Infinity
                        ? '∞'
                        : remaining.sessionRequests}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      / {hasStudiplyPass ? '∞' : '3'}
                    </span>
                  </div>
                </div>
                {!hasStudiplyPass && (
                  <div className={`h-2.5 rounded-full overflow-hidden ${
                    isDark ? 'bg-slate-600' : 'bg-slate-200'
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

              {/* Video Calls Card */}
              <div className={`p-4 rounded-xl border-2 ${
                isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Video className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Video Calls
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${statusInfo.textColor}`}>
                      {remaining.videoCalls}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      / {hasStudiplyPass ? '3' : '1'}
                    </span>
                  </div>
                </div>
                <div className={`h-2.5 rounded-full overflow-hidden ${
                  isDark ? 'bg-slate-600' : 'bg-slate-200'
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

            {/* Warning Banner */}
            {showWarning && (
              <div className={`mb-4 p-4 rounded-xl border-2 flex items-start gap-3 ${
                isDark ? 'bg-yellow-500/20 border-yellow-500/40' : 'bg-yellow-50 border-yellow-300'
              }`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <div>
                  <p className={`font-semibold mb-1 ${
                    isDark ? 'text-yellow-300' : 'text-yellow-800'
                  }`}>
                    Last Attempt Remaining!
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-yellow-200/80' : 'text-yellow-700'
                  }`}>
                    You're on your last attempt. Consider upgrading to Pro for unlimited access.
                  </p>
                </div>
              </div>
            )}

            {/* Upgrade Prompt */}
            {!hasStudiplyPass && (
              <div className={`pt-4 border-t-2 ${
                isDark ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <Zap className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Upgrade to Pro
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Get unlimited session requests
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LimitsIndicator
