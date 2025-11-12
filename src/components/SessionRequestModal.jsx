import React, { useEffect, useState } from 'react'
import { X, Send, BookOpen, Clock, MessageSquare, DollarSign } from 'lucide-react'

const SessionRequestModal = ({ tutor, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    preferredTime: '',
    duration: 60
  })
  const [datePart, setDatePart] = useState('')
  const [timePart, setTimePart] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateChange = (e) => {
    const v = e.target.value // yyyy-mm-dd
    setDatePart(v)
    if (v && timePart) {
      // 组合为本地 ISO 字符串（不带秒）
      setFormData(prev => ({ ...prev, preferredTime: `${v}T${timePart}` }))
    }
  }

  const handleTimeChange = (e) => {
    const v = e.target.value // HH:mm
    setTimePart(v)
    if (datePart && v) {
      setFormData(prev => ({ ...prev, preferredTime: `${datePart}T${v}` }))
    }
  }

  // 与 Profile 一致的可选科目（可根据需要抽到共享常量文件）
  const availableSubjects = [
    'Italian Language', 'English Language', 'Spanish Language', 'French Language', 'German Language', 'Mandarin Chinese',
    'Business & Entrepreneurship', 'Philosophy', 'Mathematics', 'Computer Science', 'Chemistry', 'Biology',
    'History', 'Geography', 'Programming', 'Art', 'Music', 'Physical Education', 'Psychology', 'Economics'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.subject || !formData.description || !formData.preferredTime) {
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting session request:', error)
    } finally {
      setLoading(false)
    }
  }

  const [visible, setVisible] = useState(isOpen)
  const [anim, setAnim] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      requestAnimationFrame(() => setAnim(true))
    } else {
      setAnim(false)
      const t = setTimeout(() => setVisible(false), 250)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-400 ease-out ${anim ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className={`relative w-full max-w-3xl transform transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform will-change-opacity ${anim ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-[0.96]'}`}>
        <div className="rounded-[28px] overflow-hidden shadow-2xl border border-white/15 bg-white/90 backdrop-blur-xl">
          <div className="relative px-6 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-between">
            <h2 className="text-xl font-semibold">Request Tutoring Session</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-white/20 transition"
              aria-label="Close request session"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className={`p-6 space-y-6 transition-opacity duration-500 ${anim ? 'opacity-100' : 'opacity-0'} max-h-[70vh] overflow-y-auto`}>
            <div className="relative overflow-hidden flex items-center justify-between bg-white/80 border border-white/40 rounded-2xl p-4 shadow-sm">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500/10 to-pink-500/10"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                  {tutor.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                  <p className="text-xs text-gray-600">
                    {tutor.subjects.length > 0 ? tutor.subjects.join(', ') : 'General Help'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold shadow-inner inline-block">
                  {tutor.hourlyRate || '$20/hour'}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">per hour</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
              <div className="bg-white/80 border border-white/50 rounded-2xl p-4">
                <div className="hide-scrollbar grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                  {availableSubjects.map((subject) => {
                    const selected = formData.subject === subject
                    return (
                      <button
                        type="button"
                        key={subject}
                        onClick={() => setFormData(prev => ({ ...prev, subject }))}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${selected
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow'
                          : 'bg-white text-gray-700 border-white/60 hover:border-purple-300 hover:bg-purple-50'}
                        `}
                      >
                        {subject}
                      </button>
                    )
                  })}
                </div>
                {formData.subject === '' && (
                  <p className="mt-2 text-xs text-gray-500">Please select one subject.</p>
                )}
              </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">What do you need help with?</label>
                <div className="relative group rounded-xl bg-white/75 border border-gray-200 focus-within:bg-white focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500/60 transition-all">
                  <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none group-focus-within:text-blue-500" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Please describe what you need help with in detail..."
                    rows={4}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent outline-none placeholder:text-gray-400 resize-y min-h-[112px]"
                    required
                  />
                </div>
              </div>

              {/* Preferred Time (split date & time) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
                  <div className="relative group rounded-xl bg-white/80 border border-white/60 focus-within:bg-white focus-within:border-transparent focus-within:ring-2 focus-within:ring-purple-500/60 transition-all">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-purple-500" />
                    <input
                      type="date"
                      value={datePart}
                      onChange={handleDateChange}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent outline-none placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Time</label>
                  <div className="relative group rounded-xl bg-white/80 border border-white/60 focus-within:bg-white focus-within:border-transparent focus-within:ring-2 focus-within:ring-purple-500/60 transition-all">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-purple-500" />
                    <input
                      type="time"
                      value={timePart}
                      onChange={handleTimeChange}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-transparent outline-none placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Session Duration (minutes)</label>
                  <div className="relative group rounded-xl bg-white/75 border border-gray-200 focus-within:bg-white focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500/60 transition-all">
                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-500" />
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-8 py-3 rounded-xl bg-transparent outline-none appearance-none"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 bg-white/70 hover:bg-gray-50 active:scale-[0.99] transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.subject || !formData.description || !formData.preferredTime}
                  className="group relative overflow-hidden flex-1 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10"></span>
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionRequestModal
