import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle,
  X,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { createQuestRequest } from '../services/questRequestService'

// Subject definitions
const SUBJECTS = [
  { id: 'italian', name: 'Italian Language', categories: ['grammar', 'vocabulary', 'conversation'] },
  { id: 'english', name: 'English Language', categories: ['grammar', 'literature', 'writing'] },
  { id: 'spanish', name: 'Spanish Language', categories: ['grammar', 'vocabulary', 'conversation'] },
  { id: 'french', name: 'French Language', categories: ['grammar', 'vocabulary', 'conversation'] },
  { id: 'german', name: 'German Language', categories: ['grammar', 'vocabulary'] },
  { id: 'mandarin', name: 'Mandarin Chinese', categories: ['characters', 'pinyin', 'conversation'] },
  { id: 'business', name: 'Business & Entrepreneurship', categories: ['strategy', 'finance', 'marketing'] },
  { id: 'philosophy', name: 'Philosophy', categories: ['ethics', 'logic', 'metaphysics'] },
  { id: 'mathematics', name: 'Mathematics', categories: ['algebra', 'geometry', 'calculus'] },
  { id: 'computerScience', name: 'Computer Science', categories: ['programming', 'algorithms', 'data-structures'] },
  { id: 'chemistry', name: 'Chemistry', categories: ['organic', 'inorganic', 'physical'] },
  { id: 'biology', name: 'Biology', categories: ['cell-biology', 'genetics', 'ecology'] },
  { id: 'history', name: 'History', categories: ['ancient', 'medieval', 'modern'] },
  { id: 'geography', name: 'Geography', categories: ['physical', 'human', 'environmental'] }
]

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]

