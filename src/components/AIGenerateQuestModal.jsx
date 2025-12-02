import React, { useState } from 'react'
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
    try {
      const result = await generateAIQuest(
        user.id,
        user.name || user.email,
        subject,
        prompt.trim(),
        difficulty,
        questionCount
      )

      if (result.success) {
        showSuccess('AI quest generated successfully!', 'Success')
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
      showError('An error occurred while generating the quest', 'Error')
    } finally {
      setLoading(false)
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

        {/* Content */}
        <div className="p-6 space-y-6">
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

