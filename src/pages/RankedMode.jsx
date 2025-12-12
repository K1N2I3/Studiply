import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Swords, 
  Trophy, 
  Users, 
  Clock, 
  ChevronRight,
  Loader2,
  X,
  Zap,
  Target,
  Star,
  TrendingUp,
  Award
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import RankBadge from '../components/RankBadge'
import RankedBattle from '../components/RankedBattle'
import RankedResult from '../components/RankedResult'
import {
  RANK_TIERS,
  POINT_RULES,
  getTierFromPoints,
  getProgressToNextTier,
  getRankStatus,
  getSubjectRank,
  joinQueue,
  checkQueueStatus,
  leaveQueue,
  getMatchHistory
} from '../services/rankedService'

const SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', icon: '📐', color: 'from-blue-500 to-indigo-600' },
  { id: 'physics', name: 'Physics', icon: '⚡', color: 'from-yellow-500 to-orange-600' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: 'from-green-500 to-emerald-600' },
  { id: 'biology', name: 'Biology', icon: '🧬', color: 'from-pink-500 to-rose-600' },
  { id: 'english', name: 'English', icon: '📝', color: 'from-purple-500 to-violet-600' },
  { id: 'italian', name: 'Italian', icon: '🇮🇹', color: 'from-green-600 to-red-500' },
  { id: 'history', name: 'History', icon: '📜', color: 'from-amber-600 to-yellow-700' },
  { id: 'geography', name: 'Geography', icon: '🌍', color: 'from-teal-500 to-cyan-600' },
  { id: 'computerScience', name: 'Computer Science', icon: '💻', color: 'from-gray-600 to-slate-700' }
]

const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', icon: '🌱', description: 'Win +15 / Lose -25', color: 'from-green-500 to-emerald-600' },
  { id: 'medium', name: 'Medium', icon: '⚔️', description: 'Win +20 / Lose -20', color: 'from-yellow-500 to-amber-600' },
  { id: 'hard', name: 'Hard', icon: '🔥', description: 'Win +30 / Lose -10', color: 'from-red-500 to-rose-600' }
]

const RankedMode = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { user } = useSimpleAuth()
  const { showError, showSuccess } = useNotification()
  const pollIntervalRef = useRef(null)

  // State
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [userRank, setUserRank] = useState(null)
  const [subjectRank, setSubjectRank] = useState(null)
  const [matchHistory, setMatchHistory] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Matchmaking state
  const [isSearching, setIsSearching] = useState(false)
  const [searchTime, setSearchTime] = useState(0)
  const [queuePosition, setQueuePosition] = useState(0)
  
  // Battle state
  const [inBattle, setInBattle] = useState(false)
  const [matchId, setMatchId] = useState(null)
  const [opponent, setOpponent] = useState(null)
  
  // Result state
  const [showResult, setShowResult] = useState(false)
  const [matchResult, setMatchResult] = useState(null)

  // Load user rank on mount
  useEffect(() => {
    if (user?.id) {
      loadUserRank()
      loadMatchHistory()
    }
  }, [user])

  // Load subject rank when subject changes
  useEffect(() => {
    if (user?.id && selectedSubject) {
      loadSubjectRank()
    }
  }, [user, selectedSubject])

  // Search timer
  useEffect(() => {
    let timer
    if (isSearching) {
      timer = setInterval(() => {
        setSearchTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isSearching])

  const loadUserRank = async () => {
    setLoading(true)
    try {
      const result = await getRankStatus(user.id)
      if (result.success) {
        setUserRank(result.rank)
      }
    } catch (error) {
      console.error('Error loading rank:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSubjectRank = async () => {
    try {
      const result = await getSubjectRank(user.id, selectedSubject)
      if (result.success) {
        setSubjectRank(result.subjectRank)
      }
    } catch (error) {
      console.error('Error loading subject rank:', error)
    }
  }

  const loadMatchHistory = async () => {
    try {
      const result = await getMatchHistory(user.id, null, 5)
      if (result.success) {
        setMatchHistory(result.history)
      }
    } catch (error) {
      console.error('Error loading match history:', error)
    }
  }

  const handleFindMatch = async () => {
    if (!selectedSubject || !selectedDifficulty) {
      showError('Please select a subject and difficulty', 'Selection Required')
      return
    }

    setIsSearching(true)
    setSearchTime(0)

    try {
      const tier = subjectRank?.tier || 'BRONZE'
      const result = await joinQueue({
        userId: user.id,
        userName: user.name || user.email,
        userAvatar: user.avatar,
        subject: selectedSubject,
        difficulty: selectedDifficulty
      })

      if (result.success) {
        if (result.status === 'matched') {
          // Found opponent immediately
          setMatchId(result.matchId)
          setOpponent(result.opponent)
          setIsSearching(false)
          setInBattle(true)
        } else {
          // Start polling for match
          setQueuePosition(result.queuePosition)
          startPolling(tier)
        }
      } else {
        showError(result.error || 'Failed to join queue', 'Error')
        setIsSearching(false)
      }
    } catch (error) {
      console.error('Error finding match:', error)
      showError('Failed to find match', 'Error')
      setIsSearching(false)
    }
  }

  const startPolling = (tier) => {
    pollIntervalRef.current = setInterval(async () => {
      try {
        const result = await checkQueueStatus({
          userId: user.id,
          subject: selectedSubject,
          difficulty: selectedDifficulty,
          tier
        })

        if (result.success) {
          if (result.status === 'matched') {
            clearInterval(pollIntervalRef.current)
            setMatchId(result.matchId)
            setOpponent(result.opponent)
            setIsSearching(false)
            setInBattle(true)
          } else if (result.status === 'not_in_queue') {
            clearInterval(pollIntervalRef.current)
            setIsSearching(false)
          } else {
            setQueuePosition(result.queuePosition)
          }
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 2000)
  }

  const handleCancelSearch = async () => {
    clearInterval(pollIntervalRef.current)
    setIsSearching(false)
    setSearchTime(0)

    try {
      await leaveQueue({
        userId: user.id,
        subject: selectedSubject,
        difficulty: selectedDifficulty,
        tier: subjectRank?.tier || 'BRONZE'
      })
    } catch (error) {
      console.error('Error leaving queue:', error)
    }
  }

  const handleBattleComplete = (result) => {
    setInBattle(false)
    setMatchResult(result)
    setShowResult(true)
    loadUserRank()
    loadSubjectRank()
    loadMatchHistory()
  }

  const handleCloseResult = () => {
    setShowResult(false)
    setMatchResult(null)
    setMatchId(null)
    setOpponent(null)
  }

  // Show battle screen
  if (inBattle && matchId) {
    return (
      <RankedBattle
        matchId={matchId}
        userId={user.id}
        opponent={opponent}
        subject={selectedSubject}
        difficulty={selectedDifficulty}
        onComplete={handleBattleComplete}
        onExit={() => {
          setInBattle(false)
          setMatchId(null)
        }}
      />
    )
  }

  // Show result screen
  if (showResult && matchResult) {
    return (
      <RankedResult
        result={matchResult}
        subject={selectedSubject}
        onClose={handleCloseResult}
        onPlayAgain={() => {
          handleCloseResult()
          handleFindMatch()
        }}
      />
    )
  }

  const currentTier = subjectRank?.tier || 'BRONZE'
  const currentPoints = subjectRank?.points || 0
  const progress = getProgressToNextTier(currentPoints)

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#0a0615] via-[#1a0a2e] to-[#0d0520] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-slate-900'
    }`}>
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl ${
          isDark ? 'bg-purple-600/20' : 'bg-purple-300/40'
        }`} />
        <div className={`absolute top-1/2 -left-20 h-80 w-80 rounded-full blur-3xl ${
          isDark ? 'bg-blue-600/15' : 'bg-blue-200/50'
        }`} />
        <div className={`absolute bottom-20 right-1/4 h-64 w-64 rounded-full blur-3xl ${
          isDark ? 'bg-pink-600/15' : 'bg-pink-200/40'
        }`} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            } shadow-xl shadow-purple-500/30`}>
              <Swords className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Ranked Mode
              </h1>
              <p className={`mt-1 text-sm ${
                isDark ? 'text-white/60' : 'text-slate-500'
              }`}>
                Compete in 1v1 battles and climb the ranks
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/ranked/leaderboard')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-white text-slate-700 hover:bg-slate-50 shadow-lg'
            }`}
          >
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </button>
        </div>

        {/* Matchmaking Overlay */}
        {isSearching && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className={`rounded-3xl p-8 text-center max-w-md mx-4 ${
              isDark ? 'bg-slate-900 border border-white/10' : 'bg-white shadow-2xl'
            }`}>
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
                <Swords className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
              
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Finding Opponent...
              </h3>
              <p className={`mb-4 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                Searching for a worthy challenger
              </p>
              
              <div className={`text-4xl font-mono font-bold mb-4 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {Math.floor(searchTime / 60)}:{(searchTime % 60).toString().padStart(2, '0')}
              </div>
              
              <p className={`text-sm mb-6 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                {searchTime < 30 
                  ? `Queue position: #${queuePosition}` 
                  : 'Creating AI opponent...'}
              </p>
              
              <button
                onClick={handleCancelSearch}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  isDark
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                <X className="inline h-5 w-5 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Selection */}
            <div className={`rounded-3xl border p-6 ${
              isDark 
                ? 'border-white/10 bg-white/5 backdrop-blur' 
                : 'border-purple-200/50 bg-white shadow-xl'
            }`}>
              <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Target className="h-5 w-5 text-purple-500" />
                Select Subject
              </h2>
              
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {SUBJECTS.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`p-4 rounded-2xl text-center transition-all ${
                      selectedSubject === subject.id
                        ? `bg-gradient-to-br ${subject.color} text-white shadow-lg scale-105`
                        : isDark
                          ? 'bg-white/5 text-white/80 hover:bg-white/10'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{subject.icon}</span>
                    <span className="text-xs font-semibold">{subject.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className={`rounded-3xl border p-6 ${
              isDark 
                ? 'border-white/10 bg-white/5 backdrop-blur' 
                : 'border-purple-200/50 bg-white shadow-xl'
            }`}>
              <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Zap className="h-5 w-5 text-yellow-500" />
                Select Difficulty
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`p-5 rounded-2xl text-left transition-all ${
                      selectedDifficulty === diff.id
                        ? `bg-gradient-to-br ${diff.color} text-white shadow-lg scale-[1.02]`
                        : isDark
                          ? 'bg-white/5 text-white/80 hover:bg-white/10'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{diff.icon}</span>
                    <span className="text-lg font-bold block">{diff.name}</span>
                    <span className={`text-xs ${
                      selectedDifficulty === diff.id ? 'text-white/80' : isDark ? 'text-white/50' : 'text-slate-500'
                    }`}>
                      {diff.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Find Match Button */}
            <button
              onClick={handleFindMatch}
              disabled={!selectedSubject || !selectedDifficulty || isSearching}
              className={`w-full py-5 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 ${
                !selectedSubject || !selectedDifficulty
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-[1.02] hover:shadow-2xl'
              } bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-xl shadow-purple-500/30`}
            >
              <Swords className="h-7 w-7" />
              Find Match
            </button>
          </div>

          {/* Sidebar - Rank & Stats */}
          <div className="space-y-6">
            {/* Current Rank Card */}
            <div className={`rounded-3xl border p-6 text-center ${
              isDark 
                ? 'border-white/10 bg-gradient-to-br from-purple-900/50 to-pink-900/30' 
                : 'border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50'
            }`}>
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                {selectedSubject 
                  ? SUBJECTS.find(s => s.id === selectedSubject)?.name 
                  : 'Overall'} Rank
              </h3>
              
              <RankBadge 
                tier={currentTier} 
                points={currentPoints} 
                size="xl" 
              />
              
              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className={isDark ? 'text-white/50' : 'text-slate-500'}>
                    {RANK_TIERS[currentTier]?.name}
                  </span>
                  {progress.nextTier && (
                    <span className={isDark ? 'text-white/50' : 'text-slate-500'}>
                      {RANK_TIERS[progress.nextTier]?.name}
                    </span>
                  )}
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  isDark ? 'bg-white/10' : 'bg-slate-200'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                {progress.pointsToNext > 0 && (
                  <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    {progress.pointsToNext} points to next rank
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className={`rounded-3xl border p-6 ${
              isDark 
                ? 'border-white/10 bg-white/5' 
                : 'border-purple-200/50 bg-white shadow-lg'
            }`}>
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                isDark ? 'text-white/60' : 'text-slate-500'
              }`}>
                <TrendingUp className="h-4 w-4" />
                Your Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Wins</span>
                  <span className={`font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {subjectRank?.wins || userRank?.totalWins || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Losses</span>
                  <span className={`font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    {subjectRank?.losses || userRank?.totalLosses || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Win Streak</span>
                  <span className={`font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    🔥 {subjectRank?.winStreak || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-white/60' : 'text-slate-500'}>Best Streak</span>
                  <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    ⭐ {subjectRank?.bestWinStreak || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Matches */}
            <div className={`rounded-3xl border p-6 ${
              isDark 
                ? 'border-white/10 bg-white/5' 
                : 'border-purple-200/50 bg-white shadow-lg'
            }`}>
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                isDark ? 'text-white/60' : 'text-slate-500'
              }`}>
                <Clock className="h-4 w-4" />
                Recent Matches
              </h3>
              
              {matchHistory.length === 0 ? (
                <p className={`text-sm text-center py-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                  No matches yet. Start battling!
                </p>
              ) : (
                <div className="space-y-2">
                  {matchHistory.slice(0, 5).map((match, i) => (
                    <div 
                      key={match.matchId}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        isDark ? 'bg-white/5' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          match.won 
                            ? 'bg-green-500/20 text-green-500' 
                            : match.isDraw 
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/20 text-red-500'
                        }`}>
                          {match.won ? 'W' : match.isDraw ? 'D' : 'L'}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            vs {match.opponent.userName}
                            {match.opponent.isBot && <span className="text-xs ml-1 opacity-50">(Bot)</span>}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                            {match.userScore} - {match.opponentScore}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl">
                        {SUBJECTS.find(s => s.id === match.subject)?.icon}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RankedMode

