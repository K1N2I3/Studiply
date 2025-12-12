import React from 'react'
import { RANK_TIERS } from '../services/rankedService'

const RankBadge = ({ tier, points, size = 'md', showPoints = true, showName = true, className = '' }) => {
  const tierInfo = RANK_TIERS[tier] || RANK_TIERS.BRONZE
  
  const sizes = {
    sm: { icon: 'text-xl', text: 'text-xs', container: 'px-2 py-1' },
    md: { icon: 'text-3xl', text: 'text-sm', container: 'px-3 py-2' },
    lg: { icon: 'text-5xl', text: 'text-base', container: 'px-4 py-3' },
    xl: { icon: 'text-7xl', text: 'text-lg', container: 'px-6 py-4' }
  }
  
  const sizeConfig = sizes[size] || sizes.md
  
  // Glow effect based on tier
  const glowColors = {
    BRONZE: 'shadow-orange-500/30',
    SILVER: 'shadow-gray-400/40',
    GOLD: 'shadow-yellow-500/50',
    PLATINUM: 'shadow-cyan-400/50',
    DIAMOND: 'shadow-blue-400/60',
    MASTER: 'shadow-purple-500/70'
  }
  
  const bgColors = {
    BRONZE: 'from-orange-900/50 to-orange-700/30',
    SILVER: 'from-gray-700/50 to-gray-500/30',
    GOLD: 'from-yellow-700/50 to-yellow-500/30',
    PLATINUM: 'from-cyan-800/50 to-cyan-600/30',
    DIAMOND: 'from-blue-800/50 to-blue-500/30',
    MASTER: 'from-purple-900/50 via-pink-700/30 to-purple-800/50'
  }

  return (
    <div 
      className={`inline-flex flex-col items-center rounded-xl bg-gradient-to-br ${bgColors[tier]} 
        shadow-lg ${glowColors[tier]} ${sizeConfig.container} ${className}`}
    >
      <span className={`${sizeConfig.icon} drop-shadow-lg`} role="img" aria-label={tierInfo.name}>
        {tierInfo.icon}
      </span>
      {showName && (
        <span className={`${sizeConfig.text} font-bold text-white mt-1`}>
          {tierInfo.name}
        </span>
      )}
      {showPoints && points !== undefined && (
        <span className={`${sizeConfig.text} text-white/70`}>
          {points} pts
        </span>
      )}
    </div>
  )
}

export default RankBadge