const CreateQuest = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { user } = useSimpleAuth()
  const { showSuccess, showError } = useNotification()

  const [step, setStep] = useState(1) // 1 = Basic Info, 2 = Questions
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    category: '',
    difficulty: 'beginner',
    questionType: 'multiple-choice'
  })

  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }
  ])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)

  const handleSubjectChange = (subjectId) => {
    const subject = SUBJECTS.find(s => s.id === subjectId)
    setSelectedSubject(subject)
    setFormData({
      ...formData,
      subject: subjectId,
      category: ''
    })
  }

  const validateBasicInfo = () => {
    if (!formData.title.trim()) {
      showError('Please enter a quest title', 'Validation Error')
      return false
    }
    if (!formData.subject) {
      showError('Please select a subject', 'Validation Error')
      return false
    }
    if (!formData.category) {
      showError('Please select a category', 'Validation Error')
      return false
    }
    return true
  }

  const handleStartCreatingQuestions = () => {
    if (!validateBasicInfo()) {
      return
    }
    setStep(2)
  }

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: formData.questionType,
      question: '',
      options: formData.questionType === 'multiple-choice' ? ['', '', '', ''] : [],
      correctAnswer: formData.questionType === 'multiple-choice' ? 0 : '',
      correctAnswers: formData.questionType === 'fill-in-blank' ? [''] : [],
      explanation: ''
    }
    
    setQuestions([...questions, newQuestion])
    // Navigate to the new question
    setCurrentQuestionIndex(questions.length)
  }

  const removeQuestion = (questionIndex) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, idx) => idx !== questionIndex)
      setQuestions(newQuestions)
      
      // Adjust current index if needed
      if (currentQuestionIndex >= newQuestions.length) {
        setCurrentQuestionIndex(newQuestions.length - 1)
      } else if (currentQuestionIndex > questionIndex) {
        setCurrentQuestionIndex(currentQuestionIndex - 1)
      }
    } else {
      showError('At least one question is required', 'Error')
    }
  }

  const updateQuestion = (field, value) => {
    const newQuestions = [...questions]
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      [field]: value
    }
    setQuestions(newQuestions)
  }

  const addOption = () => {
    const newQuestions = [...questions]
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      options: [...newQuestions[currentQuestionIndex].options, '']
    }
    setQuestions(newQuestions)
  }

  const removeOption = (optionIndex) => {
    const newQuestions = [...questions]
    const currentQuestion = newQuestions[currentQuestionIndex]
    const newOptions = currentQuestion.options.filter((_, idx) => idx !== optionIndex)
    newQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      options: newOptions,
      correctAnswer: currentQuestion.correctAnswer >= newOptions.length ? 0 : currentQuestion.correctAnswer
    }
    setQuestions(newQuestions)
  }

  const updateOption = (optionIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      options: newQuestions[currentQuestionIndex].options.map((opt, idx) => idx === optionIndex ? value : opt)
    }
    setQuestions(newQuestions)
  }

  const addCorrectAnswer = () => {
    const newQuestions = [...questions]
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      correctAnswers: [...(newQuestions[currentQuestionIndex].correctAnswers || []), '']
    }
    setQuestions(newQuestions)
  }

  const removeCorrectAnswer = (answerIndex) => {
    const newQuestions = [...questions]
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      correctAnswers: newQuestions[currentQuestionIndex].correctAnswers.filter((_, idx) => idx !== answerIndex)
    }
    setQuestions(newQuestions)
  }

  const updateCorrectAnswer = (answerIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      correctAnswers: newQuestions[currentQuestionIndex].correctAnswers.map((ans, idx) => idx === answerIndex ? value : ans)
    }
    setQuestions(newQuestions)
  }

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        showError(`Question ${i + 1}: Please enter the question text`, 'Validation Error')
        setCurrentQuestionIndex(i)
        return false
      }
      
      if (q.type === 'multiple-choice') {
        if (q.options.length < 2) {
          showError(`Question ${i + 1}: Please add at least 2 options`, 'Validation Error')
          setCurrentQuestionIndex(i)
          return false
        }
        if (q.options.some(opt => !opt.trim())) {
          showError(`Question ${i + 1}: Please fill in all options`, 'Validation Error')
          setCurrentQuestionIndex(i)
          return false
        }
      } else if (q.type === 'fill-in-blank') {
        if (!q.correctAnswers || q.correctAnswers.length === 0) {
          showError(`Question ${i + 1}: Please add at least one correct answer`, 'Validation Error')
          setCurrentQuestionIndex(i)
          return false
        }
        if (q.correctAnswers.some(ans => !ans.trim())) {
          showError(`Question ${i + 1}: Please fill in all correct answers`, 'Validation Error')
          setCurrentQuestionIndex(i)
          return false
        }
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      showError('Please log in to create a quest', 'Authentication Required')
      navigate('/login')
      return
    }

    if (!validateQuestions()) {
      return
    }

    setLoading(true)

    try {
      const formattedQuestions = questions.map(q => {
        if (q.type === 'multiple-choice') {
          return {
            type: 'multiple-choice',
            question: q.question.trim(),
            options: q.options.map(opt => opt.trim()),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation.trim() || ''
          }
        } else {
          return {
            type: 'fill-in-blank',
            question: q.question.trim(),
            correctAnswers: q.correctAnswers.map(ans => ans.trim()),
            explanation: q.explanation.trim() || ''
          }
        }
      })

      const questData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject,
        category: formData.category,
        difficulty: formData.difficulty,
        questionType: formData.questionType,
        questions: formattedQuestions
      }

      const result = await createQuestRequest(user.id, user.name || user.email, questData)

      if (result.success) {
        showSuccess('Quest created successfully! It will be reviewed by an administrator.', 'Quest Created')
        setTimeout(() => {
          navigate('/quest-academy')
        }, 2000)
      } else {
        showError(result.error || 'Failed to create quest', 'Error')
      }
    } catch (error) {
      console.error('Error creating quest:', error)
      showError('An error occurred while creating the quest', 'Error')
    } finally {
      setLoading(false)
    }
  }

  const changeQuestionType = (newType) => {
    setFormData({ ...formData, questionType: newType })
    const newQuestions = [...questions]
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      type: newType,
      options: newType === 'multiple-choice' ? (newQuestions[currentQuestionIndex].options.length > 0 ? newQuestions[currentQuestionIndex].options : ['', '', '', '']) : [],
      correctAnswer: newType === 'multiple-choice' ? 0 : '',
      correctAnswers: newType === 'fill-in-blank' ? (newQuestions[currentQuestionIndex].correctAnswers && newQuestions[currentQuestionIndex].correctAnswers.length > 0 ? newQuestions[currentQuestionIndex].correctAnswers : ['']) : []
    }
    setQuestions(newQuestions)
  }

  const currentQuestion = questions[currentQuestionIndex]

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

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-14 hide-scrollbar">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => step === 1 ? navigate('/quest-academy') : setStep(1)}
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
              Create Study Quest
            </h1>
            <p className={`mt-1 text-sm ${
              isDark ? 'text-white/70' : 'text-slate-600'
            }`}>
              {step === 1 
                ? 'Fill in the basic information about your quest'
                : `Question ${currentQuestionIndex + 1} of ${questions.length}`
              }
            </p>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleStartCreatingQuestions(); }} className="space-y-6">
            <div className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
              isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Basic Information
              </h2>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/80' : 'text-slate-700'
                  }`}>
                    Quest Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Italian Grammar Basics"
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                        : 'bg-white border-gray-300 text-slate-900 placeholder-gray-400'
                    }`}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/80' : 'text-slate-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what students will learn from this quest..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                        : 'bg-white border-gray-300 text-slate-900 placeholder-gray-400'
                    }`}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/80' : 'text-slate-700'
                  }`}>
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                    required
                  >
                    <option value="">Select a subject</option>
                    {SUBJECTS.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                {selectedSubject && (
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDark ? 'text-white/80' : 'text-slate-700'
                    }`}>
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        isDark
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white border-gray-300 text-slate-900'
                      }`}
                      required
                    >
                      <option value="">Select a category</option>
                      {selectedSubject.categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Difficulty */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/80' : 'text-slate-700'
                  }`}>
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isDark
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-white border-gray-300 text-slate-900'
                    }`}
                    required
                  >
                    {DIFFICULTIES.map(diff => (
                      <option key={diff.value} value={diff.value}>
                        {diff.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start Creating Questions Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className={`w-full px-6 py-4 rounded-xl font-semibold transition shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    Start to Create Questions
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Create Questions */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
              isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
            }`}>
              {/* Question Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentQuestionIndex > 0) {
                        setCurrentQuestionIndex(currentQuestionIndex - 1)
                      }
                    }}
                    disabled={currentQuestionIndex === 0}
                    className={`p-2 rounded-xl transition ${
                      currentQuestionIndex === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${
                      isDark ? 'text-white/80' : 'text-slate-600'
                    }`}>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentQuestionIndex < questions.length - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1)
                      }
                    }}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`p-2 rounded-xl transition ${
                      currentQuestionIndex === questions.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(currentQuestionIndex)}
                      className={`p-2 rounded-xl transition ${
                        isDark
                          ? 'text-red-400 hover:bg-red-500/20'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={addQuestion}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
                      isDark
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    Add Question
                  </button>
                </div>
              </div>

              {/* Current Question */}
              {currentQuestion && (
                <div className="space-y-6">
                  {/* Question Type Toggle */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDark ? 'text-white/80' : 'text-slate-700'
                    }`}>
                      Question Type *
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => changeQuestionType('multiple-choice')}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                          currentQuestion.type === 'multiple-choice'
                            ? isDark
                              ? 'border-purple-400 bg-purple-500/20 text-white'
                              : 'border-purple-500 bg-purple-50 text-purple-700'
                            : isDark
                              ? 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                              : 'border-gray-200 bg-white text-slate-700 hover:border-gray-300'
                        }`}
                      >
                        Multiple Choice
                      </button>
                      <button
                        type="button"
                        onClick={() => changeQuestionType('fill-in-blank')}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                          currentQuestion.type === 'fill-in-blank'
                            ? isDark
                              ? 'border-purple-400 bg-purple-500/20 text-white'
                              : 'border-purple-500 bg-purple-50 text-purple-700'
                            : isDark
                              ? 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                              : 'border-gray-200 bg-white text-slate-700 hover:border-gray-300'
                        }`}
                      >
                        Fill in the Blank
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDark ? 'text-white/80' : 'text-slate-700'
                    }`}>
                      Question Text *
                    </label>
                    <textarea
                      value={currentQuestion.question}
                      onChange={(e) => updateQuestion('question', e.target.value)}
                      placeholder={currentQuestion.type === 'fill-in-blank' 
                        ? 'e.g., The capital of Italy is ___.'
                        : 'e.g., What is the capital of Italy?'
                      }
                      rows={2}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                        isDark
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                          : 'bg-white border-gray-300 text-slate-900 placeholder-gray-400'
                      }`}
                      required
                    />
                  </div>

                  {/* Multiple Choice Options */}
                  {currentQuestion.type === 'multiple-choice' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className={`text-sm font-semibold ${
                          isDark ? 'text-white/80' : 'text-slate-700'
                        }`}>
                          Options *
                        </label>
                        <button
                          type="button"
                          onClick={addOption}
                          className={`text-xs px-2 py-1 rounded-lg transition ${
                            isDark
                              ? 'bg-white/10 text-white hover:bg-white/20'
                              : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                          }`}
                        >
                          <Plus className="h-3 w-3 inline mr-1" />
                          Add Option
                        </button>
                      </div>
                      {currentQuestion.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correct-${currentQuestion.id}`}
                            checked={currentQuestion.correctAnswer === optIndex}
                            onChange={() => updateQuestion('correctAnswer', optIndex)}
                            className="w-5 h-5 text-purple-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(optIndex, e.target.value)}
                            placeholder={`Option ${optIndex + 1}`}
                            className={`flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              isDark
                                ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                                : 'bg-white border-gray-300 text-slate-900 placeholder-gray-400'
                            }`}
                            required
                          />
                          {currentQuestion.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(optIndex)}
                              className={`p-2 rounded-lg transition ${
                                isDark
                                  ? 'text-red-400 hover:bg-red-500/20'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fill in the Blank Answers */}
                  {currentQuestion.type === 'fill-in-blank' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className={`text-sm font-semibold ${
                          isDark ? 'text-white/80' : 'text-slate-700'
                        }`}>
                          Correct Answers * (Multiple accepted)
                        </label>
                        <button
                          type="button"
                          onClick={addCorrectAnswer}
                          className={`text-xs px-2 py-1 rounded-lg transition ${
                            isDark
                              ? 'bg-white/10 text-white hover:bg-white/20'
                              : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                          }`}
                        >
                          <Plus className="h-3 w-3 inline mr-1" />
                          Add Answer
                        </button>
                      </div>
                      {(currentQuestion.correctAnswers || ['']).map((answer, ansIndex) => (
                        <div key={ansIndex} className="flex items-center gap-3">
                          <CheckCircle className={`h-5 w-5 ${
                            isDark ? 'text-green-400' : 'text-green-600'
                          }`} />
                          <input
                            type="text"
                            value={answer}
                            onChange={(e) => updateCorrectAnswer(ansIndex, e.target.value)}
                            placeholder={`Correct answer ${ansIndex + 1} (e.g., Rome, Roma, ROME)`}
                            className={`flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              isDark
                                ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                                : 'bg-white border-gray-300 text-slate-900 placeholder-gray-400'
                            }`}
                            required
                          />
                          {(currentQuestion.correctAnswers || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCorrectAnswer(ansIndex)}
                              className={`p-2 rounded-lg transition ${
                                isDark
                                  ? 'text-red-400 hover:bg-red-500/20'
                                  : 'text-red-600 hover:bg-red-50'
                              }`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Explanation */}
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDark ? 'text-white/80' : 'text-slate-700'
                    }`}>
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={currentQuestion.explanation}
                      onChange={(e) => updateQuestion('explanation', e.target.value)}
                      placeholder="Explain why this is the correct answer..."
                      rows={2}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                        isDark
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/50'
                          : 'bg-white border-gray-300 text-slate-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Navigation and Submit */}
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      : 'bg-white text-slate-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Back to Basic Info
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Save className="h-5 w-5" />
                      Submit for Review
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreateQuest
