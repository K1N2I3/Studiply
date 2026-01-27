// Calendar Quiz Service - Generate AI-powered quiz from event description

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://studiply.onrender.com/api' : 'http://localhost:3003/api')

/**
 * Generate quiz questions based on calendar event description
 * @param {string} subject - Subject name (e.g., 'english', 'mathematics')
 * @param {string} description - Event description from calendar
 * @param {number} questionCount - Number of questions to generate (default: 5)
 * @returns {Promise<{success: boolean, quiz?: Object, error?: string}>}
 */
export const generateCalendarQuiz = async (subject, description, questionCount = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calendar-quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject,
        description,
        questionCount
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate quiz')
    }

    return data
  } catch (error) {
    console.error('Error generating calendar quiz:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate quiz. Please try again.'
    }
  }
}
