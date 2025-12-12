import React, { useEffect, useState } from 'react'
import { subscribeUnreadCount, markAllNotificationsRead } from '../services/notificationService'
import { subscribeUnreadFriendMessagesCount, subscribeUnreadTutorMessagesCount, subscribeUnreadStudentMessagesCount } from '../services/chatService'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Link, useLocation, Routes, Route, useNavigate } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { getUserQuestProgress, LEVEL_CONFIG } from '../services/questService'
import { getUserStreak } from '../services/streakService'
import { getStreakStyle } from '../utils/streakStyles'
import { 
  BookOpen, 
  Users, 
  Target, 
  Trophy, 
  Settings, 
  Bell, 
  User,
  BarChart3,
  MessageCircle,
  Clock,
  CheckCircle,
  Gift,
  Calendar,
  GraduationCap,
  Sword,
  Swords,
  Shield,
  Crown,
  Sparkles,
  X
} from 'lucide-react'
import Avatar from './Avatar'
import NotificationDropdown from './NotificationDropdown'
import FullScreenNotification from './FullScreenNotification'
import ExtensionDownload from '../pages/ExtensionDownload'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import { useTheme } from '../contexts/ThemeContext'

// Import pages for logged-in users
import Homepage from '../pages/Homepage'
import Tutoring from '../pages/Tutoring'
import Friends from '../pages/Friends'
import ChatWithFriend from '../pages/ChatWithFriend'
import ChatWithTutor from '../pages/ChatWithTutor'
import FocusMode from '../pages/FocusMode'
import Rewards from '../pages/Rewards'
import Purchase from '../pages/Purchase'
import Profile from '../pages/Profile'
import TutorDashboard from '../pages/TutorDashboard'
import StudentDashboard from '../pages/StudentDashboard'
import TutorAccountsAdmin from '../pages/TutorAccountsAdmin'
import AdminPanel from '../pages/AdminPanel'
import LearningSession from '../pages/LearningSession'
import QuestAcademy from '../pages/QuestAcademy'
import QuestExecution from '../pages/QuestExecution'
import QuestList from '../pages/QuestList'
import CreateQuest from '../pages/CreateQuest'
import SettingsPage from '../pages/Settings'
import VerifyEmailChange from '../pages/VerifyEmailChange'
import CalendarPage from '../pages/Calendar'
import FocusTestModal from './FocusTestModal'
import useFocusTest from '../hooks/useFocusTest'
import BecomeTutor from '../pages/BecomeTutor'
import DesktopAuth from '../pages/DesktopAuth'
import HomeworkHelper from '../pages/HomeworkHelper'
import RankedMode from '../pages/RankedMode'
import RankedLeaderboard from '../pages/RankedLeaderboard'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, reloadUser } = useSimpleAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const [unread, setUnread] = useState(0)
  const [unreadFriendMessagesCount, setUnreadFriendMessagesCount] = useState(0)
  const [unreadTutorMessagesCount, setUnreadTutorMessagesCount] = useState(0)
  const [unreadStudentMessagesCount, setUnreadStudentMessagesCount] = useState(0)
  const [openNotif, setOpenNotif] = useState(false)
  const hoverCloseTimerRef = React.useRef(null)
  const [showProfileDeletedNotification, setShowProfileDeletedNotification] = useState(false)
  const [userIsTutor, setUserIsTutor] = useState(user?.isTutor || false)
  const [userProgress, setUserProgress] = useState(null)
  const [hasStudiplyPass, setHasStudiplyPass] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(true)
  const [streakData, setStreakData] = useState(null)
  
  // 专注测试功能
  const {
    showFocusTest,
    testSubject,
    handleTestComplete,
    closeFocusTest
  } = useFocusTest()

  const openDropdown = () => {
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current)
      hoverCloseTimerRef.current = null
    }
    setOpenNotif(true)
  }

  const scheduleCloseDropdown = () => {
    if (hoverCloseTimerRef.current) clearTimeout(hoverCloseTimerRef.current)
    // 与下拉动画时长匹配，避免截断动画
    hoverCloseTimerRef.current = setTimeout(() => setOpenNotif(false), 220)
  }

  useEffect(() => {
    let unsub = null
    
    const cleanup = () => {
      if (unsub && typeof unsub === 'function') {
        try {
          unsub()
        } catch (error) {
          console.error('Error cleaning up unread count listener:', error)
        }
      }
    }
    
    if (!user?.id) {
      return cleanup
    }
    
    unsub = subscribeUnreadCount(user?.id, (count) => setUnread(count))
    return cleanup
  }, [user?.id])

  // 订阅来自 Friends 的未读消息数量变化
  useEffect(() => {
    let unsub = null
    
    const cleanup = () => {
      if (unsub && typeof unsub === 'function') {
        try {
          unsub()
        } catch (error) {
          console.error('Error cleaning up unread friend messages count listener:', error)
        }
      }
    }
    
    if (!user?.id) {
      return cleanup
    }
    
    unsub = subscribeUnreadFriendMessagesCount(user.id, (count) => {
      setUnreadFriendMessagesCount(count)
    })
    
    return cleanup
  }, [user?.id])

  // 订阅来自 Tutors 的未读消息数量变化（用于 Student Dashboard）
  useEffect(() => {
    let unsub = null
    
    const cleanup = () => {
      if (unsub && typeof unsub === 'function') {
        try {
          unsub()
        } catch (error) {
          console.error('Error cleaning up unread tutor messages count listener:', error)
        }
      }
    }
    
    if (!user?.id) {
      return cleanup
    }
    
    unsub = subscribeUnreadTutorMessagesCount(user.id, (count) => {
      setUnreadTutorMessagesCount(count)
    })
    
    return cleanup
  }, [user?.id])

  // 订阅来自 Students 的未读消息数量变化（用于 Tutor Dashboard）
  useEffect(() => {
    let unsub = null
    
    const cleanup = () => {
      if (unsub && typeof unsub === 'function') {
        try {
          unsub()
        } catch (error) {
          console.error('Error cleaning up unread student messages count listener:', error)
        }
      }
    }
    
    if (!user?.id || !user?.isTutor) {
      return cleanup
    }
    
    unsub = subscribeUnreadStudentMessagesCount(user.id, (count) => {
      setUnreadStudentMessagesCount(count)
    })
    
    return cleanup
  }, [user?.id, user?.isTutor])

  // 处理macOS应用回调
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const redirectUri = urlParams.get('redirect_uri')
    const platform = urlParams.get('platform')
    
    if (redirectUri && platform === 'macos' && user) {
      // 如果用户已经登录且有macOS应用回调参数，直接处理回调
      const token = 'mock_token_for_macos'
      const callbackUrl = `${redirectUri}?status=success&user_id=${user.id}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&token=${token}&is_tutor=${user.isTutor || false}`
      
      console.log('User already logged in, redirecting to macOS app:', callbackUrl)
      window.location.href = callbackUrl
    }
  }, [user, location])

  // 实时监听用户tutor状态变化
  useEffect(() => {
    let unsubscribe = null
    
    const cleanup = () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          console.log('🔄 Cleaning up user tutor status listener')
          unsubscribe()
        } catch (error) {
          console.error('Error cleaning up user tutor status listener:', error)
        }
      }
    }
    
    if (!user?.id) {
      return cleanup
    }
    
    console.log('🔄 Setting up user tutor status listener for:', user.id, 'Current isTutor:', user.isTutor)
    
    // 监听用户文档的实时变化
    const userRef = doc(db, 'users', user.id)
    unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data()
        const isTutor = userData.isTutor && userData.tutorProfile
        
        // 检查是否有 Studiply Pass
        const hasPass = userData.hasStudiplyPass === true || userData.studiplyPass === true || userData.subscription === 'pro' || userData.subscription === 'legendary'
        setHasStudiplyPass(hasPass)
        
        console.log('👤 User status update:', { 
          isTutor: userData.isTutor, 
          hasProfile: !!userData.tutorProfile,
          currentIsTutor: isTutor,
          previousIsTutor: userIsTutor,
          hasStudiplyPass: hasPass
        })
        
        // 如果用户之前是tutor，现在不是了，显示通知
        if (userIsTutor && !isTutor) {
          console.log('🚨 Tutor profile has been removed!')
          console.log('🚨 Previous isTutor:', userIsTutor, 'Current isTutor:', isTutor)
          setShowProfileDeletedNotification(true)
          // 重新加载用户数据以更新上下文
          if (reloadUser) {
            console.log('🔄 Reloading user data...')
            reloadUser()
          }
        }
        
        setUserIsTutor(isTutor)
      }
    }, (error) => {
      console.error('❌ Error listening to user changes:', error)
      // 如果监听失败，回退到用户当前状态
      setUserIsTutor(user.isTutor)
      setHasStudiplyPass(false)
    })
    
    return cleanup
  }, [user?.id])

  // 监听用户进度数据的实时变化
  useEffect(() => {
    let unsubscribe = null
    
    const cleanup = () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          console.log('🔄 Cleaning up user progress listener')
          unsubscribe()
        } catch (error) {
          console.error('Error cleaning up user progress listener:', error)
        }
      }
    }
    
    if (!user?.id) {
      return cleanup
    }
    
    console.log('🔄 Setting up user progress listener for:', user.id)
    
    // 监听studyprogress集合的实时变化
    const userProgressRef = doc(db, 'studyprogress', user.id)
    unsubscribe = onSnapshot(userProgressRef, (doc) => {
      if (doc.exists()) {
        const progress = doc.data()
        
        // 计算等级进度
        const levelProgress = LEVEL_CONFIG.calculateLevelProgress(progress.totalXP || 0)
        const updatedProgress = {
          ...progress,
          levelProgress: levelProgress
        }
        
        console.log('📊 User progress updated in Header:', updatedProgress)
        setUserProgress(updatedProgress)
      } else {
        // 如果没有数据，创建默认进度
        const defaultProgress = {
          totalXP: 0,
          currentLevel: 1,
          gold: 0,
          completedQuests: [],
          achievements: [],
          levelProgress: LEVEL_CONFIG.calculateLevelProgress(0)
        }
        setUserProgress(defaultProgress)
      }
    }, (error) => {
      console.error('❌ Error listening to user progress:', error)
    })
    
    return cleanup
  }, [user?.id])

  // 获取用户 streak 数据
  useEffect(() => {
    const fetchStreak = async () => {
      if (!user?.id) {
        setStreakData(null)
        return
      }
      
      try {
        const streak = await getUserStreak(user.id)
        setStreakData(streak)
      } catch (error) {
        console.error('Error fetching streak:', error)
        setStreakData(null)
      }
    }
    
    fetchStreak()
  }, [user?.id])

  // 获取导航项目配置
  const getNavigationItems = () => {
    if (user) {
      // 登录用户：显示侧边栏风格的导航
      const items = [
        { name: 'Tutoring', href: '/tutoring', icon: BookOpen },
        { 
          name: 'Student Dashboard', 
          href: '/student-dashboard', 
          icon: BarChart3, 
          unreadCount: unreadTutorMessagesCount > 0 ? unreadTutorMessagesCount : undefined 
        },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
        { name: 'Quest Academy', href: '/quest-academy', icon: Sword },
        { name: 'Ranked Mode', href: '/ranked', icon: Swords },
        { 
          name: 'Friends', 
          href: '/friends', 
          icon: Users, 
          unreadCount: unreadFriendMessagesCount > 0 ? unreadFriendMessagesCount : undefined 
        },
        { name: 'Focus Mode', href: '/focus-mode', icon: Target },
        { name: 'Rewards', href: '/rewards', icon: Gift },
      ]
      
      // 只有成为导师的用户才显示Tutor Dashboard
      if (userIsTutor) {
        items.push({ 
          name: 'Tutor Dashboard', 
          href: '/tutor-dashboard', 
          icon: Settings, 
          unreadCount: unreadStudentMessagesCount > 0 ? unreadStudentMessagesCount : undefined 
        })
      }
      
      // 只有管理员才显示Admin Panel
      if (user?.email === 'studiply.email@gmail.com') {
        items.push({ name: 'Admin Panel', href: '/admin', icon: Shield })
      }
      
      return items
    } else {
      // 未登录用户：显示传统顶部导航
      return [
        { name: 'Home', href: '/', icon: null, unreadCount: 0 },
      ]
    }
  }

  const navigation = getNavigationItems()
  const isActive = (path) => location.pathname === path

  // 如果用户未登录，显示传统顶部导航
  if (!user) {
    return (
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200">STUDIPLY</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-purple-400'
                      : 'text-white/70 hover:text-purple-300'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white/70 hover:text-purple-300 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-purple-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-slate-800/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-purple-400 bg-white/10'
                        : 'text-white/70 hover:text-purple-300 hover:bg-white/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-white/70 hover:text-purple-300 font-medium hover:bg-white/5 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block mx-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        </header>
    )
  }

  // 登录用户显示侧边栏风格导航
  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        {/* 顶部Logo区域 */}
        <div className="p-6 border-b border-slate-700">
          <Link to="/" className="flex items-center space-x-3 group hover:bg-slate-800 rounded-lg p-2 -m-2 transition-colors duration-200">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow duration-200">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold group-hover:text-white transition-colors duration-200">STUDIPLY</h1>
              <p className="text-sm text-slate-400">Learning Platform</p>
            </div>
          </Link>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Start to Study</h2>
            {navigation.map((item) => {
              const Icon = item.icon
              const showBadge = item.unreadCount && item.unreadCount > 0
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {showBadge && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold">
                      {item.unreadCount > 99 ? '99+' : item.unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Tools section */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
              TOOLS
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </h2>
            <Link
              to="/settings"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/settings')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </nav>

        {/* 底部用户区域 */}
        <div className="border-t border-slate-700">
          {/* 升级提示 - 如果没有 Studiply Pass */}
          {!hasStudiplyPass && showUpgradePrompt && (
            <div className="p-3 mx-3 mt-3 mb-2 rounded-xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 border border-purple-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 animate-pulse"></div>
              <div className="relative flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white mb-1">You are using a free account</p>
                  <Link
                    to="/purchase"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={() => setShowUpgradePrompt(false)}
                  >
                    <Crown className="w-3 h-3" />
                    Upgrade to Pro
                  </Link>
                </div>
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="flex-shrink-0 p-1 text-white/60 hover:text-white transition-colors"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 用户信息 */}
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar user={user} size="sm" className="border border-slate-500" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                  {hasStudiplyPass && (
                    <Crown className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" title="Studiply Pass Pro" />
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
                {/* Streak 显示 */}
                {streakData && streakData.currentStreak > 0 && (() => {
                  const streakStyle = getStreakStyle(streakData.currentStreak)
                  return (
                    <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${streakStyle.colors.border} bg-gradient-to-r ${streakStyle.colors.gradient} ${streakStyle.animation}`}>
                      <span className="text-xs">{streakStyle.icon}</span>
                      <span className={`text-xs font-semibold ${streakStyle.colors.text}`}>
                        {streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''} streak
                      </span>
                    </div>
                  )
                })()}
              </div>
              <button
                onClick={async () => {
                  try {
                    await logout()
                  } finally {
                    toggleTheme('light')
                    navigate('/', { replace: true })
                  }
                }}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                   <h2 className="text-2xl font-semibold text-gray-900">
                     {navigation.find(item => isActive(item.href))?.name || 'STUDIPLY'}
                   </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 通知铃铛 */}
              <div className="relative" onMouseEnter={openDropdown} onMouseLeave={scheduleCloseDropdown}>
              <button
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onMouseEnter={openDropdown}
                onClick={() => {
                  openDropdown()
                  user?.id && markAllNotificationsRead(user?.id)
                }}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center leading-none shadow">
                    {unread}
                  </span>
                )}
              </button>
              <NotificationDropdown
                open={openNotif}
                onClose={() => setOpenNotif(false)}
                onMouseEnter={openDropdown}
                onMouseLeave={scheduleCloseDropdown}
              />
              </div>
              
              {/* 用户头像 */}
              <Link to="/profile" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors group">
                <Avatar 
                  user={user} 
                  size="md" 
                  className="border-2 border-white shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200" 
                />
                <span className="font-medium">{user?.name || 'User'}</span>
              </Link>
            </div>
          </div>
        </header>
        
        {/* 页面内容区域 */}
        <main className="flex-1 bg-gray-50 overflow-auto">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tutoring" 
              element={
                <ProtectedRoute>
                  <Tutoring />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/friends" 
              element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/learning-session/:pathId/:unitId/:lessonId/:exerciseId" 
              element={
                <ProtectedRoute>
                  <LearningSession />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/quest-academy" 
              element={
                <ProtectedRoute>
                  <QuestAcademy />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/quest-academy/quests"
              element={
                <ProtectedRoute>
                  <QuestList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-quest"
              element={
                <ProtectedRoute>
                  <CreateQuest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/homework-helper"
              element={
                <ProtectedRoute>
                  <HomeworkHelper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ranked"
              element={
                <ProtectedRoute>
                  <RankedMode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ranked/leaderboard"
              element={
                <ProtectedRoute>
                  <RankedLeaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quest-execution/:subject/:category/:questId"
              element={
                <ProtectedRoute>
                  <QuestExecution />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/chat-tutor/:tutorId" 
              element={
                <ProtectedRoute>
                  <ChatWithTutor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat-friend/:friendId" 
              element={
                <ProtectedRoute>
                  <ChatWithFriend />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/focus-mode" 
              element={
                <ProtectedRoute>
                  <FocusMode />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rewards" 
              element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/purchase" 
              element={
                <ProtectedRoute>
                  <Purchase />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutor-dashboard"
              element={
                <ProtectedRoute>
                  <TutorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tutor-accounts"
              element={
                <AdminRoute>
                  <TutorAccountsAdmin />
                </AdminRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/become-tutor"
              element={
                <ProtectedRoute>
                  <BecomeTutor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/desktop-auth"
              element={<DesktopAuth />}
            />
            <Route
              path="/verify-email-change"
              element={<VerifyEmailChange />}
            />
            <Route 
              path="/extension-download" 
              element={ 
                <ProtectedRoute> 
                  <ExtensionDownload /> 
                </ProtectedRoute> 
              } 
            />
            {/* 默认重定向到Tutoring页面 */}
            <Route path="*" element={
              <ProtectedRoute>
                <Tutoring />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
      
      {/* Full Screen Notification for Profile Deletion */}
      <FullScreenNotification
        isVisible={showProfileDeletedNotification}
        onClose={() => setShowProfileDeletedNotification(false)}
        title="Tutor Profile Removed"
        message="Your tutor profile has been removed by an administrator. You no longer have access to the tutor dashboard."
        type="warning"
      />
      
      {/* Focus Test Modal */}
      <FocusTestModal
        isOpen={showFocusTest}
        onClose={closeFocusTest}
        onComplete={handleTestComplete}
        subject={testSubject}
      />
    </div>
  )
}

export default Header
