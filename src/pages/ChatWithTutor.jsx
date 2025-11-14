import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  MoreVertical,
  Phone,
  Video,
  MessageCircle
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  sendMessage, 
  listenToMessages, 
  formatMessageTime
} from '../services/chatService'
import { doc, getDoc, onSnapshot, collection, query, where, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import Avatar from '../components/Avatar'
import { isUserOnline } from '../services/presenceService'

const ChatWithTutor = () => {
  const { tutorId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const [tutor, setTutor] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const fromPage = location.state?.from
  
  const backConfig = {
    'tutoring': { path: '/tutoring', label: 'Back to tutoring' },
    'friends': { path: '/friends', label: 'Back to friends' },
    'student-dashboard': { path: '/student-dashboard', label: 'Back to dashboard' },
    'tutor-dashboard': { path: '/tutor-dashboard', label: 'Back to dashboard' }
  }
  const defaultBack = { path: '/student-dashboard', label: 'Back to dashboard' }
  const backTarget = backConfig[fromPage] || defaultBack

  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const unsubscribeRef = useRef(null)

  useEffect(() => {
    if (tutorId && user?.id) {
      loadChatData()
      // 不自动标记为已读，让用户自己查看消息
      // 只有当用户滚动到底部查看消息时才标记为已读
    }
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [tutorId, user])

  // 当用户看到消息底部时，标记消息为已读
  useEffect(() => {
    if (!messagesEndRef.current || !tutorId || !user?.id) return

    // 使用 Intersection Observer 检测用户是否看到消息底部
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 如果消息底部在视口中可见，标记为已读
          if (entry.isIntersecting) {
            markMessagesFromTutorAsRead()
          }
        })
      },
      {
        root: messagesEndRef.current.closest('.overflow-y-auto') || null,
        rootMargin: '0px',
        threshold: 0.1 // 当 10% 可见时触发
      }
    )

    observer.observe(messagesEndRef.current)

    // 初始检查：如果已经在底部，立即标记为已读
    setTimeout(() => {
      if (messagesEndRef.current) {
        const rect = messagesEndRef.current.getBoundingClientRect()
        const container = messagesEndRef.current.closest('.overflow-y-auto')
        if (container) {
          const containerRect = container.getBoundingClientRect()
          // 如果消息底部在容器底部 200px 以内，认为已查看
          if (rect.bottom <= containerRect.bottom + 200) {
            markMessagesFromTutorAsRead()
          }
        }
      }
    }, 1000)

    return () => {
      observer.disconnect()
    }
  }, [messages, tutorId, user])

  // 标记来自这个 tutor 的未读消息为已读（延迟执行）
  const markMessagesFromTutorAsRead = async () => {
    if (!tutorId || !user?.id) return
    try {
      const messagesRef = collection(db, 'messages')
      const q = query(
        messagesRef,
        where('receiverId', '==', user.id),
        where('senderId', '==', tutorId),
        where('read', '==', false),
        where('chatType', '==', 'tutor') // 确保只标记 tutor 类型的消息
      )
      const snapshot = await getDocs(q)
      const updatePromises = []
      snapshot.forEach((docSnapshot) => {
        const messageRef = doc(db, 'messages', docSnapshot.id)
        updatePromises.push(updateDoc(messageRef, { read: true }))
      })
      await Promise.all(updatePromises)
      console.log(`✅ Marked ${snapshot.size} tutor messages as read`)
    } catch (error) {
      console.error('Error marking tutor messages as read:', error)
    }
  }

  // 实时监听 tutor 的在线状态
  useEffect(() => {
    if (!tutorId) return

    const tutorRef = doc(db, 'users', tutorId)
    const unsubscribe = onSnapshot(tutorRef, (snapshot) => {
      if (snapshot.exists()) {
        const tutorData = snapshot.data()
        setTutor((prevTutor) => ({
          ...prevTutor,
          lastSeen: tutorData.lastSeen || null,
          isOnline: tutorData.isOnline || false
        }))
      }
    })

    return () => {
      unsubscribe()
    }
  }, [tutorId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChatData = async () => {
    try {
      setLoading(true)
      
      // 从 users 集合获取 tutor 信息
      try {
        const userDoc = await getDoc(doc(db, 'users', tutorId))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setTutor({
            id: tutorId,
            name: userData.name || 'Tutor',
            email: userData.email || '',
            avatar: userData.avatar || null,
            lastSeen: userData.lastSeen || null,
            isOnline: userData.isOnline || false
          })
        } else {
          setTutor({
            id: tutorId,
            name: 'Unknown Tutor',
            email: 'unknown@example.com'
          })
        }
      } catch (error) {
        console.error('Error getting tutor from users collection:', error)
        setTutor({
          id: tutorId,
          name: 'Unknown Tutor',
          email: 'unknown@example.com'
        })
      }
      
      // 设置实时消息监听（只监听 tutor chat 类型的消息）
      unsubscribeRef.current = listenToMessages(user?.id, tutorId, (result) => {
        if (result.success) {
          setMessages(result.messages)
        }
      }, 'tutor')
      
    } catch (error) {
      console.error('Error loading chat data:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendCurrentMessage = async () => {
    if (!newMessage.trim() || sending) return
    
    try {
      setSending(true)
      const result = await sendMessage(user?.id, tutorId, newMessage.trim(), 'tutor')
      
      if (result.success) {
        setNewMessage('')
      } else {
        console.error('Failed to send message:', result.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    await sendCurrentMessage()
  }

  const handleMessageKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await sendCurrentMessage()
    }
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
            : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
        }`}
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/30">
            <MessageCircle className="h-9 w-9 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold">Loading chat</h3>
          <p className={`mt-2 text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            Preparing your conversation...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden ${
        isDark
          ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
          : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
      }`}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="absolute top-0 right-4 h-72 w-72 rounded-full bg-pink-400/20 blur-[120px]" />
        <div className="absolute bottom-8 left-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-col px-8 pb-16 pt-24">
        <div
          className={`w-full overflow-hidden rounded-[32px] border shadow-2xl backdrop-blur-xl flex flex-col ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/10 via-white/4 to-transparent/35' : 'border-white/70 bg-white'
          }`}
          style={{ height: 'calc(100vh - 160px)' }}
        >
          <div
            className={`flex items-center justify-between border-b px-6 py-6 ${
              isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate(backTarget.path)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  isDark
                    ? 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
                    : 'bg-white text-slate-600 hover:text-slate-900 shadow-sm'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                {backTarget.label}
              </button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar user={tutor} size="lg" showOnlineStatus className="shadow-lg ring-2 ring-purple-400/40" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {tutor?.name || 'Tutor'}
                    </h2>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      isDark 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-purple-100 text-purple-700 border border-purple-200'
                    }`}>
                      Tutor Chat
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${
                    isUserOnline(tutor) 
                      ? (isDark ? 'text-green-300' : 'text-green-600')
                      : (isDark ? 'text-gray-400' : 'text-gray-500')
                  }`}>
                    {isUserOnline(tutor) ? 'Online now' : 'Offline now'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`rounded-2xl p-3 transition ${
                  isDark ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-sm'
                }`}
              >
                <Phone className="h-5 w-5" />
              </button>
              <button
                className={`rounded-2xl p-3 transition ${
                  isDark ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-sm'
                }`}
              >
                <Video className="h-5 w-5" />
              </button>
              <button
                className={`rounded-2xl p-3 transition ${
                  isDark ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-sm'
                }`}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            className={`flex-1 px-6 py-6 ${
              isDark ? 'bg-white/5 text-white' : 'bg-white text-slate-900'
            } flex flex-col`}
            style={{ minHeight: '0' }}
          >
            <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message, index) => {
                    const isCurrentUser = message.senderId === user?.id
                    const showName = !isCurrentUser && (index === 0 || messages[index - 1].senderId !== message.senderId)

                    return (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isCurrentUser && (
                          <div className="flex flex-col items-center gap-1 text-xs text-white/60">
                            <Avatar user={tutor} size="sm" className="h-9 w-9" />
                            {showName && (
                              <span className={`${isDark ? 'text-white/70' : 'text-slate-500'}`}>
                                {tutor?.name || 'Tutor'}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex max-w-xs flex-col gap-1 sm:max-w-md">
                          <div
                            className={`rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                                : isDark
                                  ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                  : 'bg-purple-50 text-slate-800 border border-purple-200'
                            } ${isCurrentUser ? 'rounded-br-md' : 'rounded-bl-md'}`}
                          >
                            {message.message}
                          </div>
                          <p
                            className={`px-2 text-[11px] ${
                              isCurrentUser
                                ? 'text-right text-white/60'
                                : isDark
                                  ? 'text-white/50'
                                  : 'text-slate-500'
                            }`}
                          >
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>

                        {isCurrentUser && (
                          <Avatar user={user} size="sm" className="h-9 w-9" />
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                      <User className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No messages yet</h3>
                    <p className={`mt-2 text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      Start the conversation with {tutor?.name || 'your tutor'}.
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          <div
            className={`border-t px-6 py-5 ${
              isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
            }`}
          >
            <form onSubmit={handleSendMessage} className="flex items-stretch">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleMessageKeyDown}
                  placeholder={`Message ${tutor?.name || 'your tutor'}...`}
                  className={`w-full resize-none rounded-2xl border px-5 py-4 text-sm transition focus:ring-2 focus:ring-purple-500 focus:outline-none hide-scrollbar ${
                    isDark
                      ? 'border-white/15 bg-white/5 text-white placeholder-white/40'
                      : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400'
                  }`}
                  rows={1}
                  disabled={sending}
                  style={{ minHeight: '52px' }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatWithTutor

