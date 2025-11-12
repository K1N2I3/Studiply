import React, { useState, useEffect } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  Sun, 
  Moon, 
  Palette, 
  User, 
  Bell, 
  Shield, 
  Globe,
  Save,
  RotateCcw,
  Settings as SettingsIcon
} from 'lucide-react'

const Settings = () => {
  const { user } = useSimpleAuth()
  const { showSuccess, showError } = useNotification()
  const { theme, toggleTheme, isDark } = useTheme()
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    language: 'en',
    timezone: 'UTC'
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
    setSettings(prev => ({ ...prev, ...savedSettings }))
  }, [])

  const handleThemeChange = (newTheme) => {
    toggleTheme(newTheme)
    showSuccess('Theme updated successfully!', 3000, 'Theme Changed')
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings))
    showSuccess('Settings saved successfully!', 3000, 'Settings Saved')
  }

  const resetSettings = () => {
    const defaultSettings = {
      notifications: true,
      emailUpdates: true,
      language: 'en',
      timezone: 'UTC'
    }
    setSettings(defaultSettings)
    toggleTheme('light')
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings))
    showSuccess('Settings reset to default!', 3000, 'Settings Reset')
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute top-1/2 right-12 h-64 w-64 rounded-full bg-pink-400/25 blur-[120px]" />
        <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-blue-400/20 blur-[120px]" />
      </div>
      
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 hide-scrollbar">
        {/* Hero Section */}
        <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-500">
            <SettingsIcon className="h-4 w-4" /> Customize your experience
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
            Settings
          </h1>
          <p className={`mt-3 max-w-xl text-sm md:text-base ${
            isDark ? 'text-white/70' : 'text-slate-600'
          }`}>
            Personalize your learning journey with theme preferences, notifications, and more.
          </p>
        </section>

        {/* Theme Settings */}
        <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Theme Settings</h2>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>Choose your preferred color scheme</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`relative p-6 rounded-[24px] border-2 transition-all duration-300 text-left ${
                theme === 'light'
                  ? isDark
                    ? 'border-purple-400/50 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                    : 'border-purple-500 bg-purple-50 shadow-lg'
                  : isDark
                    ? 'border-white/10 bg-white/5 hover:border-purple-400/30 hover:bg-white/8'
                    : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg">
                  <Sun className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Light Mode</h3>
                  <p className={`text-sm mt-1 ${
                    isDark ? 'text-white/70' : 'text-slate-600'
                  }`}>Clean and bright interface</p>
                </div>
              </div>
              {theme === 'light' && (
                <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
              )}
            </button>
            
            <button
              onClick={() => handleThemeChange('dark')}
              className={`relative p-6 rounded-[24px] border-2 transition-all duration-300 text-left ${
                theme === 'dark'
                  ? isDark
                    ? 'border-purple-400/50 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                    : 'border-purple-500 bg-purple-50 shadow-lg'
                  : isDark
                    ? 'border-white/10 bg-white/5 hover:border-purple-400/30 hover:bg-white/8'
                    : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-purple-600 text-white shadow-lg">
                  <Moon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Dark Mode</h3>
                  <p className={`text-sm mt-1 ${
                    isDark ? 'text-white/70' : 'text-slate-600'
                  }`}>Easy on the eyes</p>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
              )}
            </button>
          </div>
        </section>

        {/* Notification Settings */}
        <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 text-white shadow-lg">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Notifications</h2>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>Manage your notification preferences</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-5 rounded-[20px] border transition-all ${
              isDark ? 'border-white/10 bg-white/5 hover:bg-white/8' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}>
              <div className="flex-1">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Push Notifications</h3>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>Receive notifications for new messages and updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-12 h-6 rounded-full transition-all duration-300 peer-focus:outline-none peer-focus:ring-4 ${
                  settings.notifications
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 peer-focus:ring-purple-500/30'
                    : isDark
                      ? 'bg-white/20 peer-focus:ring-white/20'
                      : 'bg-slate-300 peer-focus:ring-slate-300'
                }`}>
                  <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all duration-300 shadow-lg ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>
            
            <div className={`flex items-center justify-between p-5 rounded-[20px] border transition-all ${
              isDark ? 'border-white/10 bg-white/5 hover:bg-white/8' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}>
              <div className="flex-1">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Email Updates</h3>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>Get weekly summaries and important updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={settings.emailUpdates}
                  onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className={`w-12 h-6 rounded-full transition-all duration-300 peer-focus:outline-none peer-focus:ring-4 ${
                  settings.emailUpdates
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 peer-focus:ring-purple-500/30'
                    : isDark
                      ? 'bg-white/20 peer-focus:ring-white/20'
                      : 'bg-slate-300 peer-focus:ring-slate-300'
                }`}>
                  <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all duration-300 shadow-lg ${
                    settings.emailUpdates ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Language & Region Settings */}
        <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Language & Region</h2>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>Customize your language and timezone preferences</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className={`w-full p-3 rounded-xl border transition-all ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                    : 'border-slate-200 bg-white text-slate-900 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                }`}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="zh">Mandarin</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className={`w-full p-3 rounded-xl border transition-all ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                    : 'border-slate-200 bg-white text-slate-900 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                }`}
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 text-white shadow-lg">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Account</h2>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>Manage your account information</p>
            </div>
          </div>
          
          <div className={`p-5 rounded-[20px] border ${
            isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${
                  isDark ? 'text-white/90' : 'text-slate-700'
                }`}>
                  Logged in as
                </p>
                <p className={`text-base mt-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {user?.email || user?.username || 'Guest'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={saveSettings}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${
              isDark
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-blue-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            <Save className="h-5 w-5" />
            Save Settings
          </button>
          
          <button
            onClick={resetSettings}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
              isDark
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <RotateCcw className="h-5 w-5" />
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
