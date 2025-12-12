import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  FileText, 
  Lightbulb, 
  ChevronRight,
  Send,
  Loader2,
  CheckCircle,
  HelpCircle,
  X,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Brain,
  Target,
  MessageCircle,
  RefreshCw
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { analyzeHomework, getNextHint, checkStudentAnswer, startNewProblem } from '../services/homeworkHelperService'

const SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', icon: '📐' },
  { id: 'physics', name: 'Physics', icon: '⚡' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
  { id: 'biology', name: 'Biology', icon: '🧬' },
  { id: 'english', name: 'English', icon: '📝' },
  { id: 'italian', name: 'Italian', icon: '🇮🇹' },
  { id: 'spanish', name: 'Spanish', icon: '🇪🇸' },
  { id: 'french', name: 'French', icon: '🇫🇷' },
  { id: 'history', name: 'History', icon: '📜' },
  { id: 'geography', name: 'Geography', icon: '🌍' },
  { id: 'computerScience', name: 'Computer Science', icon: '💻' },
  { id: 'other', name: 'Other', icon: '📚' }
]

const HomeworkHelper = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { user } = useSimpleAuth()
  const { showSuccess, showError } = useNotification()
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)

  // State
  const [selectedSubject, setSelectedSubject] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [problemText, setProblemText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  
  // Learning session state
  const [sessionActive, setSessionActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [hints, setHints] = useState([])
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [problemSolved, setProblemSolved] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      showError('Please upload an image (JPEG, PNG, GIF, WebP) or PDF file', 'Invalid File')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB', 'File Too Large')
      return
    }

    setUploadedImage(file)
    
    // Create preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null) // PDF doesn't get a preview
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      const fakeEvent = { target: { files: [file] } }
      handleFileUpload(fakeEvent)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const clearUpload = () => {
    setUploadedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleStartAnalysis = async () => {
    if (!user) {
      showError('Please log in to use the Homework Helper', 'Authentication Required')
      return
    }

    if (!selectedSubject) {
      showError('Please select a subject', 'Subject Required')
      return
    }

    if (!uploadedImage && !problemText.trim()) {
      showError('Please upload an image or describe your problem', 'Input Required')
      return
    }

    setIsAnalyzing(true)
    setMessages([])

    try {
      const result = await analyzeHomework({
        userId: user.id,
        subject: selectedSubject,
        imageData: imagePreview,
        problemText: problemText.trim(),
        fileName: uploadedImage?.name
      })

      if (result.success) {
        setSessionId(result.sessionId)
        setSteps(result.steps || [])
        setHints(result.hints || [])
        setCurrentStep(0)
        setSessionActive(true)
        setAnalysisComplete(true)
        
        // Add initial message from tutor
        setMessages([{
          type: 'tutor',
          content: result.initialMessage || "I've analyzed your homework problem! Let's work through it together step by step. I won't give you the answer directly - instead, I'll guide you to understand the concepts and find the solution yourself. Ready to begin?",
          timestamp: new Date()
        }])

        // Add the first step guidance if available
        if (result.steps && result.steps.length > 0) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              type: 'tutor',
              content: `**Step 1: ${result.steps[0].title}**\n\n${result.steps[0].guidance}`,
              timestamp: new Date()
            }])
          }, 1000)
        }

        showSuccess('Problem analyzed! Let\'s learn together.', 'Analysis Complete')
      } else {
        showError(result.error || 'Failed to analyze homework', 'Error')
      }
    } catch (error) {
      console.error('Error analyzing homework:', error)
      showError('An error occurred while analyzing your homework', 'Error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim() || isThinking) return

    const messageText = userInput.trim()
    setUserInput('')

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }])

    setIsThinking(true)

    try {
      const result = await checkStudentAnswer({
        sessionId,
        userId: user.id,
        answer: messageText,
        currentStep,
        steps
      })

      if (result.success) {
        // Add tutor response
        setMessages(prev => [...prev, {
          type: 'tutor',
          content: result.response,
          isCorrect: result.isCorrect,
          timestamp: new Date()
        }])

        // If the answer was correct, move to next step
        if (result.isCorrect && result.nextStep) {
          setCurrentStep(result.nextStep)
          
          // Add next step guidance after a delay
          if (result.nextStep < steps.length) {
            setTimeout(() => {
              setMessages(prev => [...prev, {
                type: 'tutor',
                content: `**Step ${result.nextStep + 1}: ${steps[result.nextStep].title}**\n\n${steps[result.nextStep].guidance}`,
                timestamp: new Date()
              }])
            }, 1500)
          }
        }

        // Check if problem is solved
        if (result.problemSolved) {
          setProblemSolved(true)
          setTimeout(() => {
            setMessages(prev => [...prev, {
              type: 'celebration',
              content: `🎉 **Congratulations!** You've successfully solved this problem!\n\nYou used ${hintsUsed} hint${hintsUsed !== 1 ? 's' : ''} and completed all ${steps.length} steps. Great job working through it yourself!`,
              timestamp: new Date()
            }])
          }, 2000)
        }
      } else {
        showError(result.error || 'Failed to process your answer', 'Error')
      }
    } catch (error) {
      console.error('Error checking answer:', error)
      setMessages(prev => [...prev, {
        type: 'tutor',
        content: "I'm having trouble processing that. Could you try rephrasing your answer?",
        timestamp: new Date()
      }])
    } finally {
      setIsThinking(false)
    }
  }

  const handleGetHint = async () => {
    if (isThinking) return

    setIsThinking(true)
    setHintsUsed(prev => prev + 1)

    try {
      const result = await getNextHint({
        sessionId,
        userId: user.id,
        currentStep,
        hintsUsed
      })

      if (result.success) {
        setMessages(prev => [...prev, {
          type: 'hint',
          content: `💡 **Hint:** ${result.hint}`,
          timestamp: new Date()
        }])
      } else {
        showError(result.error || 'Failed to get hint', 'Error')
      }
    } catch (error) {
      console.error('Error getting hint:', error)
      showError('Failed to get hint', 'Error')
    } finally {
      setIsThinking(false)
    }
  }

  const handleNewProblem = () => {
    setSessionActive(false)
    setAnalysisComplete(false)
    setUploadedImage(null)
    setImagePreview(null)
    setProblemText('')
    setSelectedSubject('')
    setMessages([])
    setSteps([])
    setHints([])
    setCurrentStep(0)
    setSessionId(null)
    setProblemSolved(false)
    setHintsUsed(0)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#0d0a1f] via-[#1a1040] to-[#0a0818] text-white'
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-slate-900'
    }`}>
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -left-20 h-96 w-96 rounded-full blur-3xl ${
          isDark ? 'bg-orange-500/20' : 'bg-orange-300/40'
        }`} />
        <div className={`absolute top-1/3 right-0 h-80 w-80 rounded-full blur-3xl ${
          isDark ? 'bg-amber-500/15' : 'bg-amber-200/50'
        }`} />
        <div className={`absolute bottom-20 left-1/4 h-64 w-64 rounded-full blur-3xl ${
          isDark ? 'bg-rose-500/15' : 'bg-rose-200/40'
        }`} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/quest-academy/quests')}
              className={`p-3 rounded-2xl transition-all ${
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 shadow-lg'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold mb-2 ${
                isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
              }`}>
                <Brain className="h-3.5 w-3.5" />
                AI Learning Companion
              </div>
              <h1 className={`text-3xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Homework Helper
              </h1>
              <p className={`mt-1 text-sm ${
                isDark ? 'text-white/60' : 'text-slate-500'
              }`}>
                Learn step-by-step, understand deeply
              </p>
            </div>
          </div>
          
          {sessionActive && (
            <button
              onClick={handleNewProblem}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition ${
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 shadow-lg'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              New Problem
            </button>
          )}
        </div>

        {!sessionActive ? (
          /* Upload Section */
          <div className={`rounded-3xl border shadow-2xl overflow-hidden ${
            isDark 
              ? 'border-white/10 bg-gradient-to-br from-white/8 via-white/5 to-transparent' 
              : 'border-orange-200/50 bg-white'
          }`}>
            {/* Subject Selection */}
            <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-orange-100'}`}>
              <label className={`block text-sm font-bold mb-4 ${
                isDark ? 'text-white/80' : 'text-slate-700'
              }`}>
                <BookOpen className="inline h-4 w-4 mr-2" />
                What subject is this homework for?
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedSubject === subject.id
                        ? isDark
                          ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30'
                          : 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30'
                        : isDark
                          ? 'bg-white/10 text-white/80 hover:bg-white/20'
                          : 'bg-orange-50 text-slate-700 hover:bg-orange-100'
                    }`}
                  >
                    <span className="mr-2">{subject.icon}</span>
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div className="p-6">
              <label className={`block text-sm font-bold mb-4 ${
                isDark ? 'text-white/80' : 'text-slate-700'
              }`}>
                <Camera className="inline h-4 w-4 mr-2" />
                Upload your homework (photo or file)
              </label>

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    isDark
                      ? 'border-white/20 hover:border-orange-400/50 hover:bg-white/5'
                      : 'border-orange-200 hover:border-orange-400 hover:bg-orange-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                    isDark ? 'bg-orange-500/20' : 'bg-orange-100'
                  }`}>
                    <Upload className={`h-8 w-8 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
                  </div>
                  <p className={`text-lg font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Drag & drop or click to upload
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    Supports JPEG, PNG, WebP, GIF, or PDF • Max 10MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Homework preview"
                    className="w-full max-h-80 object-contain rounded-2xl border border-white/10"
                  />
                  <button
                    onClick={clearUpload}
                    className={`absolute top-3 right-3 p-2 rounded-full transition ${
                      isDark 
                        ? 'bg-black/50 text-white hover:bg-black/70' 
                        : 'bg-white/90 text-slate-700 hover:bg-white shadow-lg'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Or text description */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-orange-200'}`} />
                </div>
                <div className="relative flex justify-center">
                  <span className={`px-4 text-sm font-medium ${
                    isDark ? 'bg-[#1a1040] text-white/50' : 'bg-white text-slate-500'
                  }`}>
                    or type your problem
                  </span>
                </div>
              </div>

              <textarea
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="Describe your homework problem in detail..."
                rows={4}
                className={`w-full px-5 py-4 rounded-2xl border resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/40'
                    : 'bg-orange-50/50 border-orange-200 text-slate-900 placeholder-slate-400'
                }`}
              />

              {/* Start Button */}
              <button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing || (!uploadedImage && !problemText.trim()) || !selectedSubject}
                className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  isAnalyzing || (!uploadedImage && !problemText.trim()) || !selectedSubject
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-[1.02] hover:shadow-xl'
                } ${
                  isDark
                    ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Analyzing your homework...
                  </>
                ) : (
                  <>
                    <Target className="h-6 w-6" />
                    Start Learning Session
                  </>
                )}
              </button>
            </div>

            {/* How it works */}
            <div className={`p-6 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-orange-100 bg-orange-50/30'}`}>
              <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                How it works
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                  }`}>
                    1
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Upload your problem
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      Take a photo or describe it
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'
                  }`}>
                    2
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Get guided steps
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      AI breaks it down for you
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'
                  }`}>
                    3
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Learn by doing
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      Solve it yourself with hints
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Learning Session */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Progress Sidebar */}
            <div className={`lg:col-span-1 rounded-3xl border p-5 h-fit ${
              isDark 
                ? 'border-white/10 bg-gradient-to-br from-white/8 via-white/5 to-transparent' 
                : 'border-orange-200/50 bg-white shadow-lg'
            }`}>
              <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Target className="h-4 w-4 text-orange-500" />
                Your Progress
              </h3>
              
              {/* Steps progress */}
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-xl transition ${
                      index === currentStep
                        ? isDark
                          ? 'bg-orange-500/20 border border-orange-500/30'
                          : 'bg-orange-100 border border-orange-200'
                        : index < currentStep
                          ? isDark
                            ? 'bg-green-500/10'
                            : 'bg-green-50'
                          : isDark
                            ? 'bg-white/5'
                            : 'bg-slate-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                          ? isDark
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-500 text-white'
                          : isDark
                            ? 'bg-white/20 text-white/50'
                            : 'bg-slate-200 text-slate-500'
                    }`}>
                      {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${
                        index <= currentStep
                          ? isDark ? 'text-white' : 'text-slate-900'
                          : isDark ? 'text-white/50' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className={`mt-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-orange-100'}`}>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-white/50' : 'text-slate-500'}>Hints used</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{hintsUsed}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className={isDark ? 'text-white/50' : 'text-slate-500'}>Progress</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {Math.round((currentStep / steps.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Hint Button */}
              {!problemSolved && (
                <button
                  onClick={handleGetHint}
                  disabled={isThinking}
                  className={`w-full mt-4 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                  } ${isThinking ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Lightbulb className="h-4 w-4" />
                  Get a Hint
                </button>
              )}
            </div>

            {/* Chat Section */}
            <div className={`lg:col-span-2 rounded-3xl border overflow-hidden flex flex-col ${
              isDark 
                ? 'border-white/10 bg-gradient-to-br from-white/8 via-white/5 to-transparent' 
                : 'border-orange-200/50 bg-white shadow-lg'
            }`} style={{ height: '600px' }}>
              {/* Chat Header */}
              <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-orange-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-gradient-to-br from-orange-500 to-rose-500' : 'bg-gradient-to-br from-orange-500 to-rose-500'
                  }`}>
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Study Buddy
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      Your personal learning companion
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? isDark
                          ? 'bg-orange-500 text-white'
                          : 'bg-orange-500 text-white'
                        : message.type === 'hint'
                          ? isDark
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                          : message.type === 'celebration'
                            ? isDark
                              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border border-green-500/30'
                              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                            : isDark
                              ? 'bg-white/10 text-white'
                              : 'bg-slate-100 text-slate-900'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content.split('\n').map((line, i) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <strong key={i}>{line.slice(2, -2)}</strong>
                          }
                          if (line.includes('**')) {
                            const parts = line.split('**')
                            return (
                              <span key={i}>
                                {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
                              </span>
                            )
                          }
                          return <span key={i}>{line}{i < message.content.split('\n').length - 1 && <br />}</span>
                        })}
                      </div>
                      {message.isCorrect !== undefined && (
                        <div className={`mt-2 flex items-center gap-1 text-xs ${
                          message.isCorrect
                            ? isDark ? 'text-green-400' : 'text-green-600'
                            : isDark ? 'text-orange-400' : 'text-orange-600'
                        }`}>
                          {message.isCorrect ? (
                            <><CheckCircle className="h-3 w-3" /> Good thinking!</>
                          ) : (
                            <><HelpCircle className="h-3 w-3" /> Keep trying!</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex justify-start">
                    <div className={`rounded-2xl px-4 py-3 ${
                      isDark ? 'bg-white/10' : 'bg-slate-100'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Loader2 className={`h-4 w-4 animate-spin ${isDark ? 'text-white/50' : 'text-slate-500'}`} />
                        <span className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              {!problemSolved && (
                <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-orange-100'}`}>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your answer or question..."
                      className={`flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        isDark
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/40'
                          : 'bg-orange-50/50 border-orange-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!userInput.trim() || isThinking}
                      className={`px-5 py-3 rounded-xl font-semibold transition ${
                        !userInput.trim() || isThinking
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      } ${
                        isDark
                          ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                          : 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Celebration after solving */}
              {problemSolved && (
                <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-orange-100'}`}>
                  <button
                    onClick={handleNewProblem}
                    className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                      isDark
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    }`}
                  >
                    <RefreshCw className="h-5 w-5" />
                    Try Another Problem
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeworkHelper

