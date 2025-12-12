import React, { useState, useEffect, useRef } from 'react'
import { Swords, Clock, CheckCircle, XCircle, Zap, User, Bot } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import RankBadge from './RankBadge'
import {
  getMatch,
  startMatch,
  submitAnswer,
  nextQuestion,
  RANK_TIERS
} from '../services/rankedService'

const RankedBattle = ({ matchId, userId, opponent, subject, difficulty, onComplete, onExit }) => {
  const { isDark } = useTheme()
  const timerRef = useRef(null)
  const questionStartTimeRef = useRef(null)

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
      const result = await submitAnswer({
        matchId,
        userId,
        questionIndex: currentQuestionIndex,
        answer: answerIndex,
        answerTime
      })

      if (result.success) {
        setAnswerResult({
          correct: result.correct,
          correctAnswer: result.correctAnswer
        })
        setPlayer1Score(result.player1Score)
        setPlayer2Score(result.player2Score)

        if (result.bothAnswered) {
          // Move to next question after delay
          setTimeout(() => moveToNextQuestion(), 2000)
        } else {
          // Wait for opponent
          setWaitingForOpponent(true)
          pollForOpponentAnswer()
        }
      }
    } catch (err) {
      console.error('Error submitting answer:', err)
    }
  }

  const pollForOpponentAnswer = () => {
    const pollInterval = setInterval(async () => {
      try {
        const result = await getMatch(matchId, userId)
        if (result.success) {
          const question = result.match.questions[currentQuestionIndex]
          const playerNum = result.match.playerNum
          
          // Check if opponent answered
          const opponentAnswered = playerNum === 1 
            ? question.player2Answer !== undefined && question.player2Answer !== -1
            : question.player1Answer !== undefined && question.player1Answer !== -1

          if (opponentAnswered || question.player1Answer !== -1 && question.player2Answer !== -1) {
            clearInterval(pollInterval)
            setPlayer1Score(result.match.player1Score)
            setPlayer2Score(result.match.player2Score)
            setTimeout(() => moveToNextQuestion(), 1500)
          }
        }
      } catch (err) {
        console.error('Poll error:', err)
      }
    }, 1000)

    // Clear after 20 seconds max
    setTimeout(() => {
      clearInterval(pollInterval)
      moveToNextQuestion()
    }, 20000)
  }

  const moveToNextQuestion = async () => {
    try {
      const result = await nextQuestion(matchId)
      
      if (result.success) {
        if (result.status === 'completed') {
          // Match is over
          setMatchComplete(true)
          setMatchResult({
            winner: result.winner,
            player1Score: result.player1Score,
            player2Score: result.player2Score,
            player1PointChange: result.player1PointChange,
            player2PointChange: result.player2PointChange,
            newRank: result.player1NewRank
          })
          
          // Notify parent
          setTimeout(() => {
            onComplete({
              ...result,
              playerNum: match.playerNum
            })
          }, 3000)
        } else {
          // Next question
          setCurrentQuestionIndex(result.currentQuestion)
          setSelectedAnswer(null)
          setAnswerSubmitted(false)
          setAnswerResult(null)
          setWaitingForOpponent(false)
          
          // Reload match to get new question
          await loadMatch()
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
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {RANK_TIERS[match?.player1?.tier]?.icon} {match?.player1?.tier}
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
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {opponent?.isBot ? '🤖 Bot' : `${RANK_TIERS[opponent?.tier]?.icon || ''} ${opponent?.tier || 'BRONZE'}`}
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
            <div className={`text-6xl mb-6 ${
              matchResult?.winner === 'player1' && isPlayer1 || matchResult?.winner === 'player2' && !isPlayer1
                ? 'animate-bounce'
                : ''
            }`}>
              {matchResult?.winner === 'player1' && isPlayer1 || matchResult?.winner === 'player2' && !isPlayer1
                ? '🎉'
                : matchResult?.winner === 'draw'
                  ? '🤝'
                  : '😔'}
            </div>
            <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {matchResult?.winner === 'player1' && isPlayer1 || matchResult?.winner === 'player2' && !isPlayer1
                ? 'Victory!'
                : matchResult?.winner === 'draw'
                  ? 'Draw!'
                  : 'Defeat'}
            </h2>
            <p className={`text-xl ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Final Score: {player1Score} - {player2Score}
            </p>
            <div className={`mt-4 text-lg font-bold ${
              matchResult?.player1PointChange > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {matchResult?.player1PointChange > 0 ? '+' : ''}{matchResult?.player1PointChange} points
            </div>
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
                const isCorrect = answerResult?.correctAnswer === index
                const isWrong = answerSubmitted && isSelected && !isCorrect
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={answerSubmitted}
                    className={`p-5 rounded-2xl text-left transition-all ${
                      answerSubmitted
                        ? isCorrect
                          ? 'bg-green-500 text-white ring-4 ring-green-500/30'
                          : isWrong
                            ? 'bg-red-500 text-white ring-4 ring-red-500/30'
                            : isDark
                              ? 'bg-white/5 text-white/50'
                              : 'bg-slate-100 text-slate-400'
                        : isSelected
                          ? 'bg-purple-500 text-white ring-4 ring-purple-500/30 scale-[1.02]'
                          : isDark
                            ? 'bg-white/5 text-white hover:bg-white/10'
                            : 'bg-white text-slate-900 hover:bg-slate-50 shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        answerSubmitted
                          ? isCorrect
                            ? 'bg-white/20'
                            : isWrong
                              ? 'bg-white/20'
                              : isDark ? 'bg-white/10' : 'bg-slate-200'
                          : isSelected
                            ? 'bg-white/20'
                            : isDark ? 'bg-white/10' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {answerSubmitted && isCorrect ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : answerSubmitted && isWrong ? (
                          <XCircle className="h-6 w-6" />
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

            {/* Waiting for opponent */}
            {waitingForOpponent && (
              <div className={`mt-6 p-4 rounded-xl text-center ${
                isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Waiting for opponent...
              </div>
            )}

            {/* Answer Result Feedback */}
            {answerSubmitted && answerResult && !waitingForOpponent && (
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

