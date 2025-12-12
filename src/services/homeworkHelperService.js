/**
 * Homework Helper Service
 * Provides AI-powered step-by-step homework guidance without giving direct answers
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'

// Generate a unique session ID
const generateSessionId = () => {
  return `hw_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

// Store session data in memory (in production, this would be in a database)
const sessionStore = new Map()

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
    
    // Try to call the backend API
    try {
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

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          ...result
        }
      }
    } catch (apiError) {
      console.log('⚠️ [Homework Helper] API not available, using local mock:', apiError.message)
    }

    // Fallback to local mock for demo purposes
    const sessionId = generateSessionId()
    const mockSteps = generateMockSteps(subject, problemText || 'Uploaded homework problem')
    
    // Store session
    sessionStore.set(sessionId, {
      userId,
      subject,
      problemText,
      steps: mockSteps,
      currentStep: 0,
      hintsUsed: 0,
      startTime: Date.now()
    })

    return {
      success: true,
      sessionId,
      steps: mockSteps,
      hints: generateHints(subject, mockSteps),
      initialMessage: getInitialMessage(subject, problemText)
    }
  } catch (error) {
    console.error('❌ [Homework Helper] Error analyzing homework:', error)
    return {
      success: false,
      error: error.message || 'Failed to analyze homework'
    }
  }
}

/**
 * Get the next hint for the current step
 */
