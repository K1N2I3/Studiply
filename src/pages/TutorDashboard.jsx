import React, { useState, useEffect } from 'react'
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star,
  User,
  BookOpen,
  Calendar,
  DollarSign,
  AlertCircle,
  Eye,
  Video,
  Play,
  Edit3,
  Settings
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { safeToDate, safeToMillis } from '../utils/timestampUtils'
// Switch to unified sessions service
import { getTutorSessions, acceptSessionRequest, rejectSessionRequest, startSession } from '../services/sessionService'
import { db } from '../firebase/config'
import { collection, query, where, onSnapshot, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { useNotification } from '../contexts/NotificationContext'
import { createMeeting } from '../services/meetingService'
import RealVideoCall from '../components/RealVideoCall'
import Avatar from '../components/Avatar'
import EditTutorProfileModal from '../components/EditTutorProfileModal'
import { listenToChatList, formatMessageTime, subscribeUnreadStudentMessagesCount, getUnreadStudentsList } from '../services/chatService'
import { useNavigate, useLocation } from 'react-router-dom'
import TutorWallet from '../components/TutorWallet'
import BankAccountSetup from '../components/BankAccountSetup'

const TutorDashboard = () => {
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('requests')
  const [chatList, setChatList] = useState([])
  const [chatListLoading, setChatListLoading] = useState(false)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [unreadStudents, setUnreadStudents] = useState([]) // 存储有未读消息的 student 列表
  const [showChatList, setShowChatList] = useState(false)
  
  // Reset pagination when switching tabs
  const handleTabChange = (tabId) => {
    setSelectedTab(tabId)
    if (tabId !== 'completed') {
      setCompletedPage(1)
    }
  }
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [videoCallSession, setVideoCallSession] = useState(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [completedPage, setCompletedPage] = useState(1)
  const sessionsPerPage = 4

  // 检查用户是否还是tutor
  useEffect(() => {
    let unsub = null
    
    // 总是先定义清理函数
    const cleanup = () => {
      if (unsub && typeof unsub === 'function') {
        try {
          unsub()
        } catch (error) {
          console.error('Error cleaning up sessions listener:', error)
        }
      }
    }
    
    if (!user?.id) {
      return cleanup
    }
    
    if (!user.isTutor) {
      showError('Your tutor profile has been removed. You no longer have access to the tutor dashboard.', 'Access Revoked')
      return cleanup
    }
    
    setLoading(true)
    
    const col = collection(db, 'sessions')
    const q = query(col, where('tutorId', '==', user?.id))
    unsub = onSnapshot(q, async (snap) => {
      const list = []
      for (const d of snap.docs) {
        const data = d.data()
        let student = { id: data.studentId, name: 'Unknown', email: '', avatar: null }
        try {
          const sDoc = await getDoc(doc(db, 'users', data.studentId))
          if (sDoc.exists()) {
            const sd = sDoc.data()
            student = { id: data.studentId, name: sd.name || 'Unknown', email: sd.email || '', avatar: sd.avatar || null }
          }
        } catch (e) {}
        list.push({ id: d.id, ...data, student })
      }
      list.sort((a, b) => {
        const ta = safeToMillis(a.createdAt)
        const tb = safeToMillis(b.createdAt)
        return tb - ta
      })
      setSessions(list)
      setLoading(false)
    })
    
    return cleanup
  }, [user?.id, user?.isTutor])

  // 实时监听来自 Students 的未读消息
  useEffect(() => {
    if (!user?.id || !user?.isTutor) return
    
    // 使用实时监听来更新未读消息计数
    const unsubscribe = subscribeUnreadStudentMessagesCount(user.id, async (count) => {
      setUnreadMessageCount(count)
      
      // 如果有未读消息，获取 student 列表
      if (count > 0) {
        try {
          const result = await getUnreadStudentsList(user.id)
          if (result.success && result.studentIds.length > 0) {
            // 获取每个 student 的信息
            const studentPromises = result.studentIds.map(async (studentId) => {
              try {
                const studentDoc = await getDoc(doc(db, 'users', studentId))
                if (studentDoc.exists()) {
                  return { id: studentId, name: studentDoc.data().name || 'Student' }
                }
              } catch (error) {
                console.error('Error getting student info:', error)
              }
              return null
            })
            
            const students = (await Promise.all(studentPromises)).filter(Boolean)
            setUnreadStudents(students)
          } else {
            setUnreadStudents([])
          }
        } catch (error) {
          console.error('Error getting unread students list:', error)
        }
      } else {
        setUnreadStudents([])
      }
    })
    
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user?.id, user?.isTutor])

  const loadSessions = async () => {
    try {
      setLoading(true)
      console.log('Loading sessions for tutor:', user?.id)
      const result = await getTutorSessions(user?.id)
      console.log('Sessions result:', result)
      if (result.success) {
        setSessions(result.sessions)
        console.log('Loaded sessions:', result.sessions.length)
      } else {
        console.error('Failed to load sessions:', result.error)
        showError(`Failed to load tutoring sessions: ${result.error}`, 5000, 'Error')
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
      showError(`Error loading tutoring sessions: ${error.message}`, 5000, 'Error')
    } finally {
      setLoading(false)
    }
  }


  const handleAcceptSession = async (sessionId) => {
    try {
      const result = await acceptSessionRequest(sessionId, user?.id)
      if (result.success) {
        showSuccess('Session accepted successfully!', 4000, 'Success')
        loadSessions() // 重新加载数据
      } else if (result.needsBankSetup) {
        // 需要设置银行卡
        showError('Please set up your bank account first to accept sessions. Scroll down to "Bank Account Setup".', 8000, 'Bank Account Required')
      } else {
        showError(`Failed to accept session: ${result.error}`, 5000, 'Error')
      }
    } catch (error) {
      showError('Failed to accept session', 5000, 'Error')
      console.error('Error accepting session:', error)
    }
  }

  const handleDeclineSession = async (sessionId) => {
    try {
      const result = await rejectSessionRequest(sessionId)
      if (result.success) {
        showSuccess('Session declined', 4000, 'Success')
        loadSessions() // 重新加载数据
      } else {
        showError(`Failed to decline session: ${result.error}`, 5000, 'Error')
      }
    } catch (error) {
      showError('Failed to decline session', 5000, 'Error')
      console.error('Error declining session:', error)
    }
  }

  const startVideoCall = async (session) => {
    try {
      console.log('🚀 Tutor 开始创建会议...')
      console.log('📊 会话信息:', {
        sessionId: session.id,
        sessionStatus: session.status,
        tutorId: user?.id,
        studentId: session.student?.id
      })
      
      const sessionData = {
        id: session.id,
        subject: session.subject || 'Tutoring Session',
        type: 'tutoring',
        tutor: user,
        student: session.student
      }
      
      // 创建会议
      const result = await createMeeting(sessionData, user)
      
      if (result.success) {
        console.log('✅ 会议创建成功，代码:', result.meetingCode)
        console.log('📝 会议数据:', result.meetingData)
        
        // 更新会话状态为 active 并保存会议代码
        console.log('🔄 更新会话状态并保存会议代码...')
        
        // 直接使用 Firestore 更新，确保会议代码被保存
        try {
          const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
          const { db } = await import('../firebase/config')
          
          const sessionRef = doc(db, 'sessions', session.id)
          await updateDoc(sessionRef, {
            status: 'active',
            meetingCode: result.meetingCode,
            startedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          
          console.log('✅ 直接更新会话成功，会议代码已保存:', result.meetingCode)
        } catch (directUpdateError) {
          console.error('❌ 直接更新会话失败:', directUpdateError)
        }
        
        // 也尝试使用 startSession 函数（作为备用）
        const sessionResult = await startSession(session.id, { meetingCode: result.meetingCode })
        
        console.log('📊 会话更新结果:', sessionResult)
        
        // 将会议代码保存到会话数据中
        if (sessionResult.success) {
          console.log('✅ 会话更新成功，会议代码已保存')
          
          // 发送通知给学生
          try {
            const { createNotification } = await import('../services/notificationService')
            await createNotification(
              session.student.id,
              'success',
              'Meeting Created',
              `The tutor has created a meeting, code: ${result.meetingCode}`,
              { 
                sessionId: session.id, 
                role: 'student', 
                status: 'active', 
                fromName: user.name, 
                subject: session.subject,
                meetingCode: result.meetingCode
              }
            )
            console.log('✅ 已发送会议创建通知给学生')
          } catch (notifError) {
            console.error('❌ 发送通知失败:', notifError)
          }
          
          // 更新本地会话数据，添加会议代码
          setSessions(prev => prev.map(s => 
            s.id === session.id 
              ? { ...s, status: 'active', meetingCode: result.meetingCode }
              : s
          ))
        } else {
          console.error('❌ 会话更新失败:', sessionResult.error)
        }
        
        // 设置会议数据
        setVideoCallSession({
          ...sessionData,
          meetingCode: result.meetingCode,
          meetingData: result.meetingData
        })
        setShowVideoCall(true)
        
        showSuccess(`Meeting created! Code: ${result.meetingCode}`, 5000, 'Success')
      } else {
        console.error('❌ 创建会议失败:', result.error)
        showError(`Failed to create meeting: ${result.error}`, 5000, 'Error')
      }
    } catch (error) {
      console.error('❌ 创建会议异常:', error)
      showError('An error occurred while creating the meeting', 5000, 'Error')
    }
  }


  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />
      case 'active':
        return <Play className="w-4 h-4" />
      case 'completed':
        return <Star className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatTime = (value) => {
    if (!value) return 'Flexible'
    try {
      const d = safeToDate(value)
      if (isNaN(d.getTime())) return 'Flexible'
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
    } catch (error) {
      console.error('Error formatting time:', error)
      return 'Flexible'
    }
  }


  const formatDuration = (duration) => {
    const mins = Number.isFinite(duration) ? duration : 60
    return `${mins} min`
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'
    try {
      const date = safeToDate(timestamp)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Unknown'
    }
  }

  // 加载聊天列表
  useEffect(() => {
    let unsubscribe = null
    
    // 总是先定义清理函数
    const cleanup = () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          unsubscribe()
        } catch (error) {
          console.error('Error cleaning up chat list listener:', error)
        }
      }
    }
    
    if (!user?.id || selectedTab !== 'chat') {
      setChatList([])
      setChatListLoading(false)
      return cleanup
    }
    
    setChatListLoading(true)
    unsubscribe = listenToChatList(user.id, async (result) => {
      if (result.success) {
        // 获取每个聊天对象的用户信息
        const chatListWithUsers = await Promise.all(
          result.chatList.map(async (chat) => {
            try {
              const userDoc = await getDoc(doc(db, 'users', chat.userId))
              if (userDoc.exists()) {
                const userData = userDoc.data()
                return {
                  ...chat,
                  user: {
                    id: chat.userId,
                    name: userData.name || 'Unknown',
                    email: userData.email || '',
                    avatar: userData.avatar || null
                  }
                }
              }
              return {
                ...chat,
                user: {
                  id: chat.userId,
                  name: 'Unknown',
                  email: '',
                  avatar: null
                }
              }
            } catch (error) {
              console.error('Error getting user info:', error)
              return {
                ...chat,
                user: {
                  id: chat.userId,
                  name: 'Unknown',
                  email: '',
                  avatar: null
                }
              }
            }
          })
        )
        setChatList(chatListWithUsers)
      }
      setChatListLoading(false)
    }, 'tutor') // 传递 chatType: 'tutor'
    
    return cleanup
  }, [user?.id, selectedTab])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-gray-600 text-sm">Loading your tutoring sessions...</p>
        </div>
      </div>
    )
  }

  const pendingRequests = sessions.filter(s => s.status === 'pending')
  const acceptedSessions = sessions.filter(s => s.status === 'accepted' || s.status === 'active')
  const activeSessions = sessions.filter(s => s.status === 'active')
  const completedSessions = sessions.filter(s => s.status === 'completed')
  
  // Pagination logic for completed sessions
  const totalCompletedPages = Math.ceil(completedSessions.length / sessionsPerPage)
  const startIndex = (completedPage - 1) * sessionsPerPage
  const endIndex = startIndex + sessionsPerPage
  const paginatedCompletedSessions = completedSessions.slice(startIndex, endIndex)

  const summaryCards = [
    {
      id: 'pending',
      title: 'Pending requests',
      value: pendingRequests.length,
      description: 'Awaiting your response',
      iconGradient: 'from-yellow-400 via-orange-400 to-pink-500',
      accent: 'text-yellow-300',
      icon: Clock
    },
    {
      id: 'accepted',
      title: 'Accepted / active',
      value: acceptedSessions.length,
      description: 'Ready to host',
      iconGradient: 'from-emerald-400 via-teal-400 to-emerald-600',
      accent: 'text-emerald-200',
      icon: CheckCircle
    },
    {
      id: 'live',
      title: 'Live now',
      value: activeSessions.length,
      description: 'Sessions in progress',
      iconGradient: 'from-blue-400 via-indigo-400 to-purple-500',
      accent: 'text-blue-200',
      icon: Play
    },
    {
      id: 'rating',
      title: 'Rating',
      value: user?.rating ? Number(user.rating).toFixed(1) : 'N/A',
      description: 'Student feedback score',
      iconGradient: 'from-purple-400 via-pink-400 to-rose-500',
      accent: 'text-purple-200',
      icon: Star
    }
  ]

  const tabs = [
    { id: 'requests', name: 'Pending Requests', count: pendingRequests.length },
    { id: 'accepted', name: 'Accepted Sessions', count: acceptedSessions.length },
    { id: 'completed', name: 'Completed Sessions', count: completedSessions.length },
    { id: 'chat', name: 'Chat', count: chatList.length }
  ]

  const renderSessionCard = (session) => (
    <div key={session.id} className={`group backdrop-blur-sm rounded-2xl shadow-lg border p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden relative ${
      isDark 
        ? 'bg-white/10 border-white/20' 
        : 'bg-white/80 border-white/20'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full translate-y-8 -translate-x-8"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Avatar 
              user={session.student} 
              size="xl" 
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <div>
              <h3 className={`font-bold text-lg ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {session.student?.name || 'Unknown Student'}
              </h3>
              <p className={`${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>{session.student?.email || 'No email'}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium shadow-lg ${
            session.status === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200' :
            session.status === 'accepted' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
            session.status === 'active' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200' :
            session.status === 'completed' ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200' :
            'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
          }`}>
            {getStatusIcon(session.status)}
            <span className="capitalize font-bold">{session.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`rounded-xl p-4 border ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100'
          }`}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Subject</span>
            </div>
            <span className={`font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{session.subject}</span>
          </div>
          
          <div className={`rounded-xl p-4 border ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'
          }`}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Time</span>
            </div>
            <span className={`font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{formatTime(session.preferredTime)}</span>
          </div>
          
          
          <div className={`rounded-xl p-4 border ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100'
          }`}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Duration</span>
            </div>
            <span className={`font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{formatDuration(session.duration)}</span>
          </div>
        </div>

        {session.description && (
          <div className={`mb-6 rounded-xl p-4 border ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-100'
          }`}>
            <p className={`${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <span className={`font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Request:</span> {session.description}
            </p>
          </div>
        )}

        <div className={`text-sm mb-6 font-medium ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Requested on: {formatDate(session.createdAt)}
        </div>

        {session.status === 'pending' && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleAcceptSession(session.id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center font-bold shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Accept
            </button>
            <button
              onClick={() => handleDeclineSession(session.id)}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center font-bold shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Decline
            </button>
            <button className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 transform">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        )}

        {(session.status === 'accepted' || session.status === 'active') && (
          <div className="flex space-x-3">
            <button 
              onClick={() => startVideoCall(session)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center font-bold shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <Video className="w-5 h-5 mr-2" />
              {session.status === 'active' ? 'Join Meeting' : 'Create Meeting'}
            </button>
            <button className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 transform">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        )}

        {session.status === 'completed' && (
          <div className="flex space-x-3">
            <button className="flex-1 py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center font-bold shadow-lg hover:shadow-xl hover:scale-105 transform bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              Session Completed
            </button>
            <button className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 transform">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
            <div className="absolute top-1/3 right-10 h-72 w-72 rounded-full bg-pink-500/20 blur-[140px]" />
            <div className="absolute bottom-12 left-6 h-64 w-64 rounded-full bg-indigo-400/25 blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-blue-500/20 blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-purple-300/40 blur-3xl" />
            <div className="absolute top-1/2 right-0 h-60 w-60 rounded-full bg-pink-300/35 blur-[140px]" />
            <div className="absolute bottom-12 left-10 h-56 w-56 rounded-full bg-blue-300/35 blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 h-36 w-36 rounded-full bg-indigo-300/30 blur-[120px]" />
          </>
        )}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <section className={`mb-12 rounded-[32px] border shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
        }`}>
          <div className="flex flex-col gap-8 px-8 py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/15 to-purple-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-400">
                <Star className="h-4 w-4" /> Tutor Control Center
              </div>
              <h1 className={`mt-4 text-4xl font-black tracking-tight lg:text-5xl ${
                isDark
                  ? 'bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
              }`}>
                Manage sessions, meet students, grow impact
              </h1>
              <p className={`mt-4 max-w-2xl text-base lg:text-lg ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                Keep track of upcoming lessons, respond to new requests, and launch meetings instantly from one streamlined hub.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${
                    isDark
                      ? 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  <Edit3 className="h-5 w-5" />
                  Edit tutor profile
                </button>
                <button
                  onClick={() => setSelectedTab('accepted')}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Video className="h-5 w-5" />
                  Jump to sessions
                </button>
              </div>
            </div>

            <div className="grid w-full max-w-xl grid-cols-2 gap-4">
              <div className={`rounded-2xl border px-4 py-5 text-left ${
                isDark ? 'border-white/10 bg-white/8 text-white' : 'border-blue-100 bg-blue-50 text-blue-600'
              }`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Pending requests</p>
                <p className="mt-2 text-3xl font-bold">{pendingRequests.length}</p>
                <p className="text-xs opacity-70">Awaiting your response</p>
              </div>
              <div className={`rounded-2xl border px-4 py-5 text-left ${
                isDark ? 'border-white/10 bg-white/8 text-white' : 'border-emerald-100 bg-emerald-50 text-emerald-600'
              }`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Accepted / Active</p>
                <p className="mt-2 text-3xl font-bold">{acceptedSessions.length}</p>
                <p className="text-xs opacity-70">Ready to host</p>
              </div>
              <div className={`rounded-2xl border px-4 py-5 text-left ${
                isDark ? 'border-white/10 bg-white/8 text-white' : 'border-purple-100 bg-purple-50 text-purple-600'
              }`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Active now</p>
                <p className="mt-2 text-3xl font-bold">{activeSessions.length}</p>
                <p className="text-xs opacity-70">Live lessons in progress</p>
              </div>
              <div className={`rounded-2xl border px-4 py-5 text-left ${
                isDark ? 'border-white/10 bg-white/8 text-white' : 'border-amber-100 bg-amber-50 text-amber-600'
              }`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Completed</p>
                <p className="mt-2 text-3xl font-bold">{completedSessions.length}</p>
                <p className="text-xs opacity-70">Great work so far</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tutor Wallet & Bank Setup */}
        <div className="mb-12 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <TutorWallet tutorId={user?.id} />
            <BankAccountSetup />
          </div>
          <div className={`lg:col-span-2 rounded-[28px] border p-6 backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Quick Stats
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-xl p-4 ${
                isDark ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10' : 'bg-gradient-to-br from-blue-50 to-cyan-50'
              }`}>
                <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Total Sessions</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {sessions.length}
                </p>
              </div>
              <div className={`rounded-xl p-4 ${
                isDark ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/10' : 'bg-gradient-to-br from-purple-50 to-pink-50'
              }`}>
                <p className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Completion Rate</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {sessions.length > 0 
                    ? Math.round((completedSessions.length / sessions.length) * 100)
                    : 0}%
                </p>
              </div>
              <div className={`rounded-xl p-4 ${
                isDark ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
              }`}>
                <p className={`text-sm font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>Response Rate</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {pendingRequests.length + acceptedSessions.length + completedSessions.length > 0
                    ? Math.round(((acceptedSessions.length + completedSessions.length) / 
                        (pendingRequests.length + acceptedSessions.length + completedSessions.length)) * 100)
                    : 100}%
                </p>
              </div>
              <div className={`rounded-xl p-4 ${
                isDark ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10' : 'bg-gradient-to-br from-amber-50 to-orange-50'
              }`}>
                <p className={`text-sm font-medium ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>Active Now</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeSessions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Unread messages notification */}
        {unreadMessageCount > 0 && (
          <div className={`mb-8 rounded-2xl border px-6 py-4 shadow-lg backdrop-blur-xl ${
            isDark 
              ? 'border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
              : 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className={`h-5 w-5 ${
                  isDark ? 'text-purple-300' : 'text-purple-600'
                }`} />
                <div>
                  <p className={`font-semibold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    You have {unreadMessageCount} unread message{unreadMessageCount > 1 ? 's' : ''} from {unreadStudents.length > 0 ? unreadStudents.map(s => s.name).join(', ') : 'students'}
                  </p>
                  <p className={`text-sm mt-0.5 ${
                    isDark ? 'text-white/70' : 'text-slate-600'
                  }`}>
                    {unreadStudents.length > 0 ? (
                      <>
                        <span className="font-medium">From Student Chat:</span> {unreadStudents.length === 1 
                          ? `Message from ${unreadStudents[0].name}`
                          : `Messages from ${unreadStudents.map(s => s.name).join(', ')}`}
                        <br />
                        <span className="text-xs opacity-75">Click "Chat" tab or "View Messages" to open Tutor Chat and view your messages</span>
                      </>
                    ) : (
                      'Click "Chat" tab to view your messages from students'
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedTab('chat')
                  setShowChatList(true)
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                View Messages
              </button>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            const accentClass = isDark ? card.accent : 'text-slate-900'
            return (
              <div
                key={card.id}
                className={`rounded-[28px] border backdrop-blur-xl p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.iconGradient} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/60' : 'text-slate-400'}`}>
                    {card.description}
                  </span>
                </div>
                <h3 className={`mt-6 text-sm font-semibold ${isDark ? 'text-white/80' : 'text-slate-500'}`}>{card.title}</h3>
                <p className={`mt-2 text-3xl font-bold ${accentClass}`}>{card.value}</p>
              </div>
            )
          })}
        </div>

        {/* Epic Tabs */}
        <div className={`relative backdrop-blur-sm rounded-2xl shadow-lg border p-2 mb-8 ${
          isDark 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-white/20'
        }`}>
          <div className={`absolute inset-0 rounded-2xl blur-lg transition-all duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
              : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
          }`}></div>
          <nav className="relative flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-4 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center space-x-2 ${
                  selectedTab === tab.id
                    ? isDark
                      ? 'bg-white/20 text-white shadow-lg scale-105 border border-white/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                    : isDark
                      ? 'text-gray-300 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedTab === tab.id 
                      ? isDark
                        ? 'bg-white/30 text-white' 
                        : 'bg-white/20 text-white'
                      : isDark
                        ? 'bg-white/20 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {selectedTab === 'requests' && (
            <>
              <h2 className={`text-2xl font-bold ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              }`}>Pending Requests</h2>
              {pendingRequests.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingRequests.map(renderSessionCard)}
                </div>
              ) : (
                <div className={`rounded-3xl p-12 border text-center ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100'
                }`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>No pending requests</h3>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>You'll see tutoring requests from students here when they come in.</p>
                </div>
              )}
            </>
          )}

          {selectedTab === 'accepted' && (
            <>
              <h2 className={`text-2xl font-bold ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              }`}>Accepted Sessions</h2>
              {acceptedSessions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {acceptedSessions.map(renderSessionCard)}
                </div>
              ) : (
                <div className={`rounded-3xl p-12 border text-center ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
                }`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>No accepted sessions</h3>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Accepted tutoring sessions will appear here.</p>
                </div>
              )}
            </>
          )}

          {selectedTab === 'chat' && (
            <>
              <h2 className={`text-2xl font-bold ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
              }`}>Messages from Students</h2>
              {chatListLoading ? (
                <div className={`rounded-3xl p-12 border text-center ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100'
                }`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Loading messages...</p>
                </div>
              ) : chatList.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {chatList.map((chat) => (
                    <div
                      key={chat.userId}
                      onClick={() => navigate(`/chat-tutor/${chat.userId}`, { state: { from: 'tutor-dashboard' } })}
                      className={`group rounded-2xl border p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] ${
                        isDark 
                          ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar user={chat.user} size="lg" className="shadow-lg" />
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-semibold mb-1 ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {chat.user?.name || 'Unknown Student'}
                          </h3>
                          <p className={`text-sm truncate ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {chat.latestMessage || 'No messages yet'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {chat.latestMessageTime ? formatMessageTime(chat.latestMessageTime) : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`rounded-3xl p-12 border text-center ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100'
                }`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>No messages yet</h3>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Students can start chatting with you from the tutoring page.</p>
                </div>
              )}
            </>
          )}

          {selectedTab === 'completed' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                }`}>Completed Sessions</h2>
                {completedSessions.length > 0 && (
                  <div className={`px-4 py-2 rounded-lg ${
                    isDark 
                      ? 'bg-white/10 border border-white/20' 
                      : 'bg-gray-100 border border-gray-200'
                  }`}>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Page {completedPage} of {totalCompletedPages} ({completedSessions.length} total)
                    </span>
                  </div>
                )}
              </div>
              
              {completedSessions.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {paginatedCompletedSessions.map(renderSessionCard)}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalCompletedPages > 1 && (
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={() => setCompletedPage(Math.max(1, completedPage - 1))}
                        disabled={completedPage === 1}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          completedPage === 1
                            ? isDark
                              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isDark
                              ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        Previous
                      </button>
                      
                      <div className="flex space-x-2">
                        {Array.from({ length: totalCompletedPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCompletedPage(page)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                              page === completedPage
                                ? isDark
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                : isDark
                                  ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setCompletedPage(Math.min(totalCompletedPages, completedPage + 1))}
                        disabled={completedPage === totalCompletedPages}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          completedPage === totalCompletedPages
                            ? isDark
                              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isDark
                              ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={`rounded-3xl p-12 border text-center ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100'
                }`}>
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>No completed sessions</h3>
                  <p className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Completed tutoring sessions will appear here.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Video Call Modal */}
        {showVideoCall && videoCallSession && (
          <RealVideoCall
            isOpen={showVideoCall}
            onClose={() => {
              setShowVideoCall(false)
              setVideoCallSession(null)
            }}
            sessionData={videoCallSession}
            user={user}
          />
        )}

        {/* Edit Profile Modal */}
        <EditTutorProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          currentProfile={user?.tutorProfile}
        />
        

      </div>
    </div>
  )
}

export default TutorDashboard
