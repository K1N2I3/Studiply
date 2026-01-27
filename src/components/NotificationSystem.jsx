import React, { useState, useEffect } from 'react'
import { X, BookOpen, Target, Trophy, Clock, Loader2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { generateCalendarQuiz } from '../services/calendarQuizService'

const NotificationSystem = ({ events = [] }) => {
  const { isDark } = useTheme()
  const [notifications, setNotifications] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizScore, setQuizScore] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState(null)

  // 检查需要显示的通知
  useEffect(() => {
    const today = new Date()
    const newNotifications = []

    events.forEach(event => {
      const eventDate = new Date(event.date)
      const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))

      // 检查是否需要显示通知
      if (daysUntilEvent === event.reminderDays && daysUntilEvent > 0) {
        if (event.type === 'homework') {
          newNotifications.push({
            id: `homework-${event.id}`,
            type: 'homework',
            title: 'Homework Reminder',
            message: `You have homework due in ${daysUntilEvent} day${daysUntilEvent > 1 ? 's' : ''}: ${event.title}`,
            subject: event.subject,
            event: event
          })
        } else if (event.type === 'summative') {
          newNotifications.push({
            id: `summative-${event.id}`,
            type: 'summative',
            title: 'Test Reminder',
            message: `You have a ${event.subject} test in ${daysUntilEvent} day${daysUntilEvent > 1 ? 's' : ''}: ${event.title}`,
            subject: event.subject,
            event: event
          })
        }
      }
    })

    setNotifications(newNotifications)
  }, [events])

  // 开始测验 - 使用 AI 生成题目
  const startQuiz = async (notification) => {
    setQuizLoading(true)
    setQuizError(null)
    setShowQuiz(true)
    setQuizAnswers({})
    setQuizScore(null)

    try {
      // 获取事件描述
      const description = notification.event?.description || notification.event?.title || ''
      const subject = notification.subject || notification.event?.subject || 'general'

      console.log('📝 [Calendar Quiz] Generating quiz:', { subject, description })

      // 调用 AI API 生成题目
      const result = await generateCalendarQuiz(subject, description, 5)

      if (result.success && result.quiz) {
        // 格式化题目以匹配现有格式
        const formattedQuiz = {
          subject: result.quiz.subject || subject,
          questions: result.quiz.questions.map((q, index) => ({
            question: q.question,
            options: q.options,
            correct: q.correctAnswer,
            questionId: q.questionId || `q_${index}`
          })),
          timeLimit: 300 // 5分钟
        }

        setCurrentQuiz(formattedQuiz)
        console.log('✅ [Calendar Quiz] Quiz generated successfully:', formattedQuiz.questions.length, 'questions')
      } else {
        throw new Error(result.error || 'Failed to generate quiz')
      }
    } catch (error) {
      console.error('❌ [Calendar Quiz] Error generating quiz:', error)
      setQuizError(error.message || 'Failed to generate quiz. Please try again.')
      // 如果 AI 生成失败，使用备用题目
      const fallbackQuiz = {
        subject: notification.subject || 'General',
        questions: [
          {
            question: "What is the main topic of this test?",
            options: ["Review the description", "Study the materials", "Prepare thoroughly", "All of the above"],
            correct: 3
          }
        ],
        timeLimit: 300
      }
      setCurrentQuiz(fallbackQuiz)
    } finally {
      setQuizLoading(false)
    }
  }

  // 提交测验
  const submitQuiz = () => {
    if (!currentQuiz) return

    let correct = 0
    currentQuiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++
      }
    })

    const score = Math.round((correct / currentQuiz.questions.length) * 100)
    setQuizScore(score)
  }

  // 关闭通知
  const dismissNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  // 关闭测验
  const closeQuiz = () => {
    setShowQuiz(false)
    setCurrentQuiz(null)
    setQuizAnswers({})
    setQuizScore(null)
    setQuizLoading(false)
    setQuizError(null)
  }

  if (notifications.length === 0 && !showQuiz) {
    return null
  }

  return (
    <>
      {/* 通知 */}
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`fixed top-20 right-6 z-50 w-96 p-6 rounded-2xl border-2 shadow-2xl backdrop-blur-xl transform transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-white/15 via-white/10 to-white/5 border-white/30 text-white'
              : 'bg-white border-gray-200 text-gray-800 shadow-xl'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 p-3 rounded-xl ${
              notification.type === 'homework' 
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg'
                : 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg'
            }`}>
              {notification.type === 'homework' ? (
                <Target className="w-6 h-6" />
              ) : (
                <Trophy className="w-6 h-6" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold text-lg mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {notification.title}
              </h4>
              <p className={`text-sm mb-4 leading-relaxed ${
                isDark ? 'text-white/80' : 'text-gray-600'
              }`}>
                {notification.message}
              </p>
              
              <div className="flex gap-3">
                {notification.type === 'summative' && (
                  <button
                    onClick={() => startQuiz(notification)}
                    className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    Take Quiz
                  </button>
                )}
                
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    isDark
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  Dismiss
                </button>
              </div>
            </div>
            
            <button
              onClick={() => dismissNotification(notification.id)}
              className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-white/60 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {/* 测验模态框 */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-3xl p-6 border-2 max-w-2xl mx-4 w-full max-h-[90vh] overflow-y-auto relative ${
            isDark
              ? 'bg-white/10 border-white/20'
              : 'bg-white/90 border-white/20 shadow-xl'
          }`}>
            {/* Close button */}
            {!quizLoading && (
              <button
                onClick={closeQuiz}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-white/10 text-white/60 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {quizLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
                <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Generating quiz questions...
                </p>
                <p className={`text-sm mt-2 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                  Using AI to create questions based on your event description
                </p>
              </div>
            ) : quizError && !currentQuiz ? (
              <div className="text-center py-8">
                <p className={`text-lg mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {quizError}
                </p>
                <button
                  onClick={() => {
                    setShowQuiz(false)
                    setQuizError(null)
                  }}
                  className={`px-4 py-2 rounded-xl font-medium ${
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  Close
                </button>
              </div>
            ) : currentQuiz && !quizScore ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {currentQuiz.subject} Quiz
                  </h3>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                    isDark ? 'bg-white/10' : 'bg-gray-100'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{Math.floor(currentQuiz.timeLimit / 60)}m</span>
                  </div>
                </div>

                {quizError && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${
                    isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-800'
                  }`}>
                    {quizError}
                  </div>
                )}

                <div className="space-y-6">
                  {currentQuiz.questions.map((question, index) => (
                  <div key={index}>
                    <p className={`font-medium mb-2 ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                      {index + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            quizAnswers[index] === optionIndex
                              ? isDark
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-blue-100 text-blue-600'
                              : isDark
                                ? 'hover:bg-white/5'
                                : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={optionIndex}
                            checked={quizAnswers[index] === optionIndex}
                            onChange={(e) => setQuizAnswers({
                              ...quizAnswers,
                              [index]: parseInt(e.target.value)
                            })}
                            className="sr-only"
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  ))}

                  <button
                    onClick={submitQuiz}
                    className={`w-full px-4 py-2 rounded-xl font-medium transition-colors ${
                      isDark
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Submit Quiz
                  </button>
                </div>
              </>
            ) : currentQuiz && quizScore !== null ? (
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  quizScore >= 70
                    ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                    : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                }`}>
                  <Trophy className="w-8 h-8" />
                </div>
                
                <h4 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {quizScore}%
                </h4>
                
                <p className={`mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {quizScore >= 70 
                    ? "Great job! You're ready for the test!" 
                    : "Keep studying! You can do better next time."
                  }
                </p>
                
                <button
                  onClick={closeQuiz}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    isDark
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  Close
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}

export default NotificationSystem
