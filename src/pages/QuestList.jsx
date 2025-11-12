import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Search, 
  Filter,
  BookOpen,
  Plus,
  Clock,
  User,
  TrendingUp
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { getApprovedQuests } from '../services/questRequestService'

const SUBJECTS = [
  { id: 'italian', name: 'Italian Language' },
  { id: 'english', name: 'English Language' },
  { id: 'spanish', name: 'Spanish Language' },
  { id: 'french', name: 'French Language' },
  { id: 'german', name: 'German Language' },
  { id: 'mandarin', name: 'Mandarin Chinese' },
  { id: 'business', name: 'Business & Entrepreneurship' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'computerScience', name: 'Computer Science' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
  { id: 'history', name: 'History' },
  { id: 'geography', name: 'Geography' }
]

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', color: 'green' },
  { value: 'intermediate', label: 'Intermediate', color: 'yellow' },
  { value: 'advanced', label: 'Advanced', color: 'red' }
]

const QuestList = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { user } = useSimpleAuth()
  const { showError } = useNotification()

  const [quests, setQuests] = useState([])
  const [filteredQuests, setFilteredQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  useEffect(() => {
    loadQuests()
  }, [])

  useEffect(() => {
    filterQuests()
  }, [quests, searchTerm, selectedSubject, selectedDifficulty])

  const loadQuests = async () => {
    setLoading(true)
    try {
      const result = await getApprovedQuests()
      if (result.success) {
        setQuests(result.quests || [])
      } else {
        showError(result.error || 'Failed to load quests', 'Error')
      }
    } catch (error) {
      console.error('Error loading quests:', error)
      showError('An error occurred while loading quests', 'Error')
    } finally {
      setLoading(false)
    }
  }

  const filterQuests = () => {
    let filtered = [...quests]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(quest =>
        quest.title?.toLowerCase().includes(term) ||
        quest.description?.toLowerCase().includes(term) ||
        quest.createdByName?.toLowerCase().includes(term)
      )
    }

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(quest => quest.subject === selectedSubject)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(quest => quest.difficulty === selectedDifficulty)
    }

    setFilteredQuests(filtered)
  }

  const handleQuestClick = (quest) => {
    // Navigate to QuestExecution with quest data
    navigate(`/quest-execution/${quest.subject}/${quest.category}/${quest.questId || quest.id}`, {
      state: { quest }
    })
  }

  const getDifficultyColor = (difficulty) => {
    const diff = DIFFICULTIES.find(d => d.value === difficulty)
    if (!diff) return 'gray'
    
    if (isDark) {
      switch (diff.color) {
        case 'green': return 'bg-green-500/20 text-green-400 border-green-400/30'
        case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
        case 'red': return 'bg-red-500/20 text-red-400 border-red-400/30'
        default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
      }
    } else {
      switch (diff.color) {
        case 'green': return 'bg-green-100 text-green-700 border-green-200'
        case 'yellow': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        case 'red': return 'bg-red-100 text-red-700 border-red-200'
        default: return 'bg-gray-100 text-gray-700 border-gray-200'
      }
    }
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
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute top-1/2 right-12 h-64 w-64 rounded-full bg-pink-400/25 blur-[120px]" />
        <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-blue-400/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/quest-academy')}
              className={`p-3 rounded-xl transition-all ${
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Study Quests
              </h1>
              <p className={`mt-1 text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                Explore quests created by the community
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/create-quest')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition shadow-lg ${
              isDark
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            <Plus className="h-5 w-5" />
            Create Quest
          </button>
        </div>

        {/* Filters */}
        <div className={`rounded-[32px] border px-6 py-6 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                isDark ? 'text-white/50' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search quests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                    : 'bg-white border-gray-300 text-slate-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={`px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDark
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white border-gray-300 text-slate-900'
              }`}
            >
              <option value="all">All Subjects</option>
              {SUBJECTS.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDark
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white border-gray-300 text-slate-900'
              }`}
            >
              <option value="all">All Difficulties</option>
              {DIFFICULTIES.map(diff => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quest List */}
        {loading ? (
          <div className={`rounded-[32px] border px-8 py-16 shadow-2xl backdrop-blur-xl text-center ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Loading quests...
            </p>
          </div>
        ) : filteredQuests.length === 0 ? (
          <div className={`rounded-[32px] border px-8 py-16 shadow-2xl backdrop-blur-xl text-center ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <BookOpen className={`h-16 w-16 mx-auto mb-4 ${
              isDark ? 'text-white/30' : 'text-gray-300'
            }`} />
            <h3 className={`text-xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              No quests found
            </h3>
            <p className={`${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              {searchTerm || selectedSubject !== 'all' || selectedDifficulty !== 'all'
                ? 'Try adjusting your filters'
                : 'Be the first to create a quest!'}
            </p>
            {!searchTerm && selectedSubject === 'all' && selectedDifficulty === 'all' && (
              <button
                onClick={() => navigate('/create-quest')}
                className={`mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                <Plus className="h-5 w-5" />
                Create Your First Quest
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => (
              <div
                key={quest.id}
                onClick={() => handleQuestClick(quest)}
                className={`rounded-2xl border p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl ${
                  isDark
                    ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35 hover:border-purple-400/50'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {quest.title}
                    </h3>
                    <p className={`text-sm line-clamp-2 ${
                      isDark ? 'text-white/70' : 'text-slate-600'
                    }`}>
                      {quest.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    getDifficultyColor(quest.difficulty)
                  }`}>
                    {DIFFICULTIES.find(d => d.value === quest.difficulty)?.label || quest.difficulty}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isDark
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                      : 'bg-purple-100 text-purple-700 border border-purple-200'
                  }`}>
                    {SUBJECTS.find(s => s.id === quest.subject)?.name || quest.subject}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isDark
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {quest.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className={`flex items-center gap-2 ${
                    isDark ? 'text-white/60' : 'text-slate-500'
                  }`}>
                    <User className="h-4 w-4" />
                    <span>{quest.createdByName || 'Anonymous'}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${
                    isDark ? 'text-white/60' : 'text-slate-500'
                  }`}>
                    <BookOpen className="h-4 w-4" />
                    <span>{quest.questions?.length || 0} questions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestList

