import React, { useEffect, useState } from 'react'
import { Trophy, TrendingUp, TrendingDown, Star, Swords, ArrowRight, RotateCcw, Home } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import RankBadge from './RankBadge'
import { RANK_TIERS, getTierFromPoints } from '../services/rankedService'

const RankedResult = ({ result, subject, onClose, onPlayAgain }) => {
  const { isDark } = useTheme()
  const [animationPhase, setAnimationPhase] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const isForfeited = result?.forfeited || false
  const isWin = result?.playerNum === 1 
    ? result?.winner === 'player1' 
    : result?.winner === 'player2'
  const isDraw = result?.winner === 'draw'
  
  const pointChange = result?.playerNum === 1 
    ? result?.player1PointChange 
    : result?.player2PointChange

  const newRankInfo = result?.player1NewRank
  const promoted = newRankInfo?.promoted
  const newTier = newRankInfo?.newTier
  const oldTier = newRankInfo?.oldTier

  useEffect(() => {
    // Animation sequence
    const timers = [
      setTimeout(() => setAnimationPhase(1), 300),
      setTimeout(() => setAnimationPhase(2), 800),
      setTimeout(() => setAnimationPhase(3), 1500),
      setTimeout(() => {
        setAnimationPhase(4)
        if (isWin || promoted) {
          setShowConfetti(true)
        }
      }, 2200)
    ]

    return () => timers.forEach(t => clearTimeout(t))
  }, [isWin, promoted])

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const duration = 3000
      const timer = setTimeout(() => setShowConfetti(false), duration)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      isDark ? 'bg-slate-950' : 'bg-slate-100'
    }`}>
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6'][Math.floor(Math.random() * 5)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Background gradient based on result */}
      <div className={`absolute inset-0 ${
        isForfeited
          ? 'bg-gradient-to-br from-orange-900/30 via-amber-900/20 to-transparent'
          : isWin
            ? 'bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-transparent'
            : isDraw
              ? 'bg-gradient-to-br from-yellow-900/30 via-amber-900/20 to-transparent'
              : 'bg-gradient-to-br from-red-900/30 via-rose-900/20 to-transparent'
      }`} />

      <div className="relative z-10 max-w-lg w-full mx-4">
        {/* Result Card */}
        <div className={`rounded-3xl p-8 ${
          isDark 
            ? 'bg-slate-900/90 border border-white/10' 
            : 'bg-white shadow-2xl'
        }`}>
          {/* Result Icon & Text */}
          <div className={`text-center transform transition-all duration-700 ${
            animationPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className={`text-8xl mb-4 ${
              isWin ? 'animate-bounce' : ''
            }`}>
              {isForfeited 
                ? '🚪' 
                : isWin 
                  ? '🏆' 
                  : isDraw 
                    ? '🤝' 
                    : '💔'}
            </div>
            
            <h1 className={`text-4xl font-black mb-2 ${
              isForfeited
                ? 'text-orange-500'
                : isWin 
                  ? 'text-green-500' 
                  : isDraw 
                    ? 'text-yellow-500' 
                    : 'text-red-500'
            }`}>
              {isForfeited 
                ? (isWin ? 'OPPONENT FORFEITED!' : 'YOU FORFEITED!')
                : isWin 
                  ? 'VICTORY!' 
                  : isDraw 
                    ? 'DRAW!' 
                    : 'DEFEAT'}
            </h1>
            
            <p className={`text-lg ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {isForfeited 
                ? (isWin 
                    ? 'Your opponent left the match. You win!' 
                    : 'You left the match. This counts as a loss.')
                : `Final Score: ${result?.player1Score} - ${result?.player2Score}`}
            </p>
          </div>

          {/* Points Change */}
          <div className={`mt-8 transform transition-all duration-700 delay-300 ${
            animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className={`text-center p-6 rounded-2xl ${
              isDark ? 'bg-white/5' : 'bg-slate-50'
            }`}>
              <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                Rank Points
              </p>
              <div className={`flex items-center justify-center gap-3 text-3xl font-black ${
                pointChange >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {pointChange >= 0 ? (
                  <TrendingUp className="h-8 w-8" />
                ) : (
                  <TrendingDown className="h-8 w-8" />
                )}
                <span>
                  {pointChange >= 0 ? '+' : ''}{pointChange}
                </span>
              </div>
              <p className={`mt-2 text-sm ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                New Total: {newRankInfo?.newPoints || 0} points
              </p>
            </div>
          </div>

          {/* Rank Badge & Promotion */}
          <div className={`mt-6 transform transition-all duration-700 delay-500 ${
            animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {promoted ? (
              // Promotion animation
              <div className="text-center">
                <p className={`text-lg font-bold mb-4 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  <Star className="inline h-5 w-5 mr-2" />
                  RANK UP!
                </p>
                <div className="flex items-center justify-center gap-4">
                  <RankBadge tier={oldTier} size="md" showPoints={false} />
                  <ArrowRight className={`h-8 w-8 ${isDark ? 'text-yellow-400' : 'text-yellow-600'} animate-pulse`} />
                  <div className="animate-pulse">
                    <RankBadge tier={newTier} size="lg" showPoints={false} />
                  </div>
                </div>
                <p className={`mt-4 text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  You've reached {RANK_TIERS[newTier]?.name}!
                </p>
              </div>
            ) : (
              // Normal rank display
              <div className="flex justify-center">
                <RankBadge 
                  tier={newTier || oldTier || 'BRONZE'} 
                  points={newRankInfo?.newPoints || 0}
                  size="lg"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`mt-8 grid grid-cols-2 gap-4 transform transition-all duration-700 delay-700 ${
            animationPhase >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <button
              onClick={onClose}
              className={`py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Home className="h-5 w-5" />
              Exit
            </button>
            <button
              onClick={onPlayAgain}
              className="py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-[1.02] shadow-lg shadow-purple-500/30"
            >
              <Swords className="h-5 w-5" />
              Play Again
            </button>
          </div>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s linear forwards;
        }
      `}</style>
    </div>
  )
}

export default RankedResult