export const getNextHint = async ({ sessionId, userId, currentStep, hintsUsed }) => {
  try {
    // Try API first
    try {
      const response = await fetch(`${API_BASE_URL}/homework/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId, currentStep, hintsUsed })
      })

      if (response.ok) {
        const result = await response.json()
        return { success: true, hint: result.hint }
      }
    } catch (apiError) {
      console.log('⚠️ [Homework Helper] Using local hints')
    }

    // Local fallback
    const session = sessionStore.get(sessionId)
    if (!session) {
      return { success: false, error: 'Session not found' }
    }

    const step = session.steps[currentStep]
    const hints = step?.hints || []
    const hintIndex = Math.min(hintsUsed, hints.length - 1)
    
    return {
      success: true,
      hint: hints[hintIndex] || getGenericHint(currentStep)
    }
  } catch (error) {
    console.error('❌ [Homework Helper] Error getting hint:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check student's answer and provide feedback
 */
export const checkStudentAnswer = async ({ sessionId, userId, answer, currentStep, steps }) => {
  try {
    // Try API first
    try {
      const response = await fetch(`${API_BASE_URL}/homework/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId, answer, currentStep })
      })

      if (response.ok) {
        const result = await response.json()
        return { success: true, ...result }
      }
    } catch (apiError) {
      console.log('⚠️ [Homework Helper] Using local answer checking')
    }

    // Local fallback - simulate intelligent response
    const session = sessionStore.get(sessionId)
    const step = steps[currentStep]
    
    // Analyze the answer (in production, this would use AI)
    const answerAnalysis = analyzeAnswer(answer, step, currentStep)
    
    return {
      success: true,
      response: answerAnalysis.response,
      isCorrect: answerAnalysis.isCorrect,
      nextStep: answerAnalysis.isCorrect ? currentStep + 1 : currentStep,
      problemSolved: answerAnalysis.isCorrect && currentStep === steps.length - 1
    }
  } catch (error) {
    console.error('❌ [Homework Helper] Error checking answer:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Start a new problem (reset session)
 */
export const startNewProblem = async ({ sessionId }) => {
  sessionStore.delete(sessionId)
  return { success: true }
}

/**
 * Free-form chat with the AI tutor
 */
export const chatWithTutor = async ({ sessionId, userId, message }) => {
  try {
    // Try API first
    try {
      const response = await fetch(`${API_BASE_URL}/homework/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId, message })
      })

      if (response.ok) {
        const result = await response.json()
        return { success: true, response: result.response }
      }
    } catch (apiError) {
      console.log('⚠️ [Homework Helper] Using local chat fallback')
    }

    // Local fallback
    return {
      success: true,
      response: "I'm here to help! Let me think about your question... " + getEncouragingResponse(message)
    }
  } catch (error) {
    console.error('❌ [Homework Helper] Error in chat:', error)
    return { success: false, error: error.message }
  }
}

function getEncouragingResponse(message) {
  const responses = [
    "That's a great question! Let's think about it step by step.",
    "I can see you're really thinking about this. What do you already know about this topic?",
    "Good thinking! Have you tried breaking the problem into smaller parts?",
    "You're on the right track. What would happen if you tried a different approach?",
    "Let's explore this together. What's the first thing that comes to mind?"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

// ============ Helper Functions ============

function getInitialMessage(subject, problemText) {
  const subjectMessages = {
    mathematics: "I see you're working on a math problem! Mathematics is all about understanding patterns and logic. Let's break this down together step by step.",
    physics: "Physics problem! Remember, physics is about understanding how the world works. Let's identify the key concepts and work through this systematically.",
    chemistry: "A chemistry question! Chemistry is the science of matter and its transformations. Let's analyze what we're dealing with and find the solution together.",
    biology: "Biology time! Understanding life sciences requires connecting concepts. Let's explore this problem step by step.",
    english: "An English exercise! Language is a powerful tool. Let's work through the grammar, vocabulary, or comprehension together.",
    italian: "Italiano! Che bella lingua! Let's work through this Italian language exercise together, passo dopo passo.",
    spanish: "¡Español! Let's tackle this Spanish exercise together. I'll guide you through the language concepts.",
    french: "Le français! Let's work through this French exercise together. I'll help you understand the nuances.",
    history: "A history question! History helps us understand the present. Let's analyze the context and events together.",
    geography: "Geography! Understanding our world and its features. Let's explore this question systematically.",
    computerScience: "Computer Science! Let's think like a programmer and break this problem into logical steps.",
    default: "I've analyzed your homework problem! Let's work through it together step by step."
  }
  
  return subjectMessages[subject] || subjectMessages.default
}

function generateMockSteps(subject, problemText) {
  // Generate subject-specific learning steps
  const stepTemplates = {
    mathematics: [
      { 
        title: 'Understand the Problem',
        guidance: "First, let's identify what we're being asked to find. Read the problem carefully. What are the known values? What is the unknown?",
        hints: [
          "Try writing down all the numbers or values given in the problem.",
          "What mathematical operation might connect these values?",
          "Draw a picture or diagram if it helps visualize the problem."
        ]
      },
      { 
        title: 'Identify the Method',
        guidance: "Now that we understand what we need to find, let's think about HOW to find it. What mathematical concept or formula applies here?",
        hints: [
          "Think about similar problems you've solved before.",
          "What formulas or equations are relevant to this type of problem?",
          "Break the problem into smaller, manageable parts."
        ]
      },
      { 
        title: 'Set Up the Solution',
        guidance: "Let's write out our approach. Set up the equation or expression that will help us solve this. Don't solve it yet - just set it up!",
        hints: [
          "Substitute the known values into your formula.",
          "Make sure all units are consistent.",
          "Double-check that you've included all necessary information."
        ]
      },
      { 
        title: 'Solve Step by Step',
        guidance: "Now solve your equation or expression. Show each step clearly. What operations do you need to perform?",
        hints: [
          "Work through one operation at a time.",
          "Keep track of positive and negative signs.",
          "Simplify as you go."
        ]
      },
      { 
        title: 'Verify Your Answer',
        guidance: "Finally, let's check our work. Does the answer make sense? Can you plug it back into the original problem to verify?",
        hints: [
          "Is the answer in the correct units?",
          "Does the magnitude seem reasonable?",
          "Try the problem a different way to verify."
        ]
      }
    ],
    english: [
      { 
        title: 'Read and Comprehend',
        guidance: "Start by reading the text or question carefully. What is the main idea or topic? Identify key words.",
        hints: [
          "Read it more than once if needed.",
          "Highlight or underline important words.",
          "What is the question really asking?"
        ]
      },
      { 
        title: 'Analyze the Structure',
        guidance: "Look at how the language is structured. What grammar rules apply? What literary devices are being used?",
        hints: [
          "Identify the subject, verb, and object.",
          "Look for context clues.",
          "Consider the tone and style."
        ]
      },
      { 
        title: 'Apply Your Knowledge',
        guidance: "Use what you know about English grammar, vocabulary, or literature to formulate your answer.",
        hints: [
          "Think about the rules you've learned.",
          "Consider multiple possible answers.",
          "Use process of elimination if helpful."
        ]
      },
      { 
        title: 'Review and Refine',
        guidance: "Check your answer for accuracy. Does it make sense grammatically? Is the meaning clear?",
        hints: [
          "Read your answer out loud.",
          "Check spelling and punctuation.",
          "Ensure it answers the question asked."
        ]
      }
    ],
    default: [
      { 
        title: 'Understand the Problem',
        guidance: "Let's start by carefully reading and understanding what we're being asked. What information do we have? What do we need to find?",
        hints: [
          "Identify the key information given.",
          "Write down what you need to find.",
          "Note any constraints or conditions."
        ]
      },
      { 
        title: 'Plan Your Approach',
        guidance: "Now let's think about how to solve this. What concepts or methods apply here? Have you seen similar problems before?",
        hints: [
          "Think about related concepts you've learned.",
          "Consider breaking it into smaller parts.",
          "Draw diagrams or outlines if helpful."
        ]
      },
      { 
        title: 'Work Through the Solution',
        guidance: "Let's work through the problem step by step. Take your time and show your thinking.",
        hints: [
          "Start with what you know.",
          "Work carefully through each step.",
          "Don't skip steps, even if they seem obvious."
        ]
      },
      { 
        title: 'Check Your Work',
        guidance: "Review your solution. Does it make sense? Can you verify it's correct?",
        hints: [
          "Re-read the original question.",
          "Check that you've answered what was asked.",
          "Look for any errors in your reasoning."
        ]
      }
    ]
  }

  return stepTemplates[subject] || stepTemplates.default
}

function generateHints(subject, steps) {
  return steps.flatMap(step => step.hints || [])
}

function getGenericHint(stepIndex) {
  const genericHints = [
    "Take a moment to re-read the problem. What key information stands out?",
    "Think about similar problems you've solved. What approach worked there?",
    "Try breaking this step into even smaller parts.",
    "Consider what would happen if you tried a different approach.",
    "Don't be afraid to make an educated guess - you can always refine it!"
  ]
  return genericHints[stepIndex % genericHints.length]
}

function analyzeAnswer(answer, step, stepIndex) {
  // Simple answer analysis (in production, this would use AI)
  const answerLower = answer.toLowerCase().trim()
  
  // Check for very short or empty answers
  if (answerLower.length < 3) {
    return {
      isCorrect: false,
      response: "I need a bit more from you! Can you explain your thinking in more detail? Even if you're not sure, try to describe what you're considering."
    }
  }

  // Check for uncertainty indicators - encourage them to try
  if (answerLower.includes("i don't know") || answerLower.includes("i'm not sure") || answerLower.includes("help")) {
    return {
      isCorrect: false,
      response: "That's okay! Learning is about trying. Let me give you a hint: " + (step?.hints?.[0] || "Think about what information you have and what you need to find. What's the first thing that comes to mind?")
    }
  }

  // Check for questions - they're engaging
  if (answerLower.includes("?")) {
    return {
      isCorrect: false,
      response: "Great question! Asking questions shows you're thinking deeply. " + getFollowUpGuidance(step)
    }
  }

  // Check for effort and reasoning (positive reinforcement)
  const effortIndicators = ['because', 'so', 'therefore', 'i think', 'since', 'first', 'then', 'next', 'step']
  const showsEffort = effortIndicators.some(indicator => answerLower.includes(indicator))
  
  if (showsEffort) {
    // Simulate some correct answers (in production, AI would evaluate)
    const isCorrect = Math.random() > 0.4 // 60% chance of being correct if they show effort
    
    if (isCorrect) {
      return {
        isCorrect: true,
        response: getPositiveFeedback(stepIndex)
      }
    } else {
      return {
        isCorrect: false,
        response: getEncouragingFeedback(step)
      }
    }
  }

  // Default: encourage more explanation
  return {
    isCorrect: false,
    response: "You're on the right track! Can you explain your reasoning a bit more? What made you think of that approach? Walking through your thinking helps solidify your understanding."
  }
}

function getPositiveFeedback(stepIndex) {
  const feedback = [
    "Excellent thinking! You've identified the key elements correctly. Your approach shows good understanding. Let's move to the next step!",
    "Great job! You're demonstrating solid reasoning here. That's exactly the kind of logical thinking we need. On to the next step!",
    "Wonderful! You've got it! Your explanation shows you really understand this concept. Let's continue building on this success!",
    "Perfect! Your reasoning is spot on. I can see you're thinking through this carefully. Ready for the next challenge?",
    "Outstanding work! You've successfully applied the concept. This is exactly how to approach these problems. Let's see what's next!"
  ]
  return feedback[stepIndex % feedback.length]
}

function getEncouragingFeedback(step) {
  const feedback = [
    "You're getting closer! Your approach is interesting. Let me guide you a bit more: " + (step?.hints?.[1] || "Try looking at it from a different angle."),
    "Good effort! You're thinking in the right direction. Consider: " + (step?.hints?.[0] || "What happens if you break this into smaller parts?"),
    "Nice try! You're showing good problem-solving skills. Here's a thought: " + (step?.hints?.[1] || "Review the key information and see what stands out."),
    "You're making progress! Don't give up. Think about: " + (step?.hints?.[0] || "What concepts have you learned that might apply here?")
  ]
  return feedback[Math.floor(Math.random() * feedback.length)]
}

function getFollowUpGuidance(step) {
  return step?.guidance || "Let's think about this systematically. What information do we have, and how can we use it?"
}

export default {
  analyzeHomework,
  getNextHint,
  checkStudentAnswer,
  startNewProblem
}

