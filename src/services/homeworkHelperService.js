/**
 * Homework Helper Service
 * Provides AI-powered step-by-step homework guidance without giving direct answers
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'

/**
 * Analyze homework problem and generate step-by-step guidance
 * @param {Object} params - Analysis parameters
 * @param {string} params.userId - User ID
 * @param {string} params.subject - Subject of the homework
 * @param {string} params.imageData - Base64 encoded image data (optional)
 * @param {string} params.problemText - Text description of the problem (optional)
 * @param {string} params.fileName - Name of the uploaded file (optional)
 * @returns {Promise<Object>} Analysis result with steps and guidance
 */
export const analyzeHomework = async ({ userId, subject, imageData, problemText, fileName }) => {
  try {
    console.log('📚 [Homework Helper] Analyzing homework:', { userId, subject, hasImage: !!imageData, hasText: !!problemText })
    
    const response = await fetch(`${API_BASE_URL}/homework/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        subject,
        imageData,
        problemText,
        fileName
      })
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('✅ [Homework Helper] Analysis successful:', result.sessionId)
      return {
        success: true,
        sessionId: result.sessionId,
        problemSummary: result.problemSummary,
        problemType: result.problemType,
        steps: result.steps || [],
        initialMessage: result.initialMessage,
        encouragement: result.encouragement,
        hints: result.steps?.flatMap(s => s.hints || []) || []
      }
    } else {
      console.error('❌ [Homework Helper] Analysis failed:', result.error)
      return {
        success: false,
        error: result.error || 'Failed to analyze homework'
      }
    }
  } catch (error) {
    console.error('❌ [Homework Helper] Error analyzing homework:', error)
    return {
      success: false,
      error: error.message || 'Failed to analyze homework. Please check your connection.'
    }
  }
}

/**
 * Get the next hint for the current step
 */
export const getNextHint = async ({ sessionId, userId, currentStep, hintsUsed }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/homework/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userId, currentStep, hintsUsed })
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      return {
        success: true,
        hint: result.hint,
        hintsRemaining: result.hintsRemaining
      }
    } else {
      return {
        success: false,
        error: result.error || 'Failed to get hint'
      }
    }
  } catch (error) {
    console.error('❌ [Homework Helper] Error getting hint:', error)
    return {
      success: false,
      error: error.message || 'Failed to get hint'
    }
  }
}

/**
 * Check student's answer and provide feedback
 */
export const checkStudentAnswer = async ({ sessionId, userId, answer, currentStep, steps }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/homework/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userId, answer, currentStep })
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      return {
        success: true,
        response: result.response,
        isCorrect: result.isCorrect,
        isPartiallyCorrect: result.isPartiallyCorrect,
        nextStep: result.nextStep,
        problemSolved: result.problemSolved
      }
    } else {
      return {
        success: false,
        error: result.error || 'Failed to check answer'
      }
    }
  } catch (error) {
    console.error('❌ [Homework Helper] Error checking answer:', error)
    return {
      success: false,
      error: error.message || 'Failed to check answer'
    }
  }
}

/**
 * Chat with tutor (free-form conversation)
 */
export const chatWithTutor = async ({ sessionId, userId, message }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/homework/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userId, message })
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      return {
        success: true,
        response: result.response
      }
    } else {
      return {
        success: false,
        error: result.error || 'Failed to send message'
      }
    }
  } catch (error) {
    console.error('❌ [Homework Helper] Error in chat:', error)
    return {
      success: false,
      error: error.message || 'Failed to send message'
    }
  }
}

/**
 * Start a new problem (reset session)
 */
export const startNewProblem = async ({ sessionId }) => {
  // Sessions are managed server-side with auto-cleanup
  return { success: true }
}

export default {
  analyzeHomework,
  getNextHint,
  checkStudentAnswer,
  chatWithTutor,
  startNewProblem
}
