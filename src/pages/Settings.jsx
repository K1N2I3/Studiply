import React, { useState, useEffect } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { useTheme } from '../contexts/ThemeContext'
import { requestEmailChange } from '../services/emailChangeService'
import { 
  Sun, 
  Moon, 
  Palette, 
  User, 
  Save,
  RotateCcw,
  Settings as SettingsIcon,
  Mail,
  X
} from 'lucide-react'

const Settings = () => {
  const { user } = useSimpleAuth()
  const { showSuccess, showError } = useNotification()
  const { theme, toggleTheme, isDark } = useTheme()
  const [settings, setSettings] = useState({})
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [isChangingEmail, setIsChangingEmail] = useState(false)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
    setSettings(prev => ({ ...prev, ...savedSettings }))
  }, [])

  const handleThemeChange = (newTheme) => {
    toggleTheme(newTheme)
    showSuccess('Theme updated successfully!', 3000, 'Theme Changed')
  }

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings))
    showSuccess('Settings saved successfully!', 3000, 'Settings Saved')
  }

  const resetSettings = () => {
    const defaultSettings = {}
    setSettings(defaultSettings)
    toggleTheme('light')
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings))
    showSuccess('Settings reset to default!', 3000, 'Settings Reset')
  }

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.trim()) {
      showError('Please enter a new email address', 3000, 'Error')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      showError('Please enter a valid email address', 3000, 'Error')
      return
    }

    // Check if new email is same as current
    if (newEmail.toLowerCase().trim() === user?.email?.toLowerCase().trim()) {
      showError('New email must be different from your current email', 3000, 'Error')
      return
    }

    try {
      setIsChangingEmail(true)
      const result = await requestEmailChange(user.id, newEmail, user.email)

      if (result.success) {
        showSuccess('Verification email sent! Please check your new email inbox.', 5000, 'Email Sent')
        setShowChangeEmailModal(false)
        setNewEmail('')
      } else {
        showError(result.error || 'Failed to send verification email', 5000, 'Error')
      }
    } catch (error) {
      console.error('Error changing email:', error)
      showError('An unexpected error occurred. Please try again.', 5000, 'Error')
    } finally {
      setIsChangingEmail(false)
    }
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
            <div className="flex items-center justify-between mb-4">
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
            <button
              onClick={() => setShowChangeEmailModal(true)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg ${
                isDark
                  ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Mail className="h-4 w-4" />
              Change Email
            </button>
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

      {/* Change Email Modal */}
      {showChangeEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative rounded-[32px] border shadow-2xl backdrop-blur-xl w-full max-w-md ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <button
              onClick={() => {
                setShowChangeEmailModal(false)
                setNewEmail('')
              }}
              className={`absolute top-4 right-4 p-2 rounded-full transition ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
              }`}
            >
              <X className={`h-5 w-5 ${isDark ? 'text-white' : 'text-slate-600'}`} />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 text-white shadow-lg">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Change Email Address</h3>
                  <p className={`text-sm ${
                    isDark ? 'text-white/70' : 'text-slate-600'
                  }`}>Enter your new email address</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>
                    Current Email
                  </label>
                  <div className={`rounded-xl px-4 py-3 border ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <span className={`text-sm ${
                      isDark ? 'text-white/70' : 'text-slate-600'
                    }`}>{user?.email || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>
                    New Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address"
                    className={`w-full rounded-xl px-4 py-3 transition-all ${
                      isDark
                        ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                        : 'bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                    disabled={isChangingEmail}
                  />
                </div>

                <div className={`rounded-xl p-4 border ${
                  isDark ? 'border-blue-400/30 bg-blue-500/20' : 'border-blue-200 bg-blue-50'
                }`}>
                  <p className={`text-sm ${
                    isDark ? 'text-blue-300' : 'text-blue-800'
                  }`}>
                    <strong>Note:</strong> We'll send a verification email to your new address. Click the link in that email to confirm the change.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleChangeEmail}
                  disabled={isChangingEmail || !newEmail.trim()}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-blue-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  {isChangingEmail ? (
                    <>
                      <div className={`w-4 h-4 border-2 rounded-full animate-spin ${
                        isDark ? 'border-white border-t-transparent' : 'border-white border-t-transparent'
                      }`} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Verification Email
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowChangeEmailModal(false)
                    setNewEmail('')
                  }}
                  disabled={isChangingEmail}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
