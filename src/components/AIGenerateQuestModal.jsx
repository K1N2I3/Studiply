import React, { useState, useEffect, useRef } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { generateAIQuest } from '../services/aiQuestService'

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
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]

const AIGenerateQuestModal = ({ isOpen, onClose, onQuestGenerated }) => {
  const { isDark } = useTheme()
  const { user } = useSimpleAuth()
  const { showSuccess, showError } = useNotification()

  const [subject, setSubject] = useState('')
  const [prompt, setPrompt] = useState('')
  const [difficulty, setDifficulty] = useState('beginner')
  const [questionCount, setQuestionCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  const handleGenerate = async () => {
    if (!user) {
      showError('Please log in to generate AI quests', 'Authentication Required')
      return
    }

    if (!subject) {
      showError('Please select a subject', 'Validation Error')
      return
    }

    if (!prompt.trim()) {
      showError('Please enter a description of what you want to learn', 'Validation Error')
      return
    }

    if (prompt.trim().length < 10) {
      showError('Please provide a more detailed description (at least 10 characters)', 'Validation Error')
      return
    }

    setLoading(true)
    setElapsedTime(0)
    setLoadingMessage('正在连接 AI 服务...')
    
    // Start timer
    const startTime = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedTime(elapsed)
      
      // Update loading messages based on elapsed time
      if (elapsed < 5) {
        setLoadingMessage('正在分析您的需求...')
      } else if (elapsed < 10) {
        setLoadingMessage('AI 正在生成问题...')
      } else if (elapsed < 20) {
        setLoadingMessage('正在优化问题内容...')
      } else {
        setLoadingMessage('即将完成，请稍候...')
      }
    }, 1000)

    try {
      const result = await generateAIQuest(
        user.id,
        user.name || user.email,
        subject,
        prompt.trim(),
        difficulty,
        questionCount
      )

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      
      if (result.success) {
        const totalTime = Math.floor((Date.now() - startTime) / 1000)
        showSuccess(`AI quest 生成成功！用时 ${totalTime} 秒`, 'Success')
        if (onQuestGenerated) {
          onQuestGenerated(result.quest)
        }
        // Reset form
        setSubject('')
        setPrompt('')
        setDifficulty('beginner')
        setQuestionCount(5)
        onClose()
      } else {
        showError(result.error || 'Failed to generate quest', 'Error')
      }
    } catch (error) {
      console.error('Error generating AI quest:', error)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      showError('An error occurred while generating the quest', 'Error')
    } finally {
      setLoading(false)
      setLoadingMessage('')
      setElapsedTime(0)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl ${
        isDark
          ? 'border-white/10 bg-gradient-to-br from-[#1a1240] to-[#09071b]'
          : 'border-gray-200 bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <Sparkles className={`h-5 w-5 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                AI Generate Quest
              </h2>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                Let AI create personalized questions for you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              isDark
                ? 'hover:bg-white/10 text-white/70 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center ${
            isDark ? 'bg-[#1a1240]/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'
          }`}>
            <div className="text-center space-y-4 px-8">
              <div className="relative">
                <Loader2 className={`h-16 w-16 mx-auto animate-spin ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
                <Sparkles className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 ${
                  isDark ? 'text-purple-300' : 'text-purple-500'
                } animate-pulse`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {loadingMessage || '正在生成中...'}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>
                  通常需要 10-30 秒，请耐心等待
                </p>
                {elapsedTime > 0 && (
                  <p className={`text-xs mt-2 ${
                    isDark ? 'text-white/50' : 'text-gray-500'
                  }`}>
                    已用时: {elapsedTime} 秒
                  </p>
                )}
              </div>
              <div className={`w-64 h-1 rounded-full overflow-hidden ${
                isDark ? 'bg-white/10' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ${
                    elapsedTime > 0 ? 'animate-pulse' : ''
                  }`}
                  style={{ 
                    width: `${Math.min((elapsedTime / 30) * 100, 90)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`p-6 space-y-6 ${loading ? 'opacity-30 pointer-events-none' : ''}`}>
          {/* Subject Selection */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDark ? 'text-white/80' : 'text-slate-700'
            }`}>
              Subject *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDark
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white border-gray-300 text-slate-900'
              }`}
              required
            >
              <option value="">Select a subject</option>
              {SUBJECTS.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Input */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDark ? 'text-white/80' : 'text-slate-700'
            }`}>
              What do you want to learn? *
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Italian verb conjugations in present tense, or basic algebra equations, or World War II events..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                isDark
                  ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                  : 'bg-white border-gray-300 text-slate-900 placeholder-gray-400'
              }`}
              required
            />
            <p className={`mt-1 text-xs ${
              isDark ? 'text-white/50' : 'text-gray-500'
            }`}>
              Describe the topic or concept you want to practice. Be as specific as possible.
            </p>
          </div>

          {/* Difficulty and Question Count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/80' : 'text-slate-700'
              }`}>
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white border-gray-300 text-slate-900'
                }`}
              >
                {DIFFICULTIES.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/80' : 'text-slate-700'
              }`}>
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white border-gray-300 text-slate-900'
                }`}
              >
                {[3, 5, 7, 10].map(num => (
                  <option key={num} value={num}>
                    {num} questions
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !subject || !prompt.trim()}
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition shadow-lg ${
              isDark
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Quest
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIGenerateQuestModal

