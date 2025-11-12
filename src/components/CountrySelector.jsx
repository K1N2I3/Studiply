import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const COUNTRY_DATA = [
  { code: 'IT', name: 'Italy', flag: '🇮🇹', prefix: '+39' },
  { code: 'US', name: 'United States', flag: '🇺🇸', prefix: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', prefix: '+44' },
  { code: 'FR', name: 'France', flag: '🇫🇷', prefix: '+33' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', prefix: '+49' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', prefix: '+34' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', prefix: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', prefix: '+61' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', prefix: '+81' },
  { code: 'CN', name: 'China', flag: '🇨🇳', prefix: '+86' },
  { code: 'IN', name: 'India', flag: '🇮🇳', prefix: '+91' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', prefix: '+55' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', prefix: '+52' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', prefix: '+7' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', prefix: '+82' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', prefix: '+31' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', prefix: '+32' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', prefix: '+41' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', prefix: '+43' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', prefix: '+46' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', prefix: '+47' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', prefix: '+45' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', prefix: '+358' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', prefix: '+48' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', prefix: '+420' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', prefix: '+36' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', prefix: '+351' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', prefix: '+30' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', prefix: '+90' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', prefix: '+966' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', prefix: '+971' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', prefix: '+65' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', prefix: '+852' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', prefix: '+886' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', prefix: '+66' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', prefix: '+60' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', prefix: '+62' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', prefix: '+63' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', prefix: '+84' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', prefix: '+27' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', prefix: '+20' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', prefix: '+234' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', prefix: '+254' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', prefix: '+54' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', prefix: '+56' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', prefix: '+57' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', prefix: '+51' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', prefix: '+58' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', prefix: '+64' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', prefix: '+972' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', prefix: '+98' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', prefix: '+92' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', prefix: '+880' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', prefix: '+94' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', prefix: '+977' }
]

const CountrySelector = ({ selectedCountry, onCountrySelect, className = '' }) => {
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // 关闭下拉菜单当点击外部
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 过滤国家列表
  const filteredCountries = COUNTRY_DATA.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.prefix.includes(searchTerm)
  )

  const handleCountrySelect = (country) => {
    onCountrySelect(country)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 选择器按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 border rounded-l-xl transition-all ${
          isDark
            ? 'border-white/20 bg-white/5 hover:bg-white/10 text-white focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400/50'
            : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        }`}
      >
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className={`text-sm font-medium ${
          isDark ? 'text-white' : 'text-gray-700'
        }`}>{selectedCountry.prefix}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${
          isDark ? 'text-white/70' : 'text-gray-500'
        } ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-80 border rounded-xl shadow-xl z-50 max-h-64 overflow-hidden ${
          isDark
            ? 'bg-slate-800 border-white/20'
            : 'bg-white border-gray-300'
        }`}>
          {/* 搜索框 */}
          <div className={`p-3 border-b ${
            isDark ? 'border-white/10' : 'border-gray-200'
          }`}>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm transition-all ${
                isDark
                  ? 'border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:ring-purple-500/30 focus:border-purple-400/50'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              autoFocus
            />
          </div>

          {/* 国家列表 */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                  selectedCountry.code === country.code
                    ? isDark
                      ? 'bg-purple-500/20'
                      : 'bg-blue-50'
                    : isDark
                      ? 'hover:bg-white/10'
                      : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{country.name}</div>
                  <div className={`text-xs ${
                    isDark ? 'text-white/60' : 'text-gray-500'
                  }`}>{country.code}</div>
                </div>
                <span className={`text-sm font-mono ${
                  isDark ? 'text-white/80' : 'text-gray-600'
                }`}>{country.prefix}</span>
              </button>
            ))}
            
            {filteredCountries.length === 0 && (
              <div className={`px-4 py-3 text-sm text-center ${
                isDark ? 'text-white/60' : 'text-gray-500'
              }`}>
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountrySelector
