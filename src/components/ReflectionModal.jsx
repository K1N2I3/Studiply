import React, { useState } from 'react'
import {
  Mic,
  MicOff,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Star,
  Lightbulb,
  Volume2
} from 'lucide-react'

const ReflectionModal = ({ isOpen, onClose, scenarioData, userResponses, onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState('retelling') // 'retelling', 'feedback', 'complete'
  const [retellingText, setRetellingText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)

  if (!isOpen) return null

  const handleRetellingSubmit = () => {
    if (retellingText.trim()) {
      // In a real app, send to AI for analysis
      setFeedback({
        strengths: [
          'Good use of polite language',
          'Clear pronunciation',
          'Appropriate vocabulary'
        ],
        improvements: [
          'Try to be more specific with requests',
          'Practice using more formal language in business contexts'
        ],
        grammar: [
          {
            text: 'I want a window seat',
            suggestion: 'I would like a window seat, please',
            explanation: 'Using "would like" is more polite than "want"'
          }
        ],
        score: 85
      })
      setCurrentPhase('feedback')
    }
  }

  const handleComplete = () => {
    onComplete({
      retelling: retellingText,
      feedback: feedback,
      rating: selectedRating,
      timestamp: new Date()
    })
    onClose()
  }

  const phases = [
    { id: 'retelling', name: 'Retelling', icon: MessageSquare },
    { id: 'feedback', name: 'AI Feedback', icon: Lightbulb },
    { id: 'complete', name: 'Complete', icon: CheckCircle }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Scenario Reflection</h2>
              <p className="text-gray-600 mt-1">Review and improve your conversation skills</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Phase Indicator */}
          <div className="flex items-center space-x-4 mt-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  currentPhase === phase.id
                    ? 'bg-blue-100 text-blue-700'
                    : phases.findIndex(p => p.id === currentPhase) > index
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <phase.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{phase.name}</span>
                </div>
                {index < phases.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    phases.findIndex(p => p.id === currentPhase) > index
                      ? 'bg-green-300'
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {currentPhase === 'retelling' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Retell the Conversation</h3>
                <p className="text-gray-600">
                  Describe what happened in your own words. This helps reinforce your learning and improve your narrative skills.
                </p>
              </div>

              {/* Scenario Summary */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Scenario Summary</h4>
                <div className="space-y-2 text-blue-800">
                  <p><strong>Scenario:</strong> {scenarioData.title}</p>
                  <p><strong>Steps completed:</strong> {userResponses.length}</p>
                  <p><strong>Your responses:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    {userResponses.map((response, index) => (
                      <li key={index}>Step {response.step}: "{response.input}"</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recording/Text Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-4 rounded-full transition-all duration-300 ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <span className="text-gray-600">
                    {isRecording ? 'Recording your retelling...' : 'Record your voice or type below'}
                  </span>
                </div>

                <textarea
                  value={retellingText}
                  onChange={(e) => setRetellingText(e.target.value)}
                  placeholder="Describe what happened in the conversation. Include the key points, your responses, and how you felt about the interaction..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Skip Reflection
                </button>
                <button
                  onClick={handleRetellingSubmit}
                  disabled={!retellingText.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Get AI Feedback
                </button>
              </div>
            </div>
          )}

          {currentPhase === 'feedback' && feedback && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Feedback & Analysis</h3>
                <p className="text-gray-600">
                  Here's how you did and how you can improve for next time.
                </p>
              </div>

              {/* Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{feedback.score}/100</div>
                <div className="text-lg text-gray-700">Overall Performance</div>
                <div className="flex justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(feedback.score / 20)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Strengths</span>
                </h4>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-green-800 flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-yellow-50 rounded-xl p-6">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Areas for Improvement</span>
                </h4>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-yellow-800 flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Grammar Suggestions */}
              {feedback.grammar && feedback.grammar.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Grammar & Language Tips</h4>
                  <div className="space-y-4">
                    {feedback.grammar.map((item, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-500">Original:</span>
                          <span className="text-gray-700">"{item.text}"</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-500">Better:</span>
                          <span className="text-blue-700 font-medium">"{item.suggestion}"</span>
                        </div>
                        <div className="text-sm text-gray-600">{item.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setCurrentPhase('retelling')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentPhase('complete')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentPhase === 'complete' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rate Your Experience</h3>
                <p className="text-gray-600">
                  How helpful was this scenario for your learning?
                </p>
              </div>

              {/* Rating */}
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedRating(i + 1)}
                    className={`w-12 h-12 rounded-full transition-all duration-200 ${
                      i < selectedRating
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                    }`}
                  >
                    <Star className="w-6 h-6 mx-auto" />
                  </button>
                ))}
              </div>

              {/* Completion Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Learning Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userResponses.length}</div>
                    <div className="text-sm text-gray-600">Conversation Steps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{feedback?.score || 0}</div>
                    <div className="text-sm text-gray-600">Performance Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedRating}/5</div>
                    <div className="text-sm text-gray-600">Your Rating</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setCurrentPhase('feedback')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Complete Reflection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReflectionModal
