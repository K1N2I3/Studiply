import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { SimpleAuthProvider, useSimpleAuth } from './contexts/SimpleAuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import StreakModal from './components/StreakModal'
import { checkAndUpdateStreak } from './services/streakService'
import { checkAndUnlockAchievements } from './services/achievementService'
import { getUserQuestProgress } from './services/cloudQuestService'

// Import pages
import Home from './pages/Home'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import Tutoring from './pages/Tutoring'
import Friends from './pages/Friends'
import Chat from './pages/Chat'
import FocusMode from './pages/FocusMode'
import Profile from './pages/Profile'
import TutorDashboard from './pages/TutorDashboard'
import TestPage from './pages/TestPage'
import Debug from './pages/Debug'
import MinimalTest from './pages/MinimalTest'
import NotificationTest from './pages/NotificationTest'
import FocusModeTest from './pages/FocusModeTest'
import AgoraTest from './pages/AgoraTest'
import Meeting from './pages/Meeting'
import StudentDashboard from './pages/StudentDashboard'
import TutorAccountsAdmin from './pages/TutorAccountsAdmin'
import LearningSession from './pages/LearningSession'
import MacOSLoginHandler from './pages/MacOSLoginHandler'
import MacOSLogin from './pages/MacOSLogin'
import BecomeTutor from './pages/BecomeTutor'
import DesktopAuth from './pages/DesktopAuth'
import ForgotPassword from './pages/ForgotPassword'
import GoldManager from './pages/GoldManager'

// Import components
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const { user } = useSimpleAuth()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const [streakData, setStreakData] = useState(null)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [hasCheckedStreak, setHasCheckedStreak] = useState(false)

  useEffect(() => {
    if (!user && isDark) {
      toggleTheme('light')
    }
  }, [user, isDark, toggleTheme])

  // 检查并更新 streak（仅在用户登录时检查一次，使用 localStorage 持久化）
  useEffect(() => {
    if (user?.id) {
      // 检查 localStorage 中是否今天已经检查过
      const today = new Date().toISOString().split('T')[0]
      const lastCheckKey = `streak_check_${user.id}`
      const lastCheckDate = localStorage.getItem(lastCheckKey)
      
      // 如果今天已经检查过，直接返回，不重复检查
      if (lastCheckDate === today) {
        console.log('Streak already checked today (from localStorage), skipping')
        setHasCheckedStreak(true)
        return
      }
      
      // 如果还没有检查过，执行检查
      if (!hasCheckedStreak) {
        const checkStreak = async () => {
          try {
            const streak = await checkAndUpdateStreak(user.id)
            setStreakData(streak)
            
            // 检查 streak 相关的成就
            const userProgress = await getUserQuestProgress(user.id)
            const progressWithStreak = {
              ...userProgress,
              currentStreak: streak.currentStreak,
              longestStreak: streak.longestStreak
            }
            await checkAndUnlockAchievements(user.id, progressWithStreak)
            
            // 只在当天第一次登录且是新 streak 时显示模态框
            if (streak.shouldShowModal !== false && streak.isNewStreak) {
              setShowStreakModal(true)
            }
            
            // 标记今天已经检查过
            localStorage.setItem(lastCheckKey, today)
            setHasCheckedStreak(true)
          } catch (error) {
            console.error('Error checking streak:', error)
            // 即使出错也标记为已检查，避免重复尝试
            localStorage.setItem(lastCheckKey, today)
            setHasCheckedStreak(true)
          }
        }
        
        // 延迟一点显示，让页面先加载
        const timer = setTimeout(() => {
          checkStreak()
        }, 1000)
        
        return () => clearTimeout(timer)
      }
    }
    
    // 用户登出时重置
    if (!user) {
      setHasCheckedStreak(false)
      setShowStreakModal(false)
      setStreakData(null)
    }
  }, [user?.id, hasCheckedStreak])

  // 检查是否有macOS应用回调参数
  const urlParams = new URLSearchParams(location.search)
  const redirectUri = urlParams.get('redirect_uri')
  const platform = urlParams.get('platform')
  const isMacOSCallback = redirectUri && platform === 'macos'

  // 如果是macOS应用回调，直接显示专门的macOS登录页面
  if (isMacOSCallback) {
    return <MacOSLogin />
  }

  // Desktop Auth 页面 - 不显示任何导航栏，完全独立
  if (location.pathname === '/desktop-auth') {
    return <DesktopAuth />
  }

  // 如果用户已登录，Header会处理整个布局
  if (user) {
    return (
      <>
        <Header />
        <StreakModal
          isOpen={showStreakModal}
          onClose={() => setShowStreakModal(false)}
          streakData={streakData}
        />
      </>
    )
  }

  // 如果用户未登录，显示传统的Header + Routes布局
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/minimal-test" element={<MinimalTest />} />
        <Route path="/notification-test" element={<NotificationTest />} />
        <Route path="/focus-test" element={<FocusModeTest />} />
        <Route path="/agora-test" element={<AgoraTest />} />
        <Route path="/meeting" element={<Meeting />} />
        {/* 受保护的页面，未登录时自动跳转到登录页 */}
        <Route path="/tutoring" element={<ProtectedRoute><Tutoring /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/focus-mode" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/tutor-dashboard" element={<ProtectedRoute><TutorDashboard /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/become-tutor" element={<ProtectedRoute><BecomeTutor /></ProtectedRoute>} />
        <Route path="/desktop-auth" element={<DesktopAuth />} />
        <Route path="/admin/tutor-accounts" element={<ProtectedRoute><TutorAccountsAdmin /></ProtectedRoute>} />
        <Route path="/gold-manager" element={<ProtectedRoute><GoldManager /></ProtectedRoute>} />
        <Route path="/admin/gold-manager" element={<ProtectedRoute><GoldManager /></ProtectedRoute>} />
        <Route path="/macos-login" element={<MacOSLoginHandler />} />
      </Routes>
    </div>
  )
}

function App() {
  useEffect(() => {
    let hideTimeout = null

    const updateVirtualScrollbar = () => {
      const doc = document.documentElement
      const scrollHeight = doc.scrollHeight
      const clientHeight = doc.clientHeight
      const scrollTop = window.pageYOffset || doc.scrollTop || 0
      const trackMargin = 24
      const trackHeight = Math.max(clientHeight - trackMargin * 2, 40)

      document.body.style.setProperty('--virtual-scrollbar-top', `${trackMargin}px`)
      document.body.style.setProperty('--virtual-track-height', `${trackHeight}px`)

      if (scrollHeight <= clientHeight) {
        document.body.classList.remove('show-scrollbar')
        document.body.style.setProperty('--virtual-thumb-height', '0px')
        document.body.style.setProperty('--virtual-thumb-offset', '0px')
        return false
      }

      const scrollable = scrollHeight - clientHeight
      const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 40)
      const maxThumbOffset = trackHeight - thumbHeight
      const thumbOffset = scrollable > 0 ? (scrollTop / scrollable) * maxThumbOffset : 0

      document.body.style.setProperty('--virtual-thumb-height', `${thumbHeight}px`)
      document.body.style.setProperty('--virtual-thumb-offset', `${thumbOffset}px`)
      return true
    }

    const activateScrollbar = () => {
      const hasScrollableContent = updateVirtualScrollbar()
      if (!hasScrollableContent) {
        return
      }
      document.body.classList.add('show-scrollbar')
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
      hideTimeout = setTimeout(() => {
        document.body.classList.remove('show-scrollbar')
      }, 1000)
    }

    const listenerOptions = { passive: true }
    window.addEventListener('wheel', activateScrollbar, listenerOptions)
    window.addEventListener('scroll', activateScrollbar, listenerOptions)
    window.addEventListener('touchmove', activateScrollbar, listenerOptions)
    window.addEventListener('resize', updateVirtualScrollbar, listenerOptions)

    updateVirtualScrollbar()

    return () => {
      window.removeEventListener('wheel', activateScrollbar, listenerOptions)
      window.removeEventListener('scroll', activateScrollbar, listenerOptions)
      window.removeEventListener('touchmove', activateScrollbar, listenerOptions)
      window.removeEventListener('resize', updateVirtualScrollbar, listenerOptions)
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
      document.body.classList.remove('show-scrollbar')
    }
  }, [])

  return (
    <ThemeProvider>
      <NotificationProvider>
        <SimpleAuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <AppContent />
          </Router>
        </SimpleAuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App