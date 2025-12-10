import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  MessageCircle, 
  Users, 
  User,
  ArrowRight,
  Star,
  Clock,
  Target,
  Lightbulb,
  Sparkles
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNotification } from '../contexts/NotificationContext'

const Homepage = () => {
  const navigate = useNavigate()
  const { user, reloadUser } = useSimpleAuth()
  const { isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  const [showTutorForm, setShowTutorForm] = useState(false)
  const [tutorForm, setTutorForm] = useState({
    subjects: '',
    experience: '',
    description: '',
    availability: '',
    hourlyRate: ''
  })

  const handleGetStarted = () => {
    if (user) {
      navigate('/tutoring')
    } else {
      navigate('/login')
    }
  }

  const handleBecomeTutor = () => {
    if (user) {
      setShowTutorForm(true)
    } else {
      navigate('/login')
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      showError('Please log in first to become a tutor', 'Login Required')
      return
    }
    
    try {
      const { createTutorProfile } = await import('../services/tutorService')
      const result = await createTutorProfile(user?.id, tutorForm)
      
      if (result.success) {
        console.log('Tutor profile created successfully:', tutorForm)
        const updatedUser = { ...user, isTutor: true }
        localStorage.setItem('simpleUser', JSON.stringify(updatedUser))
        reloadUser()
        setShowTutorForm(false)
        navigate('/tutoring')
        showSuccess('🎉 Welcome to Studiply Tutors! Your profile is now live and students can find you for tutoring sessions.', 'Tutor Profile Created!')
      } else {
        throw new Error(result.error || 'Failed to create tutor profile')
      }
    } catch (error) {
      console.error('Error creating tutor profile:', error)
      showError(`Failed to create tutor profile: ${error.message}`, 'Setup Failed')
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setTutorForm(prev => ({
      ...prev,
      [name]: value
    }))
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
        <div className="absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-12 h-80 w-80 rounded-full bg-pink-400/25 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-indigo-400/15 blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-20 hide-scrollbar">
        {/* Hero Section */}
        <section className="text-center mt-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-500 mb-6">
            <Sparkles className="h-4 w-4" /> Transform your learning journey
          </div>
          <h1 className={`text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight ${
            isDark
              ? 'bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-purple-700 via-pink-600 to-blue-700 bg-clip-text text-transparent'
          }`}>
            Welcome to Studiply
          </h1>
          <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
            isDark ? 'text-white/80' : 'text-slate-700'
          }`}>
            Connect with experienced students and get personalized help with your studies.<br />
            <span className="font-semibold">Learn together, grow together.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className={`group inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl font-bold shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl ${
                isDark
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              <span>Get Started</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {!user?.isTutor && (
              <button
                onClick={handleBecomeTutor}
                className={`inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl font-bold shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border-2 ${
                  isDark
                    ? 'bg-white/10 text-purple-300 border-purple-400/50 hover:bg-white/15 hover:border-purple-400'
                    : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400'
                }`}
              >
                <User className="h-6 w-6" />
                <span>Become a Tutor</span>
              </button>
            )}
          </div>
        </section>

        {/* How Tutoring Works Section */}
        <section className={`rounded-[32px] border px-8 py-12 md:py-16 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-black mb-4 tracking-tight ${
              isDark
                ? 'bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent'
            }`}>
              How Tutoring Works
            </h2>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              isDark ? 'text-white/70' : 'text-slate-600'
            }`}>
              Get personalized help from experienced students in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className={`group relative p-8 rounded-[28px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              isDark
                ? 'border-white/10 bg-white/5 hover:border-blue-400/30 hover:bg-white/8'
                : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white hover:shadow-xl'
            }`}>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-2 border-white/20'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-2 border-white'
                  }`}>
                    1
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Find a Tutor</h3>
                <p className={`text-base leading-relaxed ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>
                  Browse through our verified tutors and find the perfect match for your subject and learning style
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className={`group relative p-8 rounded-[28px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              isDark
                ? 'border-white/10 bg-white/5 hover:border-purple-400/30 hover:bg-white/8'
                : 'border-slate-200 bg-slate-50 hover:border-purple-300 hover:bg-white hover:shadow-xl'
            }`}>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-white/20'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-white'
                  }`}>
                    2
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Request a Session</h3>
                <p className={`text-base leading-relaxed ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>
                  Send a personalized request with your subject, preferred time, and specific learning goals
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className={`group relative p-8 rounded-[28px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              isDark
                ? 'border-white/10 bg-white/5 hover:border-emerald-400/30 hover:bg-white/8'
                : 'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-white hover:shadow-xl'
            }`}>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-2 border-white/20'
                      : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-2 border-white'
                  }`}>
                    3
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Learn Together</h3>
                <p className={`text-base leading-relaxed ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>
                  Join an interactive online session and get personalized help to achieve your academic goals
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`rounded-[32px] border px-8 py-12 md:py-16 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-black mb-4 tracking-tight ${
              isDark
                ? 'bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 bg-clip-text text-transparent'
            }`}>
              Why Choose Studiply?
            </h2>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              isDark ? 'text-white/70' : 'text-slate-600'
            }`}>
              Experience the future of online learning with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className={`group p-6 rounded-[24px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center ${
              isDark
                ? 'border-white/10 bg-white/5 hover:border-blue-400/30 hover:bg-white/8'
                : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white hover:shadow-lg'
            }`}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Verified Tutors</h3>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>All tutors are verified students with proven academic excellence</p>
            </div>

            {/* Feature 2 */}
            <div className={`group p-6 rounded-[24px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center ${
              isDark
                ? 'border-white/10 bg-white/5 hover:border-purple-400/30 hover:bg-white/8'
                : 'border-slate-200 bg-slate-50 hover:border-purple-300 hover:bg-white hover:shadow-lg'
            }`}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Flexible Scheduling</h3>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>Book sessions at your convenience with flexible time slots</p>
            </div>

            {/* Feature 3 */}
            <div className={`group p-6 rounded-[24px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center ${
              isDark
                ? 'border-white/10 bg-white/5 hover:border-emerald-400/30 hover:bg-white/8'
                : 'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-white hover:shadow-lg'
            }`}>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Personalized Learning</h3>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>Get tailored help based on your specific learning needs</p>
            </div>

            {/* Feature 4 */}
            <div className={`group p-6 rounded-[24px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center ${
              isDark
                ? 'border-white/10 bg-white/5 hover:border-orange-400/30 hover:bg-white/8'
                : 'border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-white hover:shadow-lg'
            }`}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Interactive Sessions</h3>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>Engage in real-time video sessions with interactive tools</p>
            </div>
          </div>
        </section>
      </div>

      {/* Tutor Application Form Modal */}
      {showTutorForm && (
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${
          isDark ? '' : ''
        }`}>
          <div className={`rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${
            isDark
              ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35'
              : 'border-white/70 bg-white'
          }`}>
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className={`text-3xl font-black ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                }`}>
                  Become a Tutor
                </h2>
                <button
                  onClick={() => setShowTutorForm(false)}
                  className={`text-2xl font-bold transition-colors ${
                    isDark ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Subjects */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>
                    Subjects You Can Teach *
                  </label>
                  <select
                    name="subjects"
                    value={tutorForm.subjects}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'border-white/10 bg-white/5 text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                        : 'border-slate-200 bg-white text-slate-900 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Economics">Economics</option>
                    <option value="Business Studies">Business Studies</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Literature">Literature</option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>
                    Teaching Experience *
                  </label>
                  <select
                    name="experience"
                    value={tutorForm.experience}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'border-white/10 bg-white/5 text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                        : 'border-slate-200 bg-white text-slate-900 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                    required
                  >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="experienced">Experienced (3-5 years)</option>
                    <option value="expert">Expert (5+ years)</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>
                    Teaching Description *
                  </label>
                  <textarea
                    name="description"
                    value={tutorForm.description}
                    onChange={handleFormChange}
                    placeholder="Describe your teaching style, methods, and what makes you a great tutor..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                      isDark
                        ? 'border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                        : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                    required
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>
                    Availability *
                  </label>
                  <select
                    name="availability"
                    value={tutorForm.availability}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'border-white/10 bg-white/5 text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                        : 'border-slate-200 bg-white text-slate-900 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                    required
                  >
                    <option value="">Select your availability</option>
                    <option value="weekdays">Weekdays only</option>
                    <option value="weekends">Weekends only</option>
                    <option value="flexible">Flexible schedule</option>
                    <option value="evenings">Evenings only</option>
                  </select>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>
                    Hourly Rate (€) *
                  </label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold ${
                      isDark ? 'text-white/60' : 'text-slate-500'
                    }`}>€</span>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={tutorForm.hourlyRate}
                      onChange={handleFormChange}
                      placeholder="15"
                      min="5"
                      max="100"
                      step="1"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                        isDark
                          ? 'border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                          : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                      }`}
                      required
                    />
                  </div>
                  <p className={`mt-2 text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    Set your hourly rate between €5 - €100. A 5% platform fee will be deducted from payments.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowTutorForm(false)}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                      isDark
                        ? 'border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30'
                        : 'border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    }`}
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Homepage
