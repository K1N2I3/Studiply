import React, { useState, useEffect } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Battery, BatteryLow, BatteryMedium, BatteryFull, AlertCircle, Infinity } from 'lucide-react'
import { getUserLimits, subscribeToLimits } from '../services/limitsService'

const LimitsIndicator = () => {
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const [limits, setLimits] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

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
      return <Infinity className="w-5 h-5 text-green-500" />
    }
    
    const sessionPercent = hasStudiplyPass 
      ? 100 
      : (remaining.sessionRequests / 3) * 100
    const videoPercent = (remaining.videoCalls / (hasStudiplyPass ? 3 : 1)) * 100
    
    // Use the lower of the two percentages
    const overallPercent = Math.min(sessionPercent, videoPercent)
    
    if (overallPercent === 0) {
      return <Battery className="w-5 h-5 text-red-500" />
    } else if (overallPercent <= 33) {
      return <BatteryLow className="w-5 h-5 text-yellow-500" />
    } else if (overallPercent <= 66) {
      return <BatteryMedium className="w-5 h-5 text-yellow-400" />
    } else {
      return <BatteryFull className="w-5 h-5 text-green-500" />
    }
  }

  const getColorClass = () => {
    if (hasStudiplyPass && remaining.sessionRequests === Infinity) {
      return 'text-green-500'
    }
    
    const sessionRemaining = hasStudiplyPass ? Infinity : remaining.sessionRequests
    const videoRemaining = remaining.videoCalls
    
    if (sessionRemaining === 0 || videoRemaining === 0) {
      return 'text-red-500'
    } else if (sessionRemaining === 1 || videoRemaining === 1) {
      return 'text-yellow-500'
    } else {
      return 'text-green-500'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`relative cursor-pointer transition-all duration-300 ${
          showWarning ? 'animate-pulse' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Main indicator button */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-xl shadow-lg ${
          isDark
            ? 'bg-white/10 border-white/20 hover:bg-white/15'
            : 'bg-white/90 border-slate-200 hover:bg-white'
        }`}>
          {getBatteryIcon()}
          <div className="flex flex-col items-start">
            <span className={`text-xs font-semibold ${getColorClass()}`}>
              {hasStudiplyPass && remaining.sessionRequests === Infinity 
                ? '∞' 
                : remaining.sessionRequests}
            </span>
            <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {remaining.videoCalls}
            </span>
          </div>
          {showWarning && (
            <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />
          )}
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className={`absolute top-full right-0 mt-2 w-64 rounded-xl border backdrop-blur-xl shadow-2xl p-4 ${
            isDark
              ? 'bg-white/15 border-white/20'
              : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Daily Limits
                </span>
                {hasStudiplyPass && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Pro
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      Session Requests
                    </span>
                    <span className={`text-xs font-semibold ${getColorClass()}`}>
                      {hasStudiplyPass && remaining.sessionRequests === Infinity
                        ? '∞ / ∞'
                        : `${remaining.sessionRequests} / ${hasStudiplyPass ? '∞' : '3'}`}
                    </span>
                  </div>
                  {!hasStudiplyPass && (
                    <div className={`h-2 rounded-full overflow-hidden ${
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
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      Video Calls
                    </span>
                    <span className={`text-xs font-semibold ${getColorClass()}`}>
                      {remaining.videoCalls} / {hasStudiplyPass ? '3' : '1'}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
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
                <div className={`mt-2 p-2 rounded-lg ${
                  isDark ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className={`text-xs ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    ⚠️ Last attempt remaining!
                  </p>
                </div>
              )}

              {!hasStudiplyPass && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <p className={`text-xs text-center ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
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

