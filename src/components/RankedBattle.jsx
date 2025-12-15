import React, { useState, useEffect, useRef } from 'react'
import { Swords, Clock, CheckCircle, XCircle, Zap, User, Bot, Shield, Medal, Trophy, Gem, Diamond, Crown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import RankBadge from './RankBadge'
import {
  getMatch,
  startMatch,
  submitAnswer,
  nextQuestion,
  RANK_TIERS
} from '../services/rankedService'

// Map tier to icon component
const TIER_ICONS = {
  BRONZE: Shield,
  SILVER: Medal,
  GOLD: Trophy,
  PLATINUM: Gem,
  DIAMOND: Diamond,
  MASTER: Crown
}

const RankedBattle = ({ matchId, userId, opponent, subject, difficulty, onComplete, onExit }) => {
  const { isDark } = useTheme()
  const timerRef = useRef(null)
  const questionStartTimeRef = useRef(null)
  const pendingAnswerRef = useRef(null)  // Store answer result until opponent answers

  // Match state
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Question state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [answerResult, setAnswerResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [waitingForOpponent, setWaitingForOpponent] = useState(false)
  
  // Scores
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  
  // Match complete
  const [matchComplete, setMatchComplete] = useState(false)
  const [matchResult, setMatchResult] = useState(null)

  // Load match data
  useEffect(() => {
    loadMatch()
  }, [matchId])

  // Start timer when question begins
  useEffect(() => {
    if (match && !answerSubmitted && !matchComplete) {
      questionStartTimeRef.current = Date.now()
      setTimeLeft(15)
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - auto submit wrong answer
            clearInterval(timerRef.current)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => clearInterval(timerRef.current)
  }, [currentQuestionIndex, match, answerSubmitted])

  const loadMatch = async () => {
    setLoading(true)
    try {
      const result = await getMatch(matchId, userId)
      if (result.success) {
        setMatch(result.match)
        setCurrentQuestionIndex(result.match.currentQuestion)
        setPlayer1Score(result.match.player1Score)
        setPlayer2Score(result.match.player2Score)
        
        // Start match if pending
        if (result.match.status === 'pending') {
          await startMatch(matchId)
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTimeUp = async () => {
    if (answerSubmitted) return
    
    // Submit -1 (no answer) when time runs out
    await handleSubmitAnswer(-1)
  }

  const handleSelectAnswer = (index) => {
    if (answerSubmitted) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = async (answerIndex = selectedAnswer) => {
    if (answerSubmitted || answerIndex === null) return
    
    clearInterval(timerRef.current)
    setAnswerSubmitted(true)
    
    const answerTime = Date.now() - questionStartTimeRef.current

    try {
      console.log(`📝 Submitting Q${currentQuestionIndex}, answer: ${answerIndex}`)
      
      const result = await submitAnswer({
        matchId,
        userId,
        questionIndex: currentQuestionIndex,
        answer: answerIndex,
        answerTime
      })

      if (result.success) {
        // Store the result but DON'T show it yet if opponent hasn't answered
        const answerData = {
          correct: result.correct,
          correctAnswer: result.correctAnswer
        }
        
        setPlayer1Score(result.player1Score)
        setPlayer2Score(result.player2Score)

        console.log(`📝 Result: correct=${result.correct}, bothAnswered=${result.bothAnswered}`)

        if (result.bothAnswered) {
          // Both answered - NOW show the result
          setAnswerResult(answerData)
          setTimeout(() => moveToNextQuestion(), 1500)
        } else {
          // Wait for opponent - don't show result yet
          setWaitingForOpponent(true)
          // Store pending result to show later
          pendingAnswerRef.current = answerData
          startPolling()
        }
      }
    } catch (err) {
      console.error('Error submitting answer:', err)
    }
  }

  const pollIntervalRef = useRef(null)

  const startPolling = () => {
    // Clear any existing poll
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }

    let pollCount = 0
    const maxPolls = 40 // 20 seconds max (500ms * 40)
    
    pollIntervalRef.current = setInterval(async () => {
      pollCount++
      
      try {
        const result = await nextQuestion(matchId, userId, currentQuestionIndex)
        
        if (result.success) {
          console.log(`🔄 Poll ${pollCount}: ${result.status}, serverQ: ${result.currentQuestion}`)
          
          if (result.status === 'completed') {
            clearInterval(pollIntervalRef.current)
            // Show pending answer result before match complete
            if (pendingAnswerRef.current) {
              setAnswerResult(pendingAnswerRef.current)
              pendingAnswerRef.current = null
            }
            setTimeout(() => handleMatchComplete(result), 1000)
          } else if (result.status === 'continue' || result.status === 'sync') {
            // Both answered - show result first, then advance
            clearInterval(pollIntervalRef.current)
            setPlayer1Score(result.player1Score)
            setPlayer2Score(result.player2Score)
            
            // Show the pending answer result
            if (pendingAnswerRef.current) {
              setAnswerResult(pendingAnswerRef.current)
              setWaitingForOpponent(false)
              pendingAnswerRef.current = null
              // Wait to show result, then advance
              setTimeout(() => handleNextQuestion(result.currentQuestion), 1500)
            } else {
              handleNextQuestion(result.currentQuestion)
            }
          } else if (result.status === 'waiting') {
            setPlayer1Score(result.player1Score)
            setPlayer2Score(result.player2Score)
          }
        }
        
        if (pollCount >= maxPolls) {
          clearInterval(pollIntervalRef.current)
          // Force advance
          moveToNextQuestion()
        }
      } catch (err) {
        console.error('Poll error:', err)
      }
    }, 500)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  const handleMatchComplete = (result) => {
    // Stop any polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    
    setMatchComplete(true)
    const isPlayer1 = match?.playerNum === 1
    const myPointChange = isPlayer1 ? result.player1PointChange : result.player2PointChange
    
    setMatchResult({
      winner: result.winner,
      playerNum: result.playerNum || match?.playerNum,
      player1Score: result.player1Score,
      player2Score: result.player2Score,
      player1PointChange: result.player1PointChange,
      player2PointChange: result.player2PointChange,
      pointChange: myPointChange
    })
    
    console.log(`🏁 Match complete! Winner: ${result.winner}, My points: ${myPointChange > 0 ? '+' : ''}${myPointChange}`)
    
    // Notify parent after delay
    setTimeout(() => {
      onComplete({
        ...result,
        playerNum: match?.playerNum || result.playerNum,
        pointChange: myPointChange
      })
    }, 3000)
  }

  const handleNextQuestion = async (nextQuestionIndex) => {
    console.log(`⏭️ Moving to Q${nextQuestionIndex}`)
    setCurrentQuestionIndex(nextQuestionIndex)
    setSelectedAnswer(null)
    setAnswerSubmitted(false)
    setAnswerResult(null)
    setWaitingForOpponent(false)
    pendingAnswerRef.current = null
    
    // Reload match to get new question
    await loadMatch()
  }

  const moveToNextQuestion = async () => {
    try {
      const result = await nextQuestion(matchId, userId, currentQuestionIndex)
      
      console.log(`⏭️ Next result:`, result.status)
      
      if (result.success) {
        if (result.status === 'completed') {
          handleMatchComplete(result)
        } else if (result.status === 'continue' || result.status === 'sync') {
          handleNextQuestion(result.currentQuestion)
        } else if (result.status === 'waiting') {
          // Still waiting - this shouldn't happen after timeout but handle it
          setPlayer1Score(result.player1Score)
          setPlayer2Score(result.player2Score)
        }
      }
    } catch (err) {
      console.error('Error moving to next question:', err)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-slate-950' : 'bg-slate-100'
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className={isDark ? 'text-white/60' : 'text-slate-600'}>Loading battle...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-slate-950' : 'bg-slate-100'
      }`}>
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={onExit} className="px-4 py-2 bg-purple-500 text-white rounded-lg">
            Exit
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = match?.questions?.[currentQuestionIndex]
  const isPlayer1 = match?.playerNum === 1

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-[#0a0615] via-[#1a0a2e] to-[#0d0520]' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100'
    }`}>
      {/* Header - Scores */}
      <div className={`sticky top-0 z-20 px-6 py-4 ${
        isDark ? 'bg-black/50 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Player 1 (You) */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <User className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                You
              </p>
              <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {(() => {
                  const TierIcon = TIER_ICONS[match?.player1?.tier] || Shield
                  return <TierIcon className="h-3 w-3" />
                })()}
                {match?.player1?.tier}
              </p>
            </div>
            <div className={`text-4xl font-black ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {isPlayer1 ? player1Score : player2Score}
            </div>
          </div>

          {/* VS & Timer */}
          <div className="text-center">
            <div className={`text-2xl font-black ${isDark ? 'text-white/30' : 'text-slate-300'}`}>
              VS
            </div>
            <div className={`flex items-center justify-center gap-2 mt-1 ${
              timeLeft <= 5 ? 'text-red-500 animate-pulse' : isDark ? 'text-white/60' : 'text-slate-500'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>

          {/* Player 2 (Opponent) */}
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-black ${
              isDark ? 'text-pink-400' : 'text-pink-600'
            }`}>
              {isPlayer1 ? player2Score : player1Score}
            </div>
            <div className="text-right">
              <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {opponent?.userName || 'Opponent'}
              </p>
              <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {opponent?.isBot ? (
                  <><Bot className="h-3 w-3" /> Bot</>
                ) : (
                  <>
                    {(() => {
                      const TierIcon = TIER_ICONS[opponent?.tier] || Shield
                      return <TierIcon className="h-3 w-3" />
                    })()}
                    {opponent?.tier || 'BRONZE'}
                  </>
                )}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-pink-500/20' : 'bg-pink-100'
            }`}>
              {opponent?.isBot 
                ? <Bot className={`h-6 w-6 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
                : <User className={`h-6 w-6 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
              }
            </div>
          </div>
        </div>

        {/* Question Progress */}
        <div className="max-w-4xl mx-auto mt-4">
          <div className="flex gap-2">
            {Array.from({ length: match?.totalQuestions || 5 }).map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i < currentQuestionIndex
                    ? 'bg-green-500'
                    : i === currentQuestionIndex
                      ? 'bg-purple-500'
                      : isDark ? 'bg-white/10' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className={`text-xs text-center mt-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Question {currentQuestionIndex + 1} of {match?.totalQuestions || 5}
          </p>
        </div>
      </div>

      {/* Question Area */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {matchComplete ? (
          // Match Complete Screen
          <div className="text-center py-16">
            {(() => {
              const iWon = (matchResult?.winner === 'player1' && isPlayer1) || 
                           (matchResult?.winner === 'player2' && !isPlayer1)
              const isDraw = matchResult?.winner === 'draw'
              const myPointChange = matchResult?.pointChange ?? 
                (isPlayer1 ? matchResult?.player1PointChange : matchResult?.player2PointChange)
              
              return (
                <>
                  <div className={`text-6xl mb-6 ${iWon ? 'animate-bounce' : ''}`}>
                    {iWon ? '🎉' : isDraw ? '🤝' : '😔'}
                  </div>
                  <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {iWon ? 'Victory!' : isDraw ? 'Draw!' : 'Defeat'}
                  </h2>
                  <p className={`text-xl ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                    Final Score: {isPlayer1 ? player1Score : player2Score} - {isPlayer1 ? player2Score : player1Score}
                  </p>
                  <div className={`mt-4 text-2xl font-bold ${
                    myPointChange > 0 ? 'text-green-500' : myPointChange < 0 ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {myPointChange > 0 ? '+' : ''}{myPointChange || 0} points
                  </div>
                  <p className={`mt-2 text-sm ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    Returning to lobby...
                  </p>
                </>
              )
            })()}
          </div>
        ) : currentQuestion ? (
          <>
            {/* Question */}
            <div className={`rounded-3xl p-8 mb-8 ${
              isDark 
                ? 'bg-white/5 border border-white/10' 
                : 'bg-white shadow-xl'
            }`}>
              <h2 className={`text-xl md:text-2xl font-bold leading-relaxed ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid md:grid-cols-2 gap-4">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedAnswer === index
                // Only reveal correct/wrong AFTER both players answered (not waiting anymore)
                const canReveal = answerSubmitted && !waitingForOpponent && answerResult !== null
                const isCorrect = canReveal && answerResult.correctAnswer === index
                const isWrong = canReveal && isSelected && answerResult.correctAnswer !== index
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={answerSubmitted}
                    className={`p-5 rounded-2xl text-left transition-all ${
                      canReveal
                        ? isCorrect
                          ? 'bg-green-500 text-white ring-4 ring-green-500/30'
                          : isWrong
                            ? 'bg-red-500 text-white ring-4 ring-red-500/30'
                            : isDark
                              ? 'bg-white/5 text-white/50'
                              : 'bg-slate-100 text-slate-400'
                        : answerSubmitted && isSelected
                          ? 'bg-yellow-500 text-white ring-4 ring-yellow-500/30'  // Submitted but waiting
                          : isSelected
                            ? 'bg-purple-500 text-white ring-4 ring-purple-500/30 scale-[1.02]'
                            : isDark
                              ? 'bg-white/5 text-white hover:bg-white/10'
                              : 'bg-white text-slate-900 hover:bg-slate-50 shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        canReveal
                          ? isCorrect || isWrong
                            ? 'bg-white/20'
                            : isDark ? 'bg-white/10' : 'bg-slate-200'
                          : answerSubmitted && isSelected
                            ? 'bg-white/20'
                            : isSelected
                              ? 'bg-white/20'
                              : isDark ? 'bg-white/10' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {canReveal && isCorrect ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : canReveal && isWrong ? (
                          <XCircle className="h-6 w-6" />
                        ) : answerSubmitted && isSelected ? (
                          <Clock className="h-5 w-5 animate-pulse" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="flex-1 font-medium">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Submit Button */}
            {!answerSubmitted && selectedAnswer !== null && (
              <button
                onClick={() => handleSubmitAnswer()}
                className="w-full mt-6 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/30 hover:scale-[1.02] transition-all"
              >
                <Zap className="inline h-5 w-5 mr-2" />
                Submit Answer
              </button>
            )}

            {/* Waiting for opponent - yellow status */}
            {waitingForOpponent && (
              <div className={`mt-6 p-4 rounded-xl text-center ${
                isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Waiting for opponent...</span>
                </div>
              </div>
            )}

            {/* Answer Result Feedback - only shows after both answered */}
            {answerSubmitted && !waitingForOpponent && answerResult && (
              <div className={`mt-6 p-4 rounded-xl text-center ${
                answerResult.correct
                  ? isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-700'
                  : isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700'
              }`}>
                {answerResult.correct ? (
                  <>
                    <CheckCircle className="inline h-6 w-6 mr-2" />
                    Correct! +1 point
                  </>
                ) : (
                  <>
                    <XCircle className="inline h-6 w-6 mr-2" />
                    Wrong! The correct answer was {String.fromCharCode(65 + answerResult.correctAnswer)}
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className={isDark ? 'text-white/60' : 'text-slate-600'}>Loading question...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RankedBattle

