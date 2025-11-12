import React, { useState, useEffect } from 'react'
import CountrySelector from './CountrySelector'
import { useTheme } from '../contexts/ThemeContext'

const PhoneNumberInput = ({ value, onChange, placeholder = "Phone number", className = '' }) => {
  const { isDark } = useTheme()
  const [country, setCountry] = useState({ code: 'IT', name: 'Italy', flag: '🇮🇹', prefix: '+39' })
  const [phoneNumber, setPhoneNumber] = useState('')

  // 解析初始值
  useEffect(() => {
    if (value) {
      // 查找匹配的国家代码
      const countryData = [
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

      const foundCountry = countryData.find(c => value.startsWith(c.prefix))
      if (foundCountry) {
        setCountry(foundCountry)
        setPhoneNumber(value.replace(foundCountry.prefix, '').trim())
      } else {
        // 如果没有找到匹配的国家代码，尝试提取数字
        const match = value.match(/^(\+\d{1,4})\s*(.*)/)
        if (match) {
          const prefix = match[1]
          const number = match[2]
          const foundByPrefix = countryData.find(c => c.prefix === prefix)
          if (foundByPrefix) {
            setCountry(foundByPrefix)
            setPhoneNumber(number)
          } else {
            setPhoneNumber(value)
          }
        } else {
          setPhoneNumber(value)
        }
      }
    }
  }, [value])

  const handlePhoneNumberChange = (e) => {
    const newNumber = e.target.value
    setPhoneNumber(newNumber)
    
    // 组合完整的电话号码
    const fullNumber = country.prefix + ' ' + newNumber
    onChange(fullNumber)
  }

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry)
    
    // 组合完整的电话号码
    const fullNumber = newCountry.prefix + ' ' + phoneNumber
    onChange(fullNumber)
  }

  return (
    <div className={`flex ${className}`}>
      <CountrySelector
        selectedCountry={country}
        onCountrySelect={handleCountryChange}
      />
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        className={`flex-1 border-l-0 rounded-r-xl px-4 py-3 transition-all ${
          isDark
            ? 'border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30 focus:bg-white/10'
            : 'border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:bg-purple-50'
        }`}
      />
    </div>
  )
}

export default PhoneNumberInput
