import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Star, 
  Clock, 
  User, 
  Users,
  Calendar,
  MessageCircle,
  Video,
  CheckCircle,
  AlertCircle,
  X,
  TrendingUp,
  BookOpen,
  Award,
  Target,
  Timer
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Avatar from '../components/Avatar'
import RealVideoCall from '../components/RealVideoCall'
import SubmitReviewModal from '../components/SubmitReviewModal'
import { safeToMillis } from '../utils/timestampUtils'
import { 
  getStudentSessions, 
  startSession, 
  rateTutor 
} from '../services/sessionService'
import { db } from '../firebase/config'
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { joinMeeting } from '../services/meetingService'
import { useNotification } from '../contexts/NotificationContext'

const StudentDashboard = () => {
  const { user } = useSimpleAuth()
  const { theme, isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [videoCallSession, setVideoCallSession] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'completed', 'pending'
  const [showRatings, setShowRatings] = useState(false) // Show all given ratings

  useEffect(() => {
    if (!user?.id) return
    let unsub
    const run = async () => {
      const col = collection(db, 'sessions')
      const q = query(col, where('studentId', '==', user?.id))
      unsub = onSnapshot(q, async (snap) => {
        const list = []
        for (const d of snap.docs) {
          const data = d.data()
          let tutor = { id: data.tutorId, name: 'Unknown', email: '', avatar: null }
          try {
            const tDoc = await getDoc(doc(db, 'users', data.tutorId))
            if (tDoc.exists()) {
              const td = tDoc.data()
              tutor = { id: data.tutorId, name: td.name || 'Unknown', email: td.email || '', avatar: td.avatar || null }
            }
          } catch (e) {}
          
          // Debug info: Print session data
          console.log('📊 Student received session update:', {
            sessionId: d.id,
            status: data.status,
            meetingCode: data.meetingCode,
            tutorId: data.tutorId,
            studentId: data.studentId,
            allData: data // Print all data for debugging
          })
          
          // Check button display conditions
          const shouldShowButton = (data.status === 'accepted' || data.status === 'active')
          console.log('🔘 Button display check:', {
            sessionId: d.id,
            status: data.status,
            shouldShowButton: shouldShowButton,
            buttonText: data.status === 'active' ? 'Join Meeting' : 'Waiting for Meeting'
          })
          
          list.push({ id: d.id, ...data, tutor })
        }
        // Sort locally by creation time in descending order (if exists)
        list.sort((a, b) => {
          const ta = safeToMillis(a.createdAt)
          const tb = safeToMillis(b.createdAt)
          return tb - ta
        })
        setSessions(list)
        setLoading(false)
      })
    }
    setLoading(true)
    run()
    return () => unsub && unsub()
  }, [user?.id])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const result = await getStudentSessions(user?.id)
      if (result.success) {
        setSessions(result.sessions)
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartSession = async (sessionId) => {
    try {
      let session = sessions.find(s => s.id === sessionId)
      if (!session) return

      console.log('🎯 Student clicked join meeting:', {
        sessionId: sessionId,
        sessionStatus: session.status,
        meetingCode: session.meetingCode,
        sessionData: session
      })
      
      // Add more debug info
      console.log('🔍 Current user info:', user)
      console.log('🔍 Current session list:', sessions)

      // If session status is accepted, need to start session first
      if (session.status === 'accepted') {
        console.log('📞 Session status is accepted, trying to start session...')
        const result = await startSession(sessionId)
        if (result.success) {
          console.log('✅ Session started successfully')
          // Update session status
          setSessions(prev => prev.map(s => 
            s.id === sessionId 
              ? { ...s, status: 'active' }
              : s
          ))
        } else {
          console.error('❌ Session start failed:', result.error)
        }
      }
      
      // Check if there's a meeting code (get from session or generate)
      let meetingCode = session.meetingCode
      console.log('🔍 Check meeting code:', meetingCode)
      
      // If no meeting code locally, try to fetch from server again
      if (!meetingCode) {
        console.log('🔄 No meeting code locally, trying to fetch from server...')
        try {
          const { doc, getDoc } = await import('firebase/firestore')
          const { db } = await import('../firebase/config')
          
          const sessionRef = doc(db, 'sessions', sessionId)
          const sessionSnap = await getDoc(sessionRef)
          
          if (sessionSnap.exists()) {
            const serverData = sessionSnap.data()
            meetingCode = serverData.meetingCode
            
            console.log('📡 Session data fetched from server:', {
              status: serverData.status,
              meetingCode: serverData.meetingCode,
              allData: serverData
            })
            
            // Update local session data
            if (meetingCode) {
              setSessions(prev => prev.map(s => 
                s.id === sessionId 
                  ? { ...s, meetingCode: meetingCode, status: serverData.status }
                  : s
              ))
              session = { ...session, meetingCode: meetingCode }
            }
          }
        } catch (serverError) {
          console.error('❌ Failed to fetch session data from server:', serverError)
        }
      }
      
      if (!meetingCode) {
        // If no meeting code, prompt student to wait for tutor to create meeting
        console.log('⚠️ No meeting code, prompting student to wait for tutor to create meeting')
        showError('Please wait for tutor to create meeting')
        return
      }

      // 额外检查：确保会议确实存在且是由老师创建的
      console.log('🔍 验证会议权限:', {
        meetingCode: meetingCode,
        sessionStatus: session.status,
        tutorId: session.tutor?.id,
        studentId: session.student?.id
      })

      // 检查会话状态，只有 active 状态才允许学生加入
      if (session.status !== 'active') {
        console.log('⚠️ 会话状态不是 active，不允许学生加入')
        showError('Please wait for the tutor to create the meeting')
        return
      }

      // 加入会议
      console.log('🚀 准备加入会议:', {
        meetingCode: meetingCode,
        user: user,
        sessionId: sessionId
      })
      
      const joinResult = await joinMeeting(meetingCode, user)
      
      console.log('📊 加入会议结果:', joinResult)
      console.log('🔍 会议代码来源检查:', {
        meetingCode: meetingCode,
        sessionStatus: session.status,
        sessionData: session,
        isFromServer: '从服务器获取',
        isFromLocal: '从本地获取'
      })
      
      if (joinResult.success) {
        console.log('✅ 学生加入会议成功:', meetingCode)
        
        // 设置会议数据
        setVideoCallSession({
          ...session,
          meetingCode: meetingCode,
          meetingData: joinResult.meetingData,
          student: user,
          tutor: session.tutor
        })
        setShowVideoCall(true)
        
        showSuccess(`Joined meeting! Code: ${meetingCode}`)
      } else {
        console.error('❌ 加入会议失败:', joinResult.error)
        showError(`Failed to join meeting: ${joinResult.error}`)
      }
      
      console.log('Session started:', sessionId)
    } catch (error) {
      console.error('Error starting session:', error)
    }
  }

  const handleRateTutor = async (sessionId) => {
    setSelectedSession(sessions.find(s => s.id === sessionId))
    setShowRatingModal(true)
  }

  const handleCloseVideoCall = () => {
    setShowVideoCall(false)
    setVideoCallSession(null)
  }

  // Filter sessions based on selected status
  const getFilteredSessions = () => {
    switch (filterStatus) {
      case 'completed':
        return sessions.filter(s => s.status === 'completed')
      case 'pending':
        return sessions.filter(s => s.status === 'pending')
      default:
        return sessions
    }
  }

  // Handle stat card clicks
  const handleStatClick = (status) => {
    setFilterStatus(status)
    // Close ratings display when clicking other cards
    if (status !== 'ratings') {
      setShowRatings(false)
    }
  }

  // Format date helper function
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date'
    const date = new Date(safeToMillis(timestamp))
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (seconds) => {
    if (seconds === undefined || seconds === null) return null
    const safeSeconds = Math.max(0, Math.floor(seconds))
    const hours = Math.floor(safeSeconds / 3600)
    const minutes = Math.floor((safeSeconds % 3600) / 60)
    const remainingSeconds = safeSeconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getSessionDurationLabel = (session) => {
    if (!session) return null
    if (session.callDurationFormatted) return session.callDurationFormatted
    if (session.callDurationSeconds !== undefined && session.callDurationSeconds !== null) {
      return formatDuration(session.callDurationSeconds)
    }
    if (session.durationSeconds !== undefined && session.durationSeconds !== null) {
      return formatDuration(session.durationSeconds)
    }
    return null
  }


  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'active':
        return <Play className="w-5 h-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-gray-500" />
      case 'rejected':
      case 'declined':
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Waiting for Response'
      case 'accepted':
        return 'Ready to Start'
      case 'active':
        return 'Session Active'
      case 'completed':
        return 'Session Completed'
      case 'rejected':
      case 'declined':
        return 'Request Declined'
      case 'cancelled':
        return 'Request Cancelled'
      default:
        return 'Unknown Status'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'rejected':
      case 'declined':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100'
      }`}>
        <div className="text-center">
          <div className="relative">
            <div className={`absolute inset-0 rounded-2xl blur-lg ${
              isDark 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 opacity-30' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 shadow-2xl shadow-blue-300/30'
            }`}></div>
            <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Play className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Loading Dashboard</h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>Loading your tutoring sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#130d2f] via-[#1a1240] to-[#08071a] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute bottom-12 right-16 h-72 w-72 rounded-full bg-pink-400/20 blur-[140px]" />
        <div className="absolute top-1/2 left-12 h-60 w-60 rounded-full bg-blue-400/25 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 hide-scrollbar">
        {/* Hero + filters */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]">
          <div className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-500">
              <Play className="h-4 w-4" /> Keep your learning momentum
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              Continue your tutoring adventures and track every milestone
            </h1>
            <p className={`mt-3 max-w-xl text-sm md:text-base ${
              isDark ? 'text-white/70' : 'text-slate-600'
            }`}>
              View upcoming sessions, join active meetings, and revisit completed lessons. Filter by status, rate tutors, and monitor your progress—all from one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {['all', 'pending', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatClick(status === 'all' ? 'all' : status)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : isDark
                        ? 'bg-white/10 text-white/70 hover:bg-white/15'
                        : 'bg-white/80 text-slate-700 hover:bg-white'
                  }`}
                >
                  {status === 'all' ? 'View All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowRatings(!showRatings)
                  setFilterStatus('ratings')
                }}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                  showRatings
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : isDark
                      ? 'bg-white/10 text-white/70 hover:bg-white/15'
                      : 'bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                {showRatings ? 'Hide Ratings' : 'View Ratings'}
              </button>
            </div>
          </div>

          <div className={`rounded-[32px] border px-6 py-6 shadow-lg backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className={`rounded-2xl border px-4 py-4 ${
                  isDark ? 'border-white/10 bg-white/8' : 'border-slate-200 bg-white'
                }`}>
                  <p className="text-xs uppercase tracking-wide text-purple-400">Completed sessions</p>
                  <p className={`mt-1 text-lg font-semibold ${isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]' : 'text-slate-800'}`}>
                    {sessions.filter(s => s.status === 'completed').length}
                  </p>
                </div>
                <div className={`rounded-2xl border px-4 py-4 ${
                  isDark ? 'border-white/10 bg-white/8' : 'border-slate-200 bg-white'
                }`}>
                  <p className="text-xs uppercase tracking-wide text-purple-400">Upcoming</p>
                  <p className={`mt-1 text-lg font-semibold ${isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]' : 'text-slate-800'}`}>
                    {sessions.filter(s => ['pending', 'accepted', 'active'].includes(s.status)).length}
                  </p>
                </div>
              </div>
              <div className={`rounded-2xl border px-4 py-5 ${
                isDark ? 'border-white/10 bg-white/8' : 'border-slate-200 bg-white'
              }`}>
                <p className="text-xs uppercase tracking-wide text-purple-400">Average rating given</p>
                <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]' : 'text-slate-900'}`}>
                  {sessions.filter(s => s.rating).length > 0
                    ? (
                        sessions
                          .filter(s => s.rating)
                          .reduce((sum, s) => sum + s.rating, 0) /
                        sessions.filter(s => s.rating).length
                      ).toFixed(1)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rating list */}
        {showRatings && (
          <section className={`rounded-[32px] border px-6 py-6 backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">All Ratings Given</h3>
              <button
                onClick={() => setShowRatings(false)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Close
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {sessions.filter(s => s.rating).length > 0 ? (
                sessions.filter(s => s.rating).map(session => (
                  <div key={session.id} className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${
                    isDark ? 'border-white/12 bg-white/8' : 'border-slate-200 bg-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Avatar user={session.tutor} size="md" />
                      <div>
                        <h4 className="text-sm font-semibold">{session.tutor?.name || 'Unknown Tutor'}</h4>
                        <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{session.subject} • {formatDate(session.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= session.rating
                              ? 'text-yellow-400 fill-current'
                              : isDark ? 'text-white/30' : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-semibold">{session.rating}/5</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`rounded-2xl border px-6 py-10 text-center text-sm ${
                  isDark ? 'border-white/10 bg-white/8 text-white/60' : 'border-slate-200 bg-white text-slate-600'
                }`}>
                  No ratings given yet. Complete sessions and rate your tutors to see them here.
                </div>
              )}
            </div>
          </section>
        )}

        {/* Sessions list */}
        <section className={`rounded-[32px] border px-6 py-6 backdrop-blur-xl ${
          isDark ? 'border-white/12 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        } hide-scrollbar`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Tutoring Sessions</h3>
            {getFilteredSessions().length === 0 && (
              <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>No sessions yet — start your learning journey!</span>
            )}
          </div>

          {getFilteredSessions().length === 0 ? (
            <div className={`mt-10 rounded-2xl border px-6 py-12 text-center text-sm ${
              isDark ? 'border-white/10 bg-white/8 text-white/60' : 'border-slate-200 bg-white text-slate-600'
            }`}>
              <div className="text-5xl mb-4">🗓️</div>
              <p>No sessions found for this filter.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {getFilteredSessions().map(session => {
                const duration = getSessionDurationLabel(session)
                const statusGradient = {
                  pending: 'from-yellow-500 to-orange-500',
                  accepted: 'from-green-500 to-emerald-500',
                  active: 'from-blue-500 to-cyan-500',
                  completed: 'from-slate-500 to-slate-600',
                  rejected: 'from-red-500 to-pink-500',
                  declined: 'from-red-500 to-pink-500',
                  cancelled: 'from-red-500 to-pink-500'
                }[session.status] || 'from-slate-500 to-slate-600'

                return (
                  <div key={session.id} className={`rounded-[28px] border px-5 py-5 backdrop-blur-xl transition-transform hover:-translate-y-1 hover:shadow-2xl ${
                    isDark ? 'border-white/12 bg-white/8' : 'border-slate-200 bg-white'
                  }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar user={session.tutor} size="lg" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{session.tutor?.name}</h3>
                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                              isDark ? 'bg-white/10 text-white/80' : 'bg-purple-100 text-purple-600'
                            }`}>
                              {session.subject || 'General'}
                            </span>
                          </div>
                          <div className={`mt-1 flex flex-wrap items-center gap-3 text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {session.preferredTime
                                ? new Date(session.preferredTime).toLocaleString()
                                : session.scheduledTime
                                ? new Date(session.scheduledTime).toLocaleString()
                                : 'Flexible'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5" />
                              {session.tutor.rating || 'New Tutor'}
                            </span>
                            {duration && (
                              <span className="flex items-center gap-1">
                                <Timer className="h-3.5 w-3.5" />
                                {duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r ${statusGradient} shadow-lg shadow-black/20`}> 
                          {getStatusIcon(session.status)}
                          <span>{getStatusText(session.status)}</span>
                        </div>

                        <div className="flex gap-2">
                          {(session.status === 'accepted' || session.status === 'active') && (
                            <button
                              onClick={() => handleStartSession(session.id)}
                              className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition"
                            >
                              {session.status === 'active' ? 'Join meeting' : 'Start session'}
                            </button>
                          )}

                          {session.status === 'completed' && (
                            <button
                              onClick={() => handleRateTutor(session.id)}
                              className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:-translate-y-0.5 transition"
                            >
                              {session.rated ? 'Rated' : 'Rate tutor'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* Submit Review Modal */}
      {showRatingModal && selectedSession && (
        <SubmitReviewModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false)
            setSelectedSession(null)
          }}
          sessionData={selectedSession}
          tutor={selectedSession.tutor}
        />
      )}

      {/* Video Call Modal */}
      {showVideoCall && videoCallSession && (
        <RealVideoCall
          isOpen={showVideoCall}
          onClose={handleCloseVideoCall}
          sessionData={videoCallSession}
          user={user}
        />
      )}
    </div>
  )
}

export default StudentDashboard
