import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  UserPlus, 
  Search, 
  MessageCircle, 
  Check, 
  X,
  MoreVertical,
  Trash2,
  Mail,
  User
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Avatar from '../components/Avatar'
import { 
  sendFriendRequest, 
  getFriendRequests, 
  acceptFriendRequest, 
  declineFriendRequest,
  getFriendsList,
  removeFriend 
} from '../services/friendsService'

const Friends = () => {
  const { user } = useSimpleAuth()
  const { theme, isDark } = useTheme()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('friends') // friends, requests, add
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestLoading, setRequestLoading] = useState(false)
  const [friendEmail, setFriendEmail] = useState('')
  const [addFriendLoading, setAddFriendLoading] = useState(false)
  const [addFriendMessage, setAddFriendMessage] = useState('')
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [friendToRemove, setFriendToRemove] = useState(null)
  const [isClosing, setIsClosing] = useState(false)

  const tabs = [
    { id: 'friends', label: 'Friends', count: friends.length },
    { id: 'requests', label: 'Requests', count: friendRequests.length },
    { id: 'add', label: 'Add Friend', count: 0 }
  ]

  useEffect(() => {
    if (user?.id) {
      loadData()
    }
  }, [user?.id])

  const loadData = async () => {
    if (!user?.id) {
      console.log('User not loaded yet, skipping data load')
      return
    }
    
    setLoading(true)
    try {
      const [friendsResult, requestsResult] = await Promise.all([
        getFriendsList(user.id),
        getFriendRequests(user.id)
      ])
      
      if (friendsResult.success) {
        setFriends(friendsResult.friends)
      }
      
      if (requestsResult.success) {
        setFriendRequests(requestsResult.requests)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendFriendRequest = async (e) => {
    e.preventDefault()
    
    if (!user?.id) {
      setAddFriendMessage('Please log in to add friends')
      return
    }
    
    setAddFriendLoading(true)
    setAddFriendMessage('')

    try {
      const result = await sendFriendRequest(user.id, friendEmail)
      if (result.success) {
        setAddFriendMessage(result.message)
        setFriendEmail('')
      } else {
        setAddFriendMessage(result.error || 'Failed to send friend request')
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
      setAddFriendMessage('An error occurred while sending the friend request')
    } finally {
      setAddFriendLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId, fromUserId) => {
    if (!user?.id) {
      console.error('User not logged in')
      return
    }
    
    setRequestLoading(true)
    try {
      const result = await acceptFriendRequest(requestId, user.id, fromUserId)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
    } finally {
      setRequestLoading(false)
    }
  }

  const handleDeclineRequest = async (requestId) => {
    setRequestLoading(true)
    try {
      const result = await declineFriendRequest(requestId)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error('Error declining friend request:', error)
    } finally {
      setRequestLoading(false)
    }
  }

  const handleRemoveFriend = (friend) => {
    setFriendToRemove(friend)
    setShowRemoveModal(true)
    setIsClosing(false)
  }

  const confirmRemoveFriend = async () => {
    if (!friendToRemove || !user?.id) return
    
    try {
      const result = await removeFriend(user.id, friendToRemove.id)
      if (result.success) {
        await loadData()
        closeModal()
      }
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  const closeModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowRemoveModal(false)
      setFriendToRemove(null)
      setIsClosing(false)
    }, 500)
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>Loading friends...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.7) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes modalExit {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideOutUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>

      <div
        className={`min-h-screen relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
            : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
        }`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/25 blur-3xl" />
          <div className="absolute top-1/3 right-6 h-72 w-72 rounded-full bg-pink-400/20 blur-[120px]" />
          <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 hide-scrollbar">
          {/* Hero */}
          <section
            className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
              isDark
                ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35'
                : 'border-white/70 bg-white'
            }`}
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-400">
                  <Users className="h-4 w-4" /> Build your learning squad
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                  Stay connected with classmates and mentors
                </h1>
                <p
                  className={`mt-3 max-w-xl text-sm md:text-base ${
                    isDark ? 'text-white/70' : 'text-slate-600'
                  }`}
                >
                  Send requests, accept invitations, and jump into conversations — all inside a single, calming hub.
                </p>
              </div>
              <div className="grid w-full max-w-xs grid-cols-2 gap-3 text-center text-sm md:max-w-sm">
                <div
                  className={`rounded-2xl border px-4 py-4 ${
                    isDark ? 'border-white/12 bg-white/8' : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="text-[12px] uppercase tracking-wide text-purple-400">Friends</p>
                  <p className={`mt-1 text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {friends.length}
                  </p>
                </div>
                <div
                  className={`rounded-2xl border px-4 py-4 ${
                    isDark ? 'border-white/12 bg-white/8' : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="text-[12px] uppercase tracking-wide text-purple-400">Requests</p>
                  <p className={`mt-1 text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {friendRequests.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <nav
            className={`rounded-[28px] border p-2 backdrop-blur-xl shadow-xl ${
              isDark ? 'border-white/12 bg-white/6' : 'border-white/70 bg-white'
            }`}
          >
            <div className="grid gap-2 sm:grid-cols-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between rounded-2xl px-6 py-4 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : isDark
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={`ml-3 rounded-full px-2 py-1 text-[11px] font-bold ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : isDark
                            ? 'bg-white/10 text-white/80'
                            : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <section
              className={`rounded-[32px] border px-8 py-8 shadow-2xl backdrop-blur-xl ${
                isDark ? 'border-white/12 bg-white/6' : 'border-white/70 bg-white'
              }`}
            >
              {friends.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className={`group relative overflow-hidden rounded-3xl border px-6 py-6 shadow-lg transition hover:shadow-2xl ${
                        isDark ? 'border-white/12 bg-gradient-to-br from-white/10 via-white/5 to-transparent/35' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="absolute -top-16 right-0 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl transition group-hover:bg-purple-500/20" />
                      <div className="absolute -bottom-14 left-0 h-28 w-28 rounded-full bg-pink-400/10 blur-2xl transition group-hover:bg-pink-400/20" />

                      <div className="relative z-10 flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar
                              user={friend}
                              size="xl"
                              showOnlineStatus
                              className="shadow-lg ring-2 ring-purple-400/30"
                            />
                            <div>
                              <h3
                                className={`text-xl font-bold ${
                                  isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-slate-900'
                                }`}
                              >
                                {friend.name}
                              </h3>
                              <p className={`${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                                {friend.school || 'Student'}
                              </p>
                            </div>
                          </div>
                          <button
                            className={`rounded-xl p-2 transition ${
                              isDark ? 'text-white/50 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
                              <User className="h-3.5 w-3.5" />
                            </div>
                            <span className={`${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                              Grade: {friend.grade || 'Not specified'}
                            </span>
                          </div>

                          {friend.subjects && friend.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {friend.subjects.slice(0, 3).map((subject, index) => (
                                <span
                                  key={index}
                                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                    isDark
                                      ? 'border-white/20 bg-white/10 text-white/80'
                                      : 'border-slate-200 bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  {subject}
                                </span>
                              ))}
                              {friend.subjects.length > 3 && (
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                    isDark
                                      ? 'border-white/20 bg-white/5 text-white/70'
                                      : 'border-slate-200 bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  +{friend.subjects.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/chat/${friend.id}`)}
                            className="flex-1 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <MessageCircle className="h-4 w-4" />
                              Chat
                            </div>
                          </button>
                          <button
                            onClick={() => handleRemoveFriend(friend)}
                            className={`rounded-2xl border px-4 py-3 transition ${
                              isDark
                                ? 'border-red-400/40 text-red-300 hover:border-red-400/70 hover:bg-red-500/10'
                                : 'border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50'
                            }`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center rounded-[28px] border px-10 py-16 text-center ${
                    isDark ? 'border-white/12 bg-white/6' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                    <Users className="h-10 w-10" />
                  </div>
                  <h3 className={`mt-6 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    No friends yet
                  </h3>
                  <p className={`mt-3 max-w-sm text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    Start connecting with other students by sending friendly invitations.
                  </p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="mt-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add friends
                    </div>
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <section
              className={`rounded-[32px] border px-8 py-8 shadow-2xl backdrop-blur-xl ${
                isDark ? 'border-white/12 bg-white/6' : 'border-white/70 bg-white'
              }`}
            >
              {friendRequests.length > 0 ? (
                <div className="space-y-6">
                  {friendRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`group relative overflow-hidden rounded-3xl border px-6 py-6 shadow-lg transition hover:shadow-2xl ${
                        isDark ? 'border-white/12 bg-gradient-to-br from-white/10 via-white/5 to-transparent/35' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="absolute -top-16 right-0 h-28 w-28 rounded-full bg-green-400/10 blur-2xl transition group-hover:bg-green-400/20" />
                      <div className="absolute -bottom-16 left-0 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

                      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-5">
                          <Avatar user={request.fromUser} size="xl" className="shadow-lg ring-2 ring-green-400/30" />
                          <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {request.fromUser.name}
                            </h3>
                            <p className={`${isDark ? 'text-white/70' : 'text-slate-600'}`}>{request.fromUser.email}</p>
                            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                              {request.fromUser.school} • {request.fromUser.grade}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 md:flex-row">
                          <button
                            onClick={() => handleAcceptRequest(request.id, request.fromUserId)}
                            disabled={requestLoading}
                            className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Check className="h-4 w-4" />
                              Accept
                            </div>
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(request.id)}
                            disabled={requestLoading}
                            className={`rounded-2xl border px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                              isDark
                                ? 'border-white/15 text-white/80 hover:bg-white/10 hover:text-white'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <X className="h-4 w-4" />
                              Decline
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center rounded-[28px] border px-10 py-16 text-center ${
                    isDark ? 'border-white/12 bg-white/6' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg">
                    <UserPlus className="h-10 w-10" />
                  </div>
                  <h3 className={`mt-6 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    No pending requests
                  </h3>
                  <p className={`mt-3 max-w-sm text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    When someone sends you a friend request it will appear right here.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Add Friend Tab */}
          {activeTab === 'add' && (
            <section className="mx-auto w-full max-w-2xl">
              <div
                className={`overflow-hidden rounded-[32px] border shadow-2xl backdrop-blur-xl ${
                  isDark ? 'border-white/12 bg-white/6' : 'border-white/70 bg-white'
                }`}
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-8 py-10 text-white">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-20 left-10 h-32 w-32 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-white/70 blur-2xl" />
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
                      <UserPlus className="h-10 w-10" />
                    </div>
                    <h3 className="mt-4 text-2xl font-bold">Add a friend</h3>
                    <p className="mt-2 text-sm text-white/80">
                      Send an invitation using their Studiply email address.
                    </p>
                  </div>
                </div>

                <div className="space-y-6 px-8 py-8">
                  <form onSubmit={handleSendFriendRequest} className="space-y-6">
                    <div>
                      <label className={`block text-sm font-semibold ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
                        Friend's email address
                      </label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-400" />
                        <input
                          type="email"
                          value={friendEmail}
                          onChange={(e) => setFriendEmail(e.target.value)}
                          placeholder="Enter email"
                          className={`w-full rounded-2xl border px-12 py-4 text-base transition focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                            isDark
                              ? 'border-white/15 bg-white/5 text-white placeholder-white/40'
                              : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {addFriendMessage && (
                      <div
                        className={`rounded-2xl border px-4 py-4 text-sm font-medium ${
                          isDark
                            ? 'border-purple-400/40 bg-purple-500/10 text-purple-200'
                            : 'border-purple-200 bg-purple-50 text-purple-700'
                        }`}
                      >
                        {addFriendMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={addFriendLoading || !friendEmail.trim()}
                      className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {addFriendLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          Send friend request
                        </div>
                      )}
                    </button>
                  </form>

                  <div
                    className={`rounded-2xl border px-6 py-6 text-sm ${
                      isDark ? 'border-white/12 bg-white/5 text-white/70' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-purple-400">
                      <Users className="h-4 w-4" /> How it works
                    </h4>
                    <ul className="mt-3 space-y-2">
                      <li>Ask your friend for the email they used to register.</li>
                      <li>Send the invite and wait for them to accept.</li>
                      <li>Once connected you can start chatting right away.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Remove Friend Confirmation Modal */}
      {showRemoveModal && friendToRemove && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-500 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={closeModal}
          style={{
            animation: isClosing ? 'fadeOut 0.5s ease-in-out' : 'fadeIn 0.5s ease-in-out'
          }}
        >
          <div
            className={`w-full max-w-md overflow-hidden rounded-[28px] border shadow-2xl transition-all duration-500 ${
              isDark ? 'border-white/12 bg-gradient-to-br from-white/15 via-white/8 to-transparent/35 text-white' : 'border-white/70 bg-white text-slate-900'
            } ${isClosing ? 'scale-95 opacity-0 translate-y-6' : 'scale-100 opacity-100 translate-y-0'}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: isClosing ? 'modalExit 0.45s ease-in-out' : 'modalEnter 0.45s ease-in-out'
            }}
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 px-6 py-6 text-white">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-16 left-14 h-28 w-28 rounded-full bg-white blur-3xl" />
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Remove friend</h3>
                  <p className="text-sm text-white/80">This action cannot be undone.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className={`rounded-2xl border px-4 py-4 ${isDark ? 'border-white/12 bg-white/5 text-white/80' : 'border-red-100 bg-red-50 text-red-600'}`}>
                <p className="text-sm">
                  Are you sure you want to remove <span className="font-semibold">{friendToRemove.name}</span> from your friends list?
                </p>
                <p className="mt-2 text-xs opacity-70">
                  You will lose chat history and both accounts will no longer be connected.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    isDark ? 'border-white/15 text-white/80 hover:bg-white/10 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveFriend}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Remove friend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Friends