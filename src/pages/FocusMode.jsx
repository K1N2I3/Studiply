import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock, Lock, Unlock, Settings, Smartphone, Monitor, Globe, AlertTriangle, BarChart3 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'

const FocusMode = () => {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [currentSessionStartTime, setCurrentSessionStartTime] = useState(null)
  const [sessionType, setSessionType] = useState('pomodoro')
  const [focusLockEnabled, setFocusLockEnabled] = useState(false)
  const [showStartConfirm, setShowStartConfirm] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [sessionHistory, setSessionHistory] = useState([])
  const [blockedApps, setBlockedApps] = useState([
    { name: 'Block All Websites', icon: '🌐', blocked: false, isSpecial: true },
    { name: 'Facebook', icon: '📘', blocked: true },
    { name: 'Instagram', icon: '📷', blocked: true },
    { name: 'TikTok', icon: '🎵', blocked: true },
    { name: 'YouTube', icon: '📺', blocked: false },
    { name: 'Twitter', icon: '🐦', blocked: true },
    { name: 'X', icon: '❌', blocked: true },
    { name: 'Snapchat', icon: '👻', blocked: true }
  ])
  const [showFocusReminder, setShowFocusReminder] = useState(false)
  const [pageHiddenCount, setPageHiddenCount] = useState(0)
  const [lastHiddenTime, setLastHiddenTime] = useState(null)
  const [extensionInstalled, setExtensionInstalled] = useState(false)
  const [extensionActive, setExtensionActive] = useState(false)
  const [isChrome, setIsChrome] = useState(true)
  const [showExtensionModal, setShowExtensionModal] = useState(false)
  const [showExtensionBanner, setShowExtensionBanner] = useState(true)

  // Check if browser is Chrome
  useEffect(() => {
    const checkBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isChromeBrowser = /chrome/.test(userAgent) && !/edg|opr|brave/.test(userAgent)
      setIsChrome(isChromeBrowser)
      
      if (!isChromeBrowser) {
        console.log('⚠️ Focus Mode is only available in Chrome browser')
      }
    }
    
    checkBrowser()
  }, [])

  const sessionTypes = [
    { id: 'pomodoro', name: 'Pomodoro', duration: 25, color: 'bg-red-500' },
    { id: 'short-break', name: 'Short Break', duration: 5, color: 'bg-green-500' },
    { id: 'long-break', name: 'Long Break', duration: 15, color: 'bg-blue-500' },
    { id: 'deep-work', name: 'Deep Work', duration: 90, color: 'bg-purple-500' }
  ]

  // Load session from localStorage
  const loadSessionFromStorage = () => {
    try {
      const savedSession = localStorage.getItem('studiply_focus_session')
      return savedSession ? JSON.parse(savedSession) : null
    } catch (error) {
      console.error('Failed to load session from localStorage:', error)
      return null
    }
  }

  const clearSessionFromStorage = () => {
    try {
      localStorage.removeItem('studiply_focus_session')
    } catch (error) {
      console.error('Failed to clear session from localStorage:', error)
    }
  }

  // Load session history from localStorage
  const loadSessionHistory = () => {
    try {
      const savedHistory = localStorage.getItem('studiply_focus_history')
      return savedHistory ? JSON.parse(savedHistory) : []
    } catch (error) {
      console.error('Failed to load history from localStorage:', error)
      return []
    }
  }

  // Page Visibility API - 检测用户是否离开页面
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && document.hidden) {
        // 用户离开了页面
        setPageHiddenCount(prev => prev + 1)
        setLastHiddenTime(new Date().toISOString())
        setShowFocusReminder(true)
        
        // 保存到localStorage
        const focusData = {
          active: true,
          startTime: currentSessionStartTime,
          pageHiddenCount: pageHiddenCount + 1,
          lastHiddenTime: new Date().toISOString(),
          sessionType: sessionType
        }
        localStorage.setItem('studiply_focus_mode', JSON.stringify(focusData))
      } else if (isActive && !document.hidden) {
        // 用户回到了页面
        setShowFocusReminder(false)
      }
    }

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // 监听窗口失焦/获焦
    const handleWindowBlur = () => {
      if (isActive) {
        setPageHiddenCount(prev => prev + 1)
        setLastHiddenTime(new Date().toISOString())
        setShowFocusReminder(true)
      }
    }
    
    const handleWindowFocus = () => {
      if (isActive) {
        setShowFocusReminder(false)
      }
    }

    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [isActive, pageHiddenCount, currentSessionStartTime, sessionType])

  // 页面加载时检查专注模式状态
  useEffect(() => {
    const checkFocusModeStatus = () => {
      try {
        const focusData = localStorage.getItem('studiply_focus_mode')
        if (focusData) {
          const data = JSON.parse(focusData)
          if (data.active) {
            // 恢复专注模式状态
            setIsActive(true)
            setCurrentSessionStartTime(data.startTime)
            setPageHiddenCount(data.pageHiddenCount || 0)
            setLastHiddenTime(data.lastHiddenTime)
            setSessionType(data.sessionType || 'pomodoro')
            setTimeLeft(data.timeLeft || 25 * 60)
            
            // 如果用户刚刚回到页面，显示提醒
            if (data.lastHiddenTime) {
              const timeSinceHidden = Date.now() - new Date(data.lastHiddenTime).getTime()
              if (timeSinceHidden < 5000) { // 5秒内
                setShowFocusReminder(true)
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to check focus mode status:', error)
      }
    }

    checkFocusModeStatus()
  }, [])


  // 专注锁定功能 - 阻止用户离开页面
  useEffect(() => {
    if (isActive && focusLockEnabled) {
      const handleBeforeUnload = (e) => {
        e.preventDefault()
        e.returnValue = 'Focus session is in progress. Are you sure you want to leave?'
        return 'Focus session is in progress. Are you sure you want to leave?'
      }

      const handleVisibilityChange = () => {
        if (document.hidden && isActive && focusLockEnabled) {
          // 如果用户切换到其他标签页，显示警告
          alert('Focus session is in progress. Please return to this page.')
        }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      // 清理函数
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [isActive, focusLockEnabled])

  // 初始化
  useEffect(() => {
    if (!hasInitialized) {
      const savedSession = loadSessionFromStorage()
      const savedHistory = loadSessionHistory()
      
      if (savedSession) {
        setTimeLeft(savedSession.timeLeft)
        setIsActive(savedSession.isActive)
        setCurrentSessionStartTime(savedSession.startTime)
        setSessionType(savedSession.sessionType)
        setFocusLockEnabled(savedSession.focusLockEnabled)
      }
      
      setSessionHistory(savedHistory)
      setHasInitialized(true)
    }
  }, [hasInitialized])

  // Check for extension
  useEffect(() => {
    const checkExtension = () => {
      // 监听来自扩展程序的消息
      const handleExtensionMessage = (event) => {
        if (event.origin !== window.location.origin) return
        
        const { type, data } = event.data
        
        if (type === 'STUDIPLY_EXTENSION_READY') {
          setExtensionInstalled(true)
          setExtensionActive(true)
          console.log('✅ Extension ready and active')
        } else if (type === 'STUDIPLY_EXTENSION_STATUS') {
          setExtensionInstalled(true)
          setExtensionActive(data.active)
          console.log('Extension status:', data)
        } else if (type === 'STUDIPLY_EXTENSION_LOADED') {
          setExtensionInstalled(true)
          console.log('Extension detected and loaded')
        }
      }
      
      // 添加消息监听器
      window.addEventListener('message', handleExtensionMessage)
      
      // 发送测试消息来检测扩展程序
      window.postMessage({
        type: 'STUDIPLY_GET_EXTENSION_STATUS',
        timestamp: Date.now()
      }, window.location.origin)
      
      // 设置超时检测
      const timeout = setTimeout(() => {
        // 如果3秒内没有收到响应，检查localStorage
        const extensionData = localStorage.getItem('studiply_extension_status')
        if (extensionData) {
          try {
            const data = JSON.parse(extensionData)
            setExtensionInstalled(true)
            setExtensionActive(data.active || false)
            console.log('Extension detected via localStorage')
          } catch (e) {
            console.log('Extension not detected')
          }
        }
      }, 3000)
      
      return () => {
        window.removeEventListener('message', handleExtensionMessage)
        clearTimeout(timeout)
      }
    }

    const cleanup = checkExtension()
    return cleanup
  }, [])

  // 保存session到localStorage
  useEffect(() => {
    if (hasInitialized) {
      const sessionData = {
        timeLeft,
        isActive,
        startTime: currentSessionStartTime,
        sessionType,
        focusLockEnabled
      }
      localStorage.setItem('studiply_focus_session', JSON.stringify(sessionData))
    }
  }, [timeLeft, isActive, currentSessionStartTime, sessionType, focusLockEnabled, hasInitialized])

  // 计时器逻辑
  useEffect(() => {
    let interval = null
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          const newTime = timeLeft - 1
          if (newTime === 0) {
            // Session completed
            const sessionData = {
              id: Date.now(),
              type: sessionTypes.find(s => s.id === sessionType)?.name || 'Pomodoro',
              duration: sessionTypes.find(s => s.id === sessionType)?.duration || 25,
              startTime: currentSessionStartTime,
              endTime: new Date().toISOString()
            }
            
            const newHistory = [...sessionHistory, sessionData]
            setSessionHistory(newHistory)
            localStorage.setItem('studiply_focus_history', JSON.stringify(newHistory))
            
            setIsActive(false)
            setCurrentSessionStartTime(null)
            clearSessionFromStorage()
            
            // 播放完成音效
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Focus Session Completed!', {
                body: 'Great job! Your focus session is complete.',
                icon: '/favicon.ico'
              })
            }
          }
          return newTime
        })
      }, 1000)
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, currentSessionStartTime, sessionType, sessionTypes, sessionHistory])

  // 监听timeLeft变化，更新localStorage中的剩余时间
  useEffect(() => {
    if (currentSessionStartTime) {
      const sessionData = {
        timeLeft,
        isActive,
        startTime: currentSessionStartTime,
        sessionType,
        focusLockEnabled
      }
      localStorage.setItem('studiply_focus_session', JSON.stringify(sessionData))
    }
  }, [timeLeft, isActive, currentSessionStartTime, sessionType, focusLockEnabled])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatSessionTime = (date) => {
    // 如果传入的是字符串，转换为Date对象
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const startSession = () => {
    if (focusLockEnabled) {
      setShowStartConfirm(true)
      return
    }

    // 直接开始session
    startSessionConfirmed()
  }

  const startSessionConfirmed = () => {
    const selectedSession = sessionTypes.find(s => s.id === sessionType)
    if (selectedSession) {
      // 确保使用当前选择的session类型的时间
      setTimeLeft(selectedSession.duration * 60)
      setIsActive(true)
      setCurrentSessionStartTime(new Date().toISOString())
      setShowStartConfirm(false)
      
      // 重置专注提醒状态
      setPageHiddenCount(0)
      setLastHiddenTime(null)
      setShowFocusReminder(false)
      
      // 保存专注模式状态到localStorage
      const focusData = {
        active: true,
        startTime: new Date().toISOString(),
        pageHiddenCount: 0,
        lastHiddenTime: null,
        sessionType: sessionType,
        timeLeft: selectedSession.duration * 60
      }
      localStorage.setItem('studiply_focus_mode', JSON.stringify(focusData))
      
      // 如果扩展程序已安装，发送启动消息
      console.log('🔍 Extension installed:', extensionInstalled)
      console.log('🔍 Extension active:', extensionActive)
      
      // 尝试发送启动消息，不管扩展程序状态如何
      // 如果扩展程序存在，它会响应；如果不存在，消息会被忽略
      // Check if "Block All Websites" is enabled
      const blockAllEnabled = blockedApps.find(app => app.name === 'Block All Websites' && app.blocked)
      
      const blockedSites = blockAllEnabled 
        ? ['*'] // Special signal to block all websites
        : blockedApps
            .filter(app => app.blocked && !app.isSpecial)
            .map(app => {
              // 将应用名称转换为域名
              const siteMap = {
                'Facebook': 'facebook.com',
                'Instagram': 'instagram.com',
                'TikTok': 'tiktok.com',
                'YouTube': 'youtube.com',
                'Twitter': 'twitter.com',
                'X': 'x.com',
                'Snapchat': 'snapchat.com'
              }
              return siteMap[app.name] || app.name.toLowerCase() + '.com'
            })
      
      console.log('🚀 Sending focus start message with blocked sites:', blockedSites)
      window.postMessage({
        type: 'STUDIPLY_FOCUS_START',
        data: {
          sessionType: sessionType,
          duration: selectedSession.duration,
          startTime: new Date().toISOString(),
          blockedSites: blockedSites
        }
      }, window.location.origin)
    }
  }

  const pauseSession = () => {
    setIsActive(false)
  }

  const resumeSession = () => {
    setIsActive(true)
  }

  const stopSession = () => {
    setIsActive(false)
    setCurrentSessionStartTime(null)
    setExtensionActive(false) // Reset extension status to ready
    const selectedSession = sessionTypes.find(s => s.id === sessionType)
    if (selectedSession) {
      // 重置到当前选择的session类型的完整时间
      setTimeLeft(selectedSession.duration * 60)
    }
    clearSessionFromStorage()
    
    // 清除专注模式状态
    setPageHiddenCount(0)
    setLastHiddenTime(null)
    setShowFocusReminder(false)
    localStorage.removeItem('studiply_focus_mode')
    
    // 发送停止消息给扩展程序（如果存在）
    console.log('🛑 Sending focus stop message')
    window.postMessage({
      type: 'STUDIPLY_FOCUS_STOP'
    }, window.location.origin)
  }

  const toggleFocusLock = () => {
    setFocusLockEnabled(!focusLockEnabled)
  }

  const cancelStartSession = () => {
    setShowStartConfirm(false)
  }

  const getSessionColor = () => {
    const session = sessionTypes.find(s => s.id === sessionType)
    return session ? session.color : 'bg-gray-500'
  }

  const toggleAppBlock = (appName) => {
    setBlockedApps(prev => prev.map(app => {
      if (app.name === appName) {
        // If toggling "Block All Websites"
        if (app.isSpecial) {
          const newBlockedState = !app.blocked
          return { ...app, blocked: newBlockedState }
        } else {
          return { ...app, blocked: !app.blocked }
        }
      } else {
        // If "Block All Websites" is being enabled, set all other apps to blocked
        if (appName === 'Block All Websites') {
          const blockAllApp = prev.find(a => a.name === 'Block All Websites')
          if (blockAllApp && !blockAllApp.blocked) {
            // When enabling "Block All Websites", set all other apps to blocked
            return { ...app, blocked: true }
          } else if (blockAllApp && blockAllApp.blocked) {
            // When disabling "Block All Websites", keep other apps as they were
            return app
          }
        }
        return app
      }
    }))
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute top-28 right-0 h-72 w-72 rounded-full bg-pink-400/20 blur-[140px]" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pt-14 pb-8">
        {showExtensionBanner && (
          <section className={`rounded-[28px] border px-6 py-5 shadow-2xl backdrop-blur-xl transition ${
            isDark ? 'border-white/12 bg-white/8' : 'border-white/70 bg-white'
          }`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className={`rounded-2xl p-3 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <AlertTriangle className={`h-5 w-5 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} />
                </div>
                <div>
                  <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Boost your focus with the Studiply Chrome extension
                  </p>
                  <p className={`${isDark ? 'text-white/70' : 'text-slate-600'} text-sm`}>
                    Block distracting websites automatically when the timer starts.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => window.open('https://youtu.be/ZzDNIslGPKo', '_blank')}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isDark ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  🎥 Watch Tutorial
                </button>
                <button
                  onClick={() => setShowExtensionModal(true)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isDark ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  📥 Download
                </button>
                <button
                  onClick={() => setShowExtensionBanner(false)}
                  className={`rounded-full p-2 transition ${
                    isDark ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                  }`}
                >
                  <Square className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        <section className={`rounded-[32px] border px-8 py-10 text-center shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/12 bg-white/6' : 'border-white/70 bg-white'
        }`}>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
            <div className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold tracking-wide ${
              isDark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-600'
            }`}>
              Focus smarter, not harder
            </div>
            <h1 className={`text-4xl font-black tracking-tight ${
              isDark ? 'bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent' : 'bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent'
            }`}>
              Stay in the zone with Studiply Focus Mode
            </h1>
            <p className={`${isDark ? 'text-white/70' : 'text-slate-600'} text-base`}>Lock in, block distractions, and celebrate every deep work win.</p>
          </div>
        </section>

        {!isChrome && (
          <section className={`rounded-[32px] border px-8 py-10 shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-white/6' : 'border-white/70 bg-white'
          }`}>
            <div className={`rounded-[28px] border px-6 py-6 ${
              isDark ? 'border-red-400/30 bg-gradient-to-r from-red-500/15 to-orange-500/15' : 'border-red-200 bg-gradient-to-r from-red-100 to-orange-100'
            }`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    isDark ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                  }`}>
                    <AlertTriangle className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Chrome required</h2>
                    <p className={`${isDark ? 'text-white/70' : 'text-slate-600'} mt-2 text-sm`}>Our blocking extension currently supports Google Chrome only.</p>
                    <div className={`mt-4 rounded-2xl px-4 py-4 ${
                      isDark ? 'bg-white/10' : 'bg-white'
                    }`}>
                      <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Why only Chrome?</h3>
                      <ul className={`${isDark ? 'text-white/60' : 'text-slate-500'} mt-2 space-y-1 text-sm`}
                      >
                        <li>• Chrome’s extension APIs offer reliable site blocking.</li>
                        <li>• Alternative Chromium browsers limit required permissions.</li>
                        <li>• Safari and Firefox use incompatible extension models.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <a
                  href="https://www.google.com/chrome/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 self-start rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    isDark ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-300/30 hover:shadow-blue-300/50'
                  }`}
                >
                  Download Chrome
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        )}

        <div className={`grid gap-8 lg:grid-cols-[minmax(0,55%)_minmax(0,45%)]`}>
          <section className={`rounded-[32px] border shadow-2xl backdrop-blur-xl overflow-hidden ${
            isDark ? 'border-white/12 bg-transparent' : 'border-white/70 bg-transparent'
          }`}>
            <div className="h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" /> Current session
                  </div>
                  <div className="font-mono text-7xl font-bold drop-shadow-lg leading-none">{formatTime(timeLeft)}</div>
                  <p className="text-lg font-medium opacity-90">{sessionTypes.find((s) => s.id === sessionType)?.name}</p>
                  <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                    {!isActive ? (
                      <button
                        onClick={startSession}
                        disabled={!isChrome}
                        className={`flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-3 text-sm font-semibold shadow-lg shadow-purple-900/30 transition hover:bg-white/30 hover:shadow-purple-900/40 ${
                          !isChrome ? 'cursor-not-allowed text-white/60' : 'text-white'
                        }`}
                      >
                        <Play className="h-5 w-5" /> Start session
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={pauseSession}
                          className="flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-semibold transition hover:bg-white/25"
                        >
                          <Pause className="h-5 w-5" /> Pause
                        </button>
                        <button
                          onClick={stopSession}
                          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-rose-500/40 transition hover:shadow-rose-500/60"
                        >
                          <Square className="h-5 w-5" /> Stop
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2 lg:justify-start">
                    {sessionTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSessionType(type.id)
                          if (!isActive) {
                            setTimeLeft(type.duration * 60)
                          }
                        }}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          sessionType === type.id ? 'bg-white/30 text-white shadow-sm' : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-4 lg:max-w-sm">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Duration</p>
                    <p className="mt-2 text-lg font-semibold text-white">{sessionTypes.find((s) => s.id === sessionType)?.duration} min</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Progress</p>
                    <p className="mt-2 text-lg font-semibold text-white">{sessionHistory.length} completed</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Focus streak</p>
                    <p className="mt-2 text-lg font-semibold text-white">{sessionHistory.slice(-3).length} today</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">Chrome status</p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white/80">
                      <span className={`h-2 w-2 rounded-full ${extensionInstalled ? 'bg-emerald-300 animate-pulse' : 'bg-rose-300 animate-pulse'}`} />
                      {extensionInstalled ? (extensionActive ? 'Extension active' : 'Extension ready') : 'Extension missing'}
                    </div>
                  </div>
                  <div className="col-span-2 rounded-2xl border border-white/20 bg-black/20 px-4 py-4 text-xs text-white/75">
                    Focus Lock {focusLockEnabled ? 'enabled. We will warn you before you leave this tab.' : 'disabled. Turn it on to keep yourself anchored to this session.'}
                    <button
                      onClick={toggleFocusLock}
                      className={`mt-3 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold transition hover:bg-white/15 ${
                        focusLockEnabled ? 'text-emerald-200' : 'text-white'
                      }`}
                    >
                      {focusLockEnabled ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                      {focusLockEnabled ? 'Disable lock' : 'Enable lock'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`rounded-[28px] border shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-white/6' : 'border-white/70 bg-white'
          }`}>
            <div className="flex flex-col gap-6">
              <div className="rounded-[24px] border border-white/10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Blocked sites</h3>
                      <p className="text-xs text-white/80">Flip a switch to silence distractions.</p>
                    </div>
                  </div>
                  <div className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold text-white/80">
                    {blockedApps.filter((app) => app.blocked).length} blocked
                  </div>
                </div>
                <p className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-white/80">
                  Toggle “Block All Websites” to mute every distracting domain instantly, or curate the list below to keep essentials available.
                </p>
              </div>

              <div className={`rounded-[24px] border p-4 ${
                isDark ? 'border-white/12 bg-white/8' : 'border-slate-200 bg-white'
              }`}>
                <div className="hide-scrollbar -m-1 max-h-[360px] overflow-y-auto p-1">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {blockedApps.map((app, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                          isDark ? 'border-white/10 bg-white/6' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{app.icon}</span>
                          <div>
                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{app.name}</p>
                            <p className={`text-xs font-semibold ${app.blocked ? 'text-rose-400' : 'text-sky-500'}`}>
                              {app.blocked ? 'Blocked' : 'Allowed'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleAppBlock(app.name)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            app.blocked ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-sky-400 to-indigo-500'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                              app.blocked ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className={`rounded-[28px] border px-8 py-8 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/12 bg-white/6' : 'border-white/70 bg-white'
        }`}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Latest sessions</h2>
                <p className={`${isDark ? 'text-white/60' : 'text-slate-600'} text-xs`}>Celebrate wins, keep the momentum.</p>
              </div>
            </div>

            {sessionHistory.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {sessionHistory.slice(-6).reverse().map((session) => (
                  <div
                    key={session.id}
                    className={`rounded-2xl border px-4 py-3 text-sm transition ${
                      isDark ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{session.type} session</p>
                        <p className={`${isDark ? 'text-white/70' : 'text-slate-500'} text-xs`}>{session.duration} minutes · {formatSessionTime(session.startTime)}</p>
                      </div>
                      <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-semibold text-emerald-200">Done</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`rounded-2xl border px-6 py-10 text-center text-sm ${
                isDark ? 'border-white/10 bg-white/6 text-white/60' : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}>
                No focus sessions logged yet—start one and your streak will appear here.
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Focus Reminder Modal */}
      {showFocusReminder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-md w-full rounded-3xl shadow-2xl border overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-white/20' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`}>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl"></div>
            
            <div className="relative p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <AlertTriangle className="w-10 h-10 text-white animate-pulse" />
              </div>
              
              {/* Title */}
              <h2 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Stay Focused! 🎯
              </h2>
              
              {/* Message */}
              <p className={`text-lg mb-6 ${
                isDark ? 'text-white/80' : 'text-gray-600'
              }`}>
                You're in focus mode! You've left this page <span className="font-bold text-orange-500">{pageHiddenCount}</span> time{pageHiddenCount > 1 ? 's' : ''}.
              </p>
              
              {/* Stats */}
              <div className={`p-4 rounded-2xl mb-6 ${
                isDark ? 'bg-white/10 border border-white/20' : 'bg-gray-100 border border-gray-200'
              }`}>
                <div className="text-sm text-gray-500 mb-2">Focus Session Progress</div>
                <div className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {Math.floor((25 * 60 - timeLeft) / 60)}:{(25 * 60 - timeLeft) % 60 < 10 ? '0' : ''}{(25 * 60 - timeLeft) % 60}
                </div>
                <div className="text-sm text-gray-500">of 25:00 completed</div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFocusReminder(false)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    isDark 
                      ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300'
                  }`}
                >
                  Continue Focus
                </button>
                <button
                  onClick={stopSession}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extension Information Modal */}
      {showExtensionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/95 border-white/20'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setShowExtensionModal(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
              }`}
            >
              <Square className="w-5 h-5" />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <AlertTriangle className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Chrome Extension Required
                </h2>
                <p className={`text-base ${
                  isDark ? 'text-white/70' : 'text-gray-600'
                }`}>
                  In Studiply focus mode you can block websites when starting the timer, only if you've downloaded our chrome extension. If you don't know how to download our extension watch the video.
                </p>
              </div>

              {/* Video Tutorial */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  📹 Extension Installation Tutorial
                </h3>
                <div className={`rounded-xl p-6 text-center ${
                  isDark ? 'bg-black/20 border border-white/10' : 'bg-gray-100 border border-gray-200'
                }`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    isDark ? 'bg-red-500/20' : 'bg-red-100'
                  }`}>
                    <Play className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <p className={`text-sm mb-4 ${
                    isDark ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    Watch our step-by-step tutorial to learn how to install and use the Studiply Focus Extension
                  </p>
                  <button
                    onClick={() => {
                      window.open('https://youtu.be/ZzDNIslGPKo', '_blank')
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    🎥 Watch Tutorial
                  </button>
                </div>
              </div>

              {/* Features List */}
              <div className={`p-4 rounded-xl mb-6 ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  🚀 What the Extension Does:
                </h3>
                <ul className={`space-y-2 text-sm ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Blocks distracting websites during focus sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Works automatically when you start a timer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Shows motivational messages when blocked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tracks your productivity and focus time</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowExtensionModal(false)
                    navigate('/extension-download')
                  }}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-300/30 hover:shadow-blue-300/50'
                  }`}
                >
                  📥 Download Extension
                </button>
                <button
                  onClick={() => setShowExtensionModal(false)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FocusMode