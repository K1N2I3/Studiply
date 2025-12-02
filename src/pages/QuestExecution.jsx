import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  Coins, 
  Target, 
  CheckCircle, 
  X,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useNotification } from '../contexts/NotificationContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { getUserQuestProgress, updateQuestProgress, getQuestData } from '../services/cloudQuestService'
import { getApprovedQuest } from '../services/questRequestService'
import { getAIQuest } from '../services/aiQuestService'
import { testFirebaseConnection, testUserProgressSave } from '../utils/firebaseTest'
import { getAchievementInfo } from '../services/achievementService'
import LearningMaterial from '../components/LearningMaterial'

const QuestExecution = () => {
  const { subject, category, questId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  const { user } = useSimpleAuth()
  
  const [quest, setQuest] = useState(null)
  const [userProgress, setUserProgress] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [showLearningMaterial, setShowLearningMaterial] = useState(false)
  const [hasCompletedLearning, setHasCompletedLearning] = useState(false)
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false)
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useState(null)
  const [currentAnswerExplanation, setCurrentAnswerExplanation] = useState('')
  const [showRestartButton, setShowRestartButton] = useState(false)

  useEffect(() => {
    // 重置学习状态
    setHasCompletedLearning(false)
    setShowLearningMaterial(false)
    loadQuestData()
  }, [subject, category, questId])

  useEffect(() => {
    let interval = null
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeSpent(time => time + 1)
      }, 1000)
    } else if (!isTimerRunning) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const loadQuestData = async () => {
    try {
      setLoading(true)
      if (!user?.id) {
        showError('User not authenticated', 3000, 'Error')
        navigate('/quest-academy')
        return
      }
      
      const progress = await getUserQuestProgress(user.id)
      setUserProgress(progress)
      
      // 检查是否是从 QuestList 传递过来的 quest（用户创建的 quest 或 AI quest）
      let questData = null
      const isAI = location.state?.isAI || false
      
      if (location.state?.quest) {
        // 使用传递过来的 quest 数据
        questData = location.state.quest
        console.log('Using quest from location.state:', questData, 'isAI:', isAI)
      } else if (isAI || category === 'ai-generated') {
        // 尝试从 AI quests 集合加载
        const aiQuestResult = await getAIQuest(questId, user.id)
        if (aiQuestResult.success && aiQuestResult.quest) {
          questData = aiQuestResult.quest
          console.log('Loaded quest from AI quests:', questData)
        }
      } else {
        // 尝试从 approved quests 集合加载（用户创建的 quest）
        const approvedQuestResult = await getApprovedQuest(questId, subject, category)
        if (approvedQuestResult.success && approvedQuestResult.quest) {
          questData = approvedQuestResult.quest
          console.log('Loaded quest from approved quests:', questData)
        } else {
          // 从云端获取传统 quest 数据
          questData = await getQuestData(subject, category, questId)
        }
      }
      
      if (questData) {
        // 如果是用户创建的 quest，需要转换数据结构
        if (questData.questions && Array.isArray(questData.questions)) {
          // 将 questions 转换为 steps 格式
          const steps = questData.questions.map((q, index) => ({
            id: `step-${index + 1}`,
            title: `Question ${index + 1}`,
            type: q.type,
            question: q.question,
            options: q.options || [],
            correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : null,
            correctAnswers: q.correctAnswers || [],
            explanation: q.explanation || ''
          }))
          
          questData = {
            ...questData,
            steps: steps,
            xpReward: questData.xpReward || 100,
            goldReward: questData.goldReward || 50
          }
        }
        
        setQuest(questData)
        setIsCompleted(progress.completedQuests.includes(questId))
      } else {
        showError('Quest not found', 3000, 'Error')
        navigate('/quest-academy')
      }
    } catch (error) {
      console.error('Error loading quest:', error)
      showError('Failed to load quest', 3000, 'Error')
    } finally {
      setLoading(false)
    }
  }


  const handleLearningComplete = () => {
    setShowLearningMaterial(false)
    setHasCompletedLearning(true)
    setIsTimerRunning(true)
    // 学习材料完成后，quest开始，但不自动完成
    console.log('Learning material completed, quest started')
  }

  const handleLearningSkip = () => {
    setShowLearningMaterial(false)
    setHasCompletedLearning(true)
    setIsTimerRunning(true)
    // 跳过学习材料后，quest开始，但不自动完成
    console.log('Learning material skipped, quest started')
    console.log('Quest data:', quest)
    console.log('Quest steps:', quest?.steps)
    console.log('Quest steps length:', quest?.steps?.length)
    console.log('Current step:', currentStep)
    console.log('Is completed:', isCompleted)
  }

  const handleAnswer = (stepId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [stepId]: answer
    }))
    
    // 重置反馈状态，不立即显示对错
    setShowAnswerFeedback(false)
    setCurrentAnswerCorrect(null)
    setCurrentAnswerExplanation('')
    setShowRestartButton(false)
  }

  const handleNextStep = () => {
    console.log('handleNextStep called:', { currentStep, stepsLength: quest.steps.length })
    
    // 获取当前步骤数据
    const currentStepData = quest?.steps?.[currentStep]
    if (!currentStepData) {
      console.error('No current step data found')
      return
    }
    
    // 检查是否已回答了当前问题
    const userAnswer = userAnswers[currentStepData.id]
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
      const errorMsg = currentStepData.type === 'fill-in-blank' 
        ? 'Please enter an answer before proceeding'
        : 'Please select an answer before proceeding'
      showError(errorMsg, 3000, 'Error')
      return
    }
    
    // 检查答案是否正确
    let isCorrect = false
    if (currentStepData.type === 'multiple-choice') {
      isCorrect = userAnswer === currentStepData.correctAnswer
    } else if (currentStepData.type === 'fill-in-blank') {
      // 对于填空题，检查用户答案是否在正确答案列表中（不区分大小写）
      const userAnswerLower = String(userAnswer).trim().toLowerCase()
      const correctAnswers = (currentStepData.correctAnswers || []).map(ans => String(ans).trim().toLowerCase())
      isCorrect = correctAnswers.includes(userAnswerLower)
    } else if (currentStepData.type === 'text-input' || currentStepData.type === 'essay') {
      // 对于文本输入，我们假设总是正确的（或者可以添加更复杂的验证逻辑）
      isCorrect = true
    }
    
    // 显示答案反馈
    setCurrentAnswerCorrect(isCorrect)
    setCurrentAnswerExplanation(currentStepData.explanation || '')
    setShowAnswerFeedback(true)
    
    // 如果答案错误，显示restart按钮
    if (!isCorrect) {
      showError('Incorrect answer! Please review the explanation and try again', 3000, 'Error')
      setShowRestartButton(true)
      return
    }
    
    // 答案正确，显示成功消息并继续
    showSuccess('Correct answer!', 2000, 'Success')
    
    // 延迟一下再继续，让用户看到反馈
    setTimeout(() => {
      // 重置反馈状态
      setShowAnswerFeedback(false)
      setCurrentAnswerCorrect(null)
      setCurrentAnswerExplanation('')
      
      if (quest.steps && quest.steps.length > 0 && currentStep < quest.steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else if (quest.steps && quest.steps.length > 0) {
        completeQuest()
      } else {
        console.error('Quest has no steps or steps is empty!', quest)
        alert('Quest data error: No questions found. Please refresh the page and try again.')
      }
    }, 2000)
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRestart = () => {
    // 重置当前步骤的答案
    const currentStepData = quest?.steps?.[currentStep]
    if (currentStepData) {
      setUserAnswers(prev => {
        const newAnswers = { ...prev }
        delete newAnswers[currentStepData.id]
        return newAnswers
      })
    }
    
    // 重置反馈状态
    setShowAnswerFeedback(false)
    setCurrentAnswerCorrect(null)
    setCurrentAnswerExplanation('')
    setShowRestartButton(false)
  }

  const completeQuest = async () => {
    try {
      setIsCompleted(true)
      setIsTimerRunning(false)
      
      // 固定奖励：每个 quest 给 25 gold, 50 XP
      const xpEarned = 50
      const goldEarned = 25
      
      // 测试Firebase连接
      console.log('Testing Firebase connection before saving...')
      const firebaseTest = await testFirebaseConnection()
      console.log('Firebase connection test result:', firebaseTest)
      
      if (!firebaseTest) {
        console.error('Firebase connection failed!')
        showError('Firebase connection failed', 5000, 'Error')
        return
      }
      
      // 测试用户进度保存
      console.log('Testing user progress save...')
      const progressTest = await testUserProgressSave(user.id)
      console.log('User progress save test result:', progressTest)
      
      // 更新用户进度
      // 使用 URL 参数中的 questId，如果 quest 对象有 id 则优先使用 quest.id
      const finalQuestId = quest?.id || questId
      console.log('Updating quest progress:', {
        userId: user.id,
        questId: finalQuestId,
        subject,
        category,
        xpEarned,
        goldEarned
      });
      
      const result = await updateQuestProgress(
        user.id,
        finalQuestId,
        subject,
        category,
        'quest',
        xpEarned,
        goldEarned,
        [] // deliverables - 暂时为空数组
      )
      
      console.log('Quest progress updated successfully');
      
      // 检查是否有新解锁的成就
      if (result.newAchievements && result.newAchievements.length > 0) {
        const achievementNames = result.newAchievements
          .map(id => getAchievementInfo(id)?.name || id)
          .join(', ')
        showSuccess(`Quest completed! 🎉 Unlocked: ${achievementNames}`, 5000, 'Achievement Unlocked!')
      } else {
        showSuccess(`Quest completed! Great job!`, 3000, 'Quest Complete')
      }
      
      // 通知父页面更新进度
      window.dispatchEvent(new CustomEvent('questCompleted', {
        detail: { questId, subject, category, xpEarned, goldEarned }
      }));
      
      // 3秒后返回Quest Academy
      setTimeout(() => {
        navigate('/quest-academy')
      }, 3000)
    } catch (error) {
      console.error('Error completing quest:', error)
      showError('Failed to complete quest', 3000, 'Error')
    }
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setTimeSpent(0)
    setIsTimerRunning(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const renderStep = (step) => {
    switch (step.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-6">
            {/* Question Card */}
            <div className={`rounded-3xl border-2 p-8 shadow-xl backdrop-blur-xl ${
              isDark
                ? 'border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20'
                : 'border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
            }`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isDark
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                }`}>
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {step.question}
                  </h3>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {step.options.map((option, index) => {
                  const isSelected = userAnswers[step.id] === index
                  const isCorrect = index === step.correctAnswer
                  const showFeedback = showAnswerFeedback
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(step.id, index)}
                      disabled={showFeedback}
                      className={`relative w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
                        showFeedback
                          ? isCorrect
                            ? isDark
                              ? 'border-green-400/50 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-100 shadow-lg shadow-green-500/20'
                              : 'border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-lg shadow-green-200'
                            : isSelected
                            ? isDark
                              ? 'border-red-400/50 bg-gradient-to-r from-red-500/30 to-orange-500/30 text-red-100 shadow-lg shadow-red-500/20'
                              : 'border-red-400 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 shadow-lg shadow-red-200'
                            : isDark
                            ? 'border-white/10 bg-white/5 text-white/60'
                            : 'border-gray-200 bg-white text-gray-500'
                          : isSelected
                          ? isDark
                            ? 'border-purple-400/50 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40'
                            : 'border-purple-400 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300'
                          : isDark
                          ? 'border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-white/10 text-white hover:shadow-lg hover:shadow-purple-500/20'
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 text-slate-800 hover:shadow-lg hover:shadow-purple-200'
                      } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Option Letter Badge */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                          showFeedback
                            ? isCorrect
                              ? isDark
                                ? 'bg-green-500 text-white'
                                : 'bg-green-500 text-white'
                              : isSelected
                              ? isDark
                                ? 'bg-red-500 text-white'
                                : 'bg-red-500 text-white'
                              : isDark
                              ? 'bg-white/10 text-white/40'
                              : 'bg-gray-200 text-gray-400'
                            : isSelected
                            ? isDark
                              ? 'bg-purple-500 text-white'
                              : 'bg-purple-500 text-white'
                            : isDark
                            ? 'bg-white/10 text-white/70'
                            : 'bg-gray-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        
                        {/* Option Text */}
                        <span className={`flex-1 font-semibold text-lg ${
                          showFeedback && isCorrect
                            ? isDark ? 'text-green-200' : 'text-green-800'
                            : showFeedback && isSelected && !isCorrect
                            ? isDark ? 'text-red-200' : 'text-red-800'
                            : isSelected
                            ? isDark ? 'text-white' : 'text-purple-900'
                            : isDark ? 'text-white' : 'text-slate-800'
                        }`}>
                          {option}
                        </span>

                        {/* Feedback Icons */}
                        {showFeedback && isCorrect && (
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isDark
                              ? 'bg-green-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}>
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        )}
                        {showFeedback && isSelected && !isCorrect && (
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isDark
                              ? 'bg-red-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}>
                            <X className="w-5 h-5" />
                          </div>
                        )}
                        {!showFeedback && isSelected && (
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isDark
                              ? 'bg-purple-500 text-white'
                              : 'bg-purple-500 text-white'
                          }`}>
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Answer Feedback Card */}
            {showAnswerFeedback && (
              <div className={`rounded-2xl border-2 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ${
                currentAnswerCorrect
                  ? isDark
                    ? 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-emerald-500/20'
                    : 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                  : isDark
                    ? 'border-red-400/50 bg-gradient-to-br from-red-500/20 to-orange-500/20'
                    : 'border-red-400 bg-gradient-to-br from-red-50 to-orange-50'
              }`}>
                <div className="flex items-start gap-4">
                  {currentAnswerCorrect ? (
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDark
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                    }`}>
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDark
                        ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg'
                        : 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg'
                    }`}>
                      <X className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold mb-2 ${
                      currentAnswerCorrect
                        ? isDark ? 'text-green-300' : 'text-green-700'
                        : isDark ? 'text-red-300' : 'text-red-700'
                    }`}>
                      {currentAnswerCorrect ? 'Excellent! Correct Answer!' : 'Not quite right'}
                    </h4>
                    {currentAnswerExplanation && (
                      <p className={`text-base leading-relaxed ${
                        isDark ? 'text-white/80' : 'text-slate-700'
                      }`}>
                        {currentAnswerExplanation}
                      </p>
                    )}
                    {!currentAnswerCorrect && step.options && (
                      <div className={`mt-4 p-4 rounded-xl ${
                        isDark ? 'bg-white/10' : 'bg-white'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDark ? 'text-white/90' : 'text-slate-700'
                        }`}>
                          The correct answer is:
                        </p>
                        <p className={`text-lg font-bold ${
                          isDark ? 'text-green-300' : 'text-green-700'
                        }`}>
                          {String.fromCharCode(65 + step.correctAnswer)}. {step.options[step.correctAnswer]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'fill-in-blank':
        return (
          <div className="space-y-6">
            {/* Question Card */}
            <div className={`rounded-3xl border-2 p-8 shadow-xl backdrop-blur-xl ${
              isDark
                ? 'border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20'
                : 'border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
            }`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isDark
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                }`}>
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {step.question}
                  </h3>
                  {step.correctAnswers && step.correctAnswers.length > 0 && (
                    <p className={`text-sm flex items-center gap-2 ${
                      isDark ? 'text-white/70' : 'text-slate-600'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                      Multiple correct answers accepted (case-insensitive)
                    </p>
                  )}
                </div>
              </div>

              {/* Answer Input */}
              <div className="relative">
                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-50 ${
                  userAnswers[step.id]
                    ? isDark
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-purple-400 to-pink-400'
                    : ''
                } transition-all duration-300`} />
                <input
                  type="text"
                  value={userAnswers[step.id] || ''}
                  onChange={(e) => handleAnswer(step.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className={`relative w-full p-6 rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${
                    isDark
                      ? userAnswers[step.id]
                        ? 'border-purple-400/50 bg-white/10 text-white placeholder-white/40 focus:border-purple-400 focus:bg-white/15 focus:shadow-lg focus:shadow-purple-500/30'
                        : 'border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-purple-400 focus:bg-white/10'
                      : userAnswers[step.id]
                        ? 'border-purple-400 bg-white text-slate-900 placeholder-gray-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200'
                        : 'border-gray-200 bg-white text-slate-900 placeholder-gray-400 focus:border-purple-400 focus:bg-purple-50'
                  }`}
                  autoFocus
                />
                {userAnswers[step.id] && (
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Answer Feedback */}
            {showAnswerFeedback && (
              <div className={`rounded-2xl border-2 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 ${
                currentAnswerCorrect
                  ? isDark
                    ? 'border-green-400/50 bg-gradient-to-br from-green-500/20 to-emerald-500/20'
                    : 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                  : isDark
                    ? 'border-red-400/50 bg-gradient-to-br from-red-500/20 to-orange-500/20'
                    : 'border-red-400 bg-gradient-to-br from-red-50 to-orange-50'
              }`}>
                <div className="flex items-start gap-4">
                  {currentAnswerCorrect ? (
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDark
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                    }`}>
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDark
                        ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg'
                        : 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg'
                    }`}>
                      <X className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold mb-2 ${
                      currentAnswerCorrect
                        ? isDark ? 'text-green-300' : 'text-green-700'
                        : isDark ? 'text-red-300' : 'text-red-700'
                    }`}>
                      {currentAnswerCorrect ? 'Correct!' : 'Incorrect'}
                    </h4>
                    {currentAnswerExplanation && (
                      <p className={`text-base leading-relaxed ${
                        isDark ? 'text-white/80' : 'text-slate-700'
                      }`}>
                        {currentAnswerExplanation}
                      </p>
                    )}
                    {!currentAnswerCorrect && step.correctAnswers && step.correctAnswers.length > 0 && (
                      <div className={`mt-4 p-4 rounded-xl ${
                        isDark ? 'bg-white/10' : 'bg-white'
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${
                          isDark ? 'text-white/90' : 'text-slate-700'
                        }`}>
                          Correct answers:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.correctAnswers.map((ans, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                isDark
                                  ? 'bg-green-500/30 text-green-300 border border-green-400/50'
                                  : 'bg-green-100 text-green-700 border border-green-300'
                              }`}
                            >
                              {ans}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'text-input':
        return (
          <div className="space-y-4">
            <p className={`text-lg font-medium ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>{step.question}</p>
            <textarea
              value={userAnswers[step.id] || ''}
              onChange={(e) => handleAnswer(step.id, e.target.value)}
              placeholder="Type your answer here..."
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none ${
                isDark
                  ? 'border-white/20 bg-white/5 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/10'
                  : 'border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-gray-50'
              }`}
              rows={4}
            />
          </div>
        )
      
      case 'essay':
        return (
          <div className="space-y-4">
            <p className={`text-lg font-medium ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>{step.question}</p>
            <div className={`p-3 rounded-lg ${
              isDark ? 'bg-yellow-500/20 border border-yellow-400/30' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className={`text-sm ${
                isDark ? 'text-yellow-300' : 'text-yellow-700'
              }`}>
                Minimum {step.minWords} words required
              </p>
            </div>
            <textarea
              value={userAnswers[step.id] || ''}
              onChange={(e) => handleAnswer(step.id, e.target.value)}
              placeholder="Write your essay here..."
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none ${
                isDark
                  ? 'border-white/20 bg-white/5 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/10'
                  : 'border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-gray-50'
              }`}
              rows={8}
            />
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Word count: {(userAnswers[step.id] || '').split(' ').filter(word => word.length > 0).length}
            </div>
          </div>
        )
      
      default:
        return <div>Unknown step type</div>
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    )
  }

  if (!quest) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Quest not found</h2>
          <button
            onClick={() => navigate('/quest-academy')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Back to Quest Academy
          </button>
        </div>
      </div>
    )
  }

  const currentStepData = quest.steps && quest.steps.length > 0 ? quest.steps[currentStep] : null

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Learning Material Modal */}
      {showLearningMaterial && quest?.learningMaterial && (
        <LearningMaterial
          learningMaterial={quest.learningMaterial}
          onComplete={handleLearningComplete}
          onSkip={handleLearningSkip}
          isVisible={showLearningMaterial}
        />
      )}
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full filter blur-xl opacity-40 animate-pulse shadow-2xl shadow-purple-300/50"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full filter blur-xl opacity-40 animate-pulse shadow-2xl shadow-blue-300/50"></div>
            <div className="absolute top-40 left-40 w-60 h-60 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full filter blur-xl opacity-40 animate-pulse shadow-2xl shadow-pink-300/50"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full filter blur-xl opacity-40 animate-pulse shadow-2xl shadow-cyan-300/50"></div>
          </>
        )}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/quest-academy')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Quest Academy</span>
            </button>

            {/* Timer */}
            <div className={`flex items-center space-x-4 px-4 py-2 rounded-xl ${
              isDark ? 'bg-white/10 border border-white/20' : 'bg-white border border-gray-200'
            }`}>
              <Clock className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-600'}`} />
              <span className={`font-mono text-lg font-bold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>{formatTime(timeSpent)}</span>
              <div className="flex space-x-2">
                <button
                  onClick={toggleTimer}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={resetTimer}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quest Info */}
          <div className={`relative group rounded-3xl p-8 border-2 backdrop-blur-xl ${
            isDark
              ? 'bg-gradient-to-br from-white/10 via-purple-500/10 to-white/10 border-purple-400/30 shadow-xl shadow-purple-500/10'
              : 'bg-white/90 border-purple-200/50 shadow-xl'
          }`}>
            <div className="flex items-start space-x-6 mb-6">
              <div className={`text-5xl p-4 rounded-2xl ${
                isDark ? 'bg-white/10' : 'bg-purple-50'
              }`}>{quest.icon}</div>
              <div className="flex-1">
                <h1 className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{quest.title}</h1>
                <p className={`text-lg leading-relaxed ${
                  isDark ? 'text-white/80' : 'text-gray-600'
                }`}>{quest.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
                  isDark ? 'bg-white/10' : 'bg-gray-100'
                }`}>
                  <Target className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>{quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}</span>
                </div>
              </div>
              <div className={`text-sm font-medium px-4 py-2 rounded-xl ${
                isDark ? 'bg-white/10 text-white/90' : 'bg-gray-100 text-gray-700'
              }`}>
                Step {currentStep + 1} of {quest.steps.length}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isDark ? 'text-white/70' : 'text-gray-600'
            }`}>
              Progress
            </span>
            <span className={`text-sm font-semibold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {Math.round(((currentStep + 1) / quest.steps.length) * 100)}%
            </span>
          </div>
          <div className={`w-full rounded-full h-2.5 overflow-hidden ${
            isDark ? 'bg-white/10' : 'bg-gray-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 shadow-lg shadow-purple-500/30"
              style={{ width: `${((currentStep + 1) / quest.steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

      {/* Quest Content */}
      {quest.steps && quest.steps.length > 0 ? (
        <div className={`relative group rounded-3xl p-8 border-2 backdrop-blur-xl ${
          isDark
            ? 'bg-gradient-to-br from-white/10 via-purple-500/10 to-white/10 border-purple-400/30 shadow-xl shadow-purple-500/10'
            : 'bg-white/90 border-purple-200/50 shadow-xl'
        }`}>
          <div className="mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 ${
              isDark ? 'bg-white/10' : 'bg-purple-50'
            }`}>
              <Target className={`w-5 h-5 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <h2 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{currentStepData.title}</h2>
            </div>
          </div>

          {renderStep(currentStepData)}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 0
                  ? isDark
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isDark
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Previous
            </button>

            {showRestartButton ? (
              <button
                onClick={handleRestart}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isDark
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                }`}
              >
                Restart
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {currentStep === quest.steps.length - 1 ? 'Complete Quest' : 'Next Step'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={`relative group rounded-3xl p-8 border-2 ${
          isDark
            ? 'bg-white/10 border-white/20'
            : 'bg-white/90 border-white/20 shadow-xl'
        }`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>Quest Data Error</h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>This quest has no question data. Please refresh the page and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

        {/* Completion Modal */}
        {isCompleted && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`relative group rounded-3xl p-10 border-2 max-w-lg w-full mx-4 shadow-2xl ${
              isDark
                ? 'bg-gradient-to-br from-slate-800/95 via-purple-900/95 to-slate-800/95 border-purple-400/30'
                : 'bg-white border-purple-200 shadow-purple-200/50'
            }`}>
              <div className="text-center">
                {/* Success Icon */}
                <div className="relative mb-6">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                    isDark
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                      : 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-200'
                  }`}>
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  {/* Animated rings */}
                  <div className={`absolute inset-0 rounded-full border-4 ${
                    isDark ? 'border-green-400/30' : 'border-green-300/50'
                  } animate-ping`} style={{ animationDuration: '2s' }}></div>
                </div>
                
                <h3 className={`text-3xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Quest Completed!
                </h3>
                <p className={`text-lg mb-6 ${
                  isDark ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Congratulations! You've successfully completed this quest.
                </p>
                
                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className={`h-1 w-1 rounded-full ${
                    isDark ? 'bg-white/40' : 'bg-gray-300'
                  } animate-pulse`} style={{ animationDelay: '0s' }}></div>
                  <div className={`h-1 w-1 rounded-full ${
                    isDark ? 'bg-white/40' : 'bg-gray-300'
                  } animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
                  <div className={`h-1 w-1 rounded-full ${
                    isDark ? 'bg-white/40' : 'bg-gray-300'
                  } animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
                </div>
                
                <p className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-gray-500'
                }`}>
                  Returning to Quest Academy in 3 seconds...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestExecution
