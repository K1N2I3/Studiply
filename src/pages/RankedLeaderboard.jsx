import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Trophy, 
  ArrowLeft, 
  Medal,
  Crown,
  TrendingUp,
  Users,
  Star,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  BookOpen,
  Languages,
  Landmark,
  Globe2,
  Code2
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import RankBadge from '../components/RankBadge'
import { getLeaderboard, RANK_TIERS } from '../services/rankedService'

const SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', Icon: Calculator },
  { id: 'physics', name: 'Physics', Icon: Atom },
  { id: 'chemistry', name: 'Chemistry', Icon: FlaskConical },
  { id: 'biology', name: 'Biology', Icon: Dna },
  { id: 'english', name: 'English', Icon: BookOpen },
  { id: 'italian', name: 'Italian', Icon: Languages },
  { id: 'history', name: 'History', Icon: Landmark },
  { id: 'geography', name: 'Geography', Icon: Globe2 },
  { id: 'computerScience', name: 'Computer Science', Icon: Code2 }
]

const RankedLeaderboard = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { user } = useSimpleAuth()

  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].id)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    loadLeaderboard()
  }, [selectedSubject])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const result = await getLeaderboard(selectedSubject, 100)
      if (result.success) {
        setLeaderboard(result.leaderboard)
        
        // Find user's position
        if (user?.id) {
          const userIndex = result.leaderboard.findIndex(entry => entry.userId === user.id)
          if (userIndex !== -1) {
            setUserRank(userIndex + 1)
          } else {
            setUserRank(null)
          }
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />
    return <span className="text-lg font-bold">{rank}</span>
  }

  const getRankBackground = (rank, isDark) => {
    if (rank === 1) return isDark ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-yellow-100 border-yellow-300'
    if (rank === 2) return isDark ? 'bg-gray-500/20 border-gray-500/30' : 'bg-gray-100 border-gray-300'
    if (rank === 3) return isDark ? 'bg-orange-500/20 border-orange-500/30' : 'bg-orange-100 border-orange-300'
    return isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#0a0615] via-[#1a0a2e] to-[#0d0520] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-slate-900'
    }`}>
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 right-1/4 h-96 w-96 rounded-full blur-3xl ${
          isDark ? 'bg-yellow-600/20' : 'bg-yellow-300/40'
        }`} />
        <div className={`absolute bottom-20 -left-20 h-80 w-80 rounded-full blur-3xl ${
          isDark ? 'bg-purple-600/15' : 'bg-purple-200/50'
        }`} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/ranked')}
            className={`p-3 rounded-2xl transition-all ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-white text-slate-700 hover:bg-slate-50 shadow-lg'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-yellow-600 to-orange-600' 
                : 'bg-gradient-to-br from-yellow-500 to-orange-500'
            } shadow-xl shadow-yellow-500/30`}>
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Leaderboard
              </h1>
              <p className={`mt-1 text-sm ${
                isDark ? 'text-white/60' : 'text-slate-500'
              }`}>
                Top players in each subject
              </p>
            </div>
          </div>
        </div>

        {/* Subject Tabs */}
        <div className={`rounded-2xl p-2 mb-6 overflow-x-auto ${
          isDark ? 'bg-white/5' : 'bg-white shadow-lg'
        }`}>
          <div className="flex gap-2 min-w-max">
            {SUBJECTS.map(subject => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedSubject === subject.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : isDark
                      ? 'text-white/70 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <subject.Icon className="h-4 w-4 mr-2" />
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {/* User's Position (if ranked) */}
        {userRank && (
          <div className={`rounded-2xl p-4 mb-6 ${
            isDark 
              ? 'bg-purple-500/20 border border-purple-500/30' 
              : 'bg-purple-100 border border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Your Ranking
                </span>
              </div>
              <div className={`text-2xl font-black ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                #{userRank}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className={`rounded-3xl border overflow-hidden ${
          isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-xl'
        }`}>
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className={isDark ? 'text-white/60' : 'text-slate-500'}>Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <Users className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
              <p className={`text-lg font-semibold ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                No rankings yet
              </p>
              <p className={`text-sm mt-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Be the first to compete in {SUBJECTS.find(s => s.id === selectedSubject)?.name}!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {/* Top 3 Podium */}
              <div className="p-6 grid md:grid-cols-3 gap-4">
                {/* 2nd Place */}
                {leaderboard[1] && (
                  <div className={`order-1 md:order-1 p-4 rounded-2xl border text-center ${
                    getRankBackground(2, isDark)
                  }`}>
                    <div className="mb-2">{getRankIcon(2)}</div>
                    <RankBadge tier={leaderboard[1].tier} size="sm" showPoints={false} />
                    <p className={`mt-2 font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {leaderboard[1].userName}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      {leaderboard[1].points} pts
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                      {leaderboard[1].wins}W - {leaderboard[1].losses}L
                    </p>
                  </div>
                )}

                {/* 1st Place */}
                {leaderboard[0] && (
                  <div className={`order-0 md:order-2 p-6 rounded-2xl border text-center transform md:-translate-y-4 ${
                    getRankBackground(1, isDark)
                  }`}>
                    <div className="mb-2">{getRankIcon(1)}</div>
                    <RankBadge tier={leaderboard[0].tier} size="md" showPoints={false} />
                    <p className={`mt-3 font-bold text-lg truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {leaderboard[0].userName}
                    </p>
                    <p className={`text-lg font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {leaderboard[0].points} pts
                    </p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      {leaderboard[0].wins}W - {leaderboard[0].losses}L
                    </p>
                    {leaderboard[0].winStreak > 0 && (
                      <p className={`text-xs mt-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                        🔥 {leaderboard[0].winStreak} win streak
                      </p>
                    )}
                  </div>
                )}

                {/* 3rd Place */}
                {leaderboard[2] && (
                  <div className={`order-2 md:order-3 p-4 rounded-2xl border text-center ${
                    getRankBackground(3, isDark)
                  }`}>
                    <div className="mb-2">{getRankIcon(3)}</div>
                    <RankBadge tier={leaderboard[2].tier} size="sm" showPoints={false} />
                    <p className={`mt-2 font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {leaderboard[2].userName}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      {leaderboard[2].points} pts
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                      {leaderboard[2].wins}W - {leaderboard[2].losses}L
                    </p>
                  </div>
                )}
              </div>

              {/* Rest of leaderboard */}
              {leaderboard.slice(3).map((entry, index) => {
                const rank = index + 4
                const isCurrentUser = user?.id === entry.userId
                
                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-4 transition-colors ${
                      isCurrentUser
                        ? isDark ? 'bg-purple-500/10' : 'bg-purple-50'
                        : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                      isDark ? 'bg-white/10 text-white/80' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {rank}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {entry.userName}
                          {isCurrentUser && (
                            <span className={`ml-2 text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                              (You)
                            </span>
                          )}
                        </p>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        {entry.wins}W - {entry.losses}L
                        {entry.winStreak > 0 && (
                          <span className="ml-2">🔥 {entry.winStreak}</span>
                        )}
                      </p>
                    </div>

                    {/* Rank Badge */}
                    <RankBadge tier={entry.tier} size="sm" showPoints={false} showName={false} />

                    {/* Points */}
                    <div className={`text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <p className="font-bold">{entry.points}</p>
                      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>points</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RankedLeaderboard

