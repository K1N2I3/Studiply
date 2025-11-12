import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Trophy, 
  Zap,
  Crown,
  Target,
  Volume2,
  VolumeX,
  BookOpen
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { 
  getSkillTreeData, 
  getUserSkillProgress,
  updateLessonProgress,
  getDynamicLessonContent
} from '../services/skillTreeService'
import { testFirebaseConnection, testSkillProgressWrite } from '../utils/firebaseTest'

const LearningSession = () => {
  const { pathId, unitId, lessonId, exerciseId } = useParams()
  const navigate = useNavigate()
  const { user } = useSimpleAuth()
  const { showError, showSuccess } = useNotification()
  
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [progressBar, setProgressBar] = useState(0)
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [lessonsCompleted, setLessonsCompleted] = useState(0)
  const [lessonData, setLessonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false) // 防止重复点击
  const [isLessonCompleted, setIsLessonCompleted] = useState(false) // 课程完成状态

  useEffect(() => {
    loadLessonData()
  }, [pathId, unitId, lessonId])

  const loadLessonData = async () => {
    try {
      setLoading(true)
      
      // 如果是语言路径，检查是否已选择语言
      if (pathId === 'language' && user?.id) {
        const progress = await getUserSkillProgress(user.id)
        const selectedLanguage = progress.paths?.language?.selectedLanguage
        
        if (!selectedLanguage) {
          // 如果没有选择语言，重定向到语言选择页面
          showError('Please select a language first', 5000, 'Language Required')
          navigate(`/learning-paths?path=${pathId}`)
          return
        }
        
        setStreak(progress.streak || 0)
        setXp(progress.totalXP || 0)
        setLessonsCompleted(progress.lessonsCompleted || 0)
        
        // 根据选择的语言动态获取课程内容
        const lesson = getDynamicLessonContent(pathId, unitId, lessonId, selectedLanguage)
        
        if (!lesson) {
          showError('Lesson not found', 5000, 'Error')
          navigate(`/learning-paths?path=${pathId}`)
          return
        }

        setLessonData(lesson)
      } else {
        // 非语言路径使用原始数据
        const skillTree = getSkillTreeData()
        const path = skillTree[pathId]
        const unit = path?.units?.find(u => u.id === unitId)
        const lesson = unit?.lessons?.find(l => l.id === lessonId)
        
        if (!lesson) {
          showError('Lesson not found', 5000, 'Error')
          navigate(`/learning-paths?path=${pathId}`)
          return
        }

        setLessonData(lesson)
        
        // 加载用户进度
        if (user?.id) {
          const progress = await getUserSkillProgress(user.id)
          setStreak(progress.streak || 0)
          setXp(progress.totalXP || 0)
          setLessonsCompleted(progress.lessonsCompleted || 0)
        }
      }
      
    } catch (error) {
      console.error('Error loading lesson data:', error)
      showError('Failed to load lesson', 5000, 'Loading Error')
    } finally {
      setLoading(false)
    }
  }

  const currentExerciseData = lessonData?.lessons?.[exerciseId]?.content?.exercises?.[currentExercise]

  const handleAnswer = () => {
    if (!currentExerciseData || isCheckingAnswer) return

    setIsCheckingAnswer(true) // 防止重复点击

    let correct = false
    
    switch (currentExerciseData.type) {
      case 'translate':
        correct = selectedOption === currentExerciseData.answer
        break
      case 'listen':
        correct = selectedOption === currentExerciseData.answer
        break
      case 'conversation':
        correct = selectedOption !== ''
        break
      default:
        correct = userAnswer.toLowerCase() === currentExerciseData.answer.toLowerCase()
    }

    setIsCorrect(correct)
    setShowResult(true)
    
    // 启动进度条
    setProgressBar(0)
    const progressInterval = setInterval(() => {
      setProgressBar(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // 进度条完成后自动进入下一题
          setTimeout(() => {
            nextExercise()
          }, 300)
          return 100
        }
        return prev + 2 // 每20ms增加2%，总共1秒完成
      })
    }, 20)

    if (correct) {
      setStreak(prev => prev + 1)
      setXp(prev => prev + (lessonData.xpReward || 10))
      // 删除重复的notification，只保留结果区域的显示
    } else {
      setStreak(0)
      // 删除重复的notification，只保留结果区域的显示
    }
  }

  const nextExercise = () => {
    const totalExercises = lessonData?.lessons?.[exerciseId]?.content?.exercises?.length || 0
    
    if (currentExercise < totalExercises - 1) {
      setCurrentExercise(prev => prev + 1)
      setShowResult(false)
      setIsCorrect(null)
      setSelectedOption('')
      setUserAnswer('')
      setProgressBar(0) // 重置进度条
      setIsCheckingAnswer(false) // 重置按钮状态
    } else {
      // 课程完成
      setLessonsCompleted(prev => prev + 1)
      setIsLessonCompleted(true)
      completeLesson()
    }
  }

  const completeLesson = async () => {
    try {
      if (user?.id) {
        // 先测试Firebase连接
        console.log('Testing Firebase connection before saving progress...')
        const connectionTest = await testFirebaseConnection(user.id)
        console.log('Firebase connection test result:', connectionTest)
        
        if (!connectionTest.success) {
          throw new Error(`Firebase connection failed: ${connectionTest.error}`)
        }
        
        // 测试skillProgress写入
        console.log('Testing skillProgress write...')
        const writeTest = await testSkillProgressWrite(user.id)
        console.log('skillProgress write test result:', writeTest)
        
        if (!writeTest.success) {
          throw new Error(`skillProgress write failed: ${writeTest.error}`)
        }
        
        // 使用新的updateLessonProgress函数
        console.log('Saving lesson progress...')
        console.log('Lesson data:', lessonData)
        console.log('XP reward from lesson data:', lessonData?.xpReward)
        const xpToAward = lessonData?.xpReward || 10
        console.log('XP to award:', xpToAward)
        await updateLessonProgress(user.id, pathId, unitId, lessonId, xpToAward)
        console.log('Lesson progress updated successfully')
      }
      
      // 不显示额外的成功消息，让完成状态界面自己处理
      // showSuccess(`Lesson completed! You earned ${xp} XP!`, 6000, 'Congratulations!')
      
      // 延迟导航，让用户看到完成状态
      setTimeout(() => {
        navigate(`/learning-paths?path=${pathId}`)
      }, 5000) // 增加到5秒，让用户有足够时间看到完成状态
    } catch (error) {
      console.error('Error completing lesson:', error)
      console.error('Full error details:', error)
      showError(`Failed to save lesson progress: ${error.message}`, 8000, 'Error')
    }
  }

  const playAudio = () => {
    if (currentExerciseData?.audio) {
      setIsPlaying(true)
      // 这里可以播放音频
      setTimeout(() => setIsPlaying(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <button
            onClick={() => navigate(`/learning-paths?path=${pathId}`)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to {pathId === 'language' ? 'Language' : pathId === 'mathematics' ? 'Mathematics' : pathId === 'physics' ? 'Physics' : 'Learning Path'}
          </button>
        </div>
      </div>
    )
  }

  const totalExercises = lessonData.lessons?.[exerciseId]?.content?.exercises?.length || 0
  const progressPercentage = ((currentExercise + 1) / totalExercises) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate(`/learning-paths?path=${pathId}`)}
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-all duration-200 hover:bg-indigo-50 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to {pathId === 'language' ? 'Language' : pathId === 'mathematics' ? 'Mathematics' : pathId === 'physics' ? 'Physics' : 'Learning Path'}</span>
              </button>
              <div className="border-l border-gray-200 pl-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{lessonData.title}</h1>
                <p className="text-gray-600 mt-1">{lessonData.description}</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-700">{xp}</span>
              </div>
              <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                <Trophy className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-orange-700">{streak}</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-700">{lessonsCompleted}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span className="font-medium">Lesson Progress</span>
              <span className="font-semibold">{currentExercise + 1} / {totalExercises}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {currentExerciseData && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-10">
            {/* Exercise Type Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-sm border border-indigo-200">
                <Target className="w-4 h-4" />
                <span className="capitalize">{currentExerciseData.type}</span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4 leading-tight">
                {currentExerciseData.question}
              </h2>
            </div>

            {/* Audio Player */}
            {currentExerciseData.audio && (
              <div className="text-center mb-10">
                <button
                  onClick={playAudio}
                  className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isPlaying ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                </button>
                <p className="text-gray-600 mt-3 font-medium">Click to listen</p>
              </div>
            )}

            {/* Answer Options */}
            {currentExerciseData.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {currentExerciseData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full p-6 text-left border-2 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                      selectedOption === option
                        ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md'
                    } ${showResult ? (
                      option === currentExerciseData.answer
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700'
                        : selectedOption === option && option !== currentExerciseData.answer
                        ? 'border-red-500 bg-gradient-to-r from-red-50 to-pink-50 text-red-700'
                        : ''
                    ) : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === option && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-lg font-medium">{option}</span>
                      {showResult && option === currentExerciseData.answer && (
                        <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Conversation Options */}
            {currentExerciseData.userOptions && (
              <div className="space-y-3 mb-8">
                <div className="bg-gray-100 p-4 rounded-xl mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {currentExerciseData.character?.[0] || 'A'}
                      </span>
                    </div>
                    <span className="font-medium">{currentExerciseData.character}</span>
                  </div>
                  <p className="text-gray-700">{currentExerciseData.message}</p>
                </div>
                
                <div className="space-y-2">
                  {currentExerciseData.userOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedOption(option)}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-all duration-300 ${
                        selectedOption === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Text Input */}
            {!currentExerciseData.options && !currentExerciseData.userOptions && (
              <div className="mb-8">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnswer()}
                />
              </div>
            )}

            {/* Result Display */}
            {showResult && (
              <div className={`text-center p-8 rounded-3xl mb-10 shadow-lg border-2 ${
                isCorrect 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
              }`}>
                <div className={`text-6xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {isCorrect ? '🎉' : '💪'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Excellent!' : 'Keep trying!'}
                </h3>
                <p className={`text-lg font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? `+${lessonData.xpReward || 10} XP earned!` : 'No worries, keep learning!'}
                </p>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                    <div 
                      className={`h-2 rounded-full transition-all duration-100 ease-out ${
                        isCorrect 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                          : 'bg-gradient-to-r from-red-400 to-pink-400'
                      }`}
                      style={{ width: `${progressBar}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3 font-medium">Moving to next question...</p>
                </div>
              </div>
            )}

            {/* Lesson Completed Display */}
            {isLessonCompleted && (
              <div className="text-center p-10 rounded-3xl mb-10 shadow-2xl border-2 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <div className="text-8xl mb-6">🏆</div>
                <h2 className="text-4xl font-bold text-yellow-800 mb-4">Lesson Completed!</h2>
                <p className="text-xl text-yellow-700 mb-6">Congratulations! You've finished this lesson.</p>
                <div className="flex items-center justify-center space-x-8 mb-6">
                  <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full">
                    <span className="text-2xl">⭐</span>
                    <span className="font-bold text-yellow-800">+{lessonData.xpReward || 10} XP</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
                    <span className="text-2xl">🔥</span>
                    <span className="font-bold text-orange-800">Streak +1</span>
                  </div>
                </div>
                <p className="text-lg text-yellow-600 mb-4">You can now continue to the next lesson!</p>
                <div className="w-full bg-yellow-200 rounded-full h-3 shadow-inner">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-out"
                    style={{ width: '100%' }}
                  />
                </div>
                <p className="text-sm text-yellow-600 mt-3 font-medium">Returning to lesson selection...</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center">
              {!isLessonCompleted && (currentExerciseData.options || currentExerciseData.userOptions) && (
                <button
                  onClick={handleAnswer}
                  disabled={!selectedOption || isCheckingAnswer}
                  className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
                >
                  {isCheckingAnswer ? 'Checking...' : 'Check Answer'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LearningSession
