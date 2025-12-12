import express from 'express'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()

// Store homework sessions in memory (in production, use Redis or MongoDB)
const homeworkSessions = new Map()

// Initialize AI client - same as aiQuests.js
const getAIClient = () => {
  if (process.env.ANTHROPIC_API_KEY) {
    console.log('📚 [Homework Helper] Using Claude (Anthropic) API')
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })
    return {
      client: anthropic,
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      provider: 'claude',
      isAnthropic: true
    }
  } else if (process.env.OPENAI_API_KEY) {
    console.log('📚 [Homework Helper] Using OpenAI API')
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      }),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      provider: 'openai'
    }
  } else if (process.env.DEEPSEEK_API_KEY) {
    console.log('📚 [Homework Helper] Using DeepSeek API')
    return {
      client: new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1'
      }),
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      provider: 'deepseek'
    }
  } else {
    throw new Error('No AI API key configured')
  }
}

// Subject names mapping
const subjectNames = {
  'mathematics': 'Mathematics',
  'physics': 'Physics',
  'chemistry': 'Chemistry',
  'biology': 'Biology',
  'english': 'English',
  'italian': 'Italian',
  'spanish': 'Spanish',
  'french': 'French',
  'history': 'History',
  'geography': 'Geography',
  'computerScience': 'Computer Science',
  'other': 'General Studies'
}

// Analyze homework and create learning steps
router.post('/analyze', async (req, res) => {
  try {
    const { userId, subject, imageData, problemText, fileName } = req.body

    console.log('📚 [Homework Helper] Analyzing homework:', {
      userId,
      subject,
      hasImage: !!imageData,
      hasText: !!problemText
    })

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' })
    }

    if (!subject) {
      return res.status(400).json({ success: false, error: 'subject is required' })
    }

    if (!imageData && !problemText) {
      return res.status(400).json({ success: false, error: 'Please provide an image or problem description' })
    }

    // Get AI client
    let aiConfig
    try {
      aiConfig = getAIClient()
    } catch (error) {
      console.error('❌ [Homework Helper] AI service not configured:', error.message)
      return res.status(500).json({
        success: false,
        error: 'AI service is not configured'
      })
    }

    const subjectName = subjectNames[subject] || subject

    // Build the system prompt for educational guidance
    const systemPrompt = `You are a patient, encouraging tutor helping a student with their ${subjectName} homework. Your role is to GUIDE them to understand and solve the problem themselves - NEVER give direct answers.

Your approach:
1. First, acknowledge what the student is working on
2. Break down the problem into clear, manageable steps
3. For each step, explain the concept and ask guiding questions
4. Encourage their thinking process
5. Celebrate small wins and progress

IMPORTANT RULES:
- NEVER give the final answer directly
- Ask questions that lead them to discover the answer
- If they're stuck, give hints that guide their thinking
- Use encouraging language
- Make connections to concepts they might already know
- If there's an image, describe what you see and identify the problem type

Respond in JSON format with this structure:
{
  "problemSummary": "Brief description of what the problem is asking",
  "problemType": "The type of problem (e.g., 'algebra equation', 'grammar exercise', 'physics calculation')",
  "initialMessage": "Your warm, encouraging greeting and introduction to the problem",
  "steps": [
    {
      "title": "Step name",
      "guidance": "Explanation and guiding questions for this step",
      "concept": "The key concept being learned",
      "hints": ["Hint 1 if stuck", "Hint 2 if still stuck", "Final hint"]
    }
  ],
  "encouragement": "A motivating message to start"
}`

    // Build user message
    let userMessage = ''
    if (problemText) {
      userMessage = `The student needs help with this ${subjectName} problem:\n\n${problemText}`
    }
    if (imageData) {
      userMessage += userMessage ? '\n\nThey also uploaded an image of the problem.' : `The student uploaded an image of their ${subjectName} homework.`
    }

    console.log(`📚 [Homework Helper] Calling ${aiConfig.provider.toUpperCase()} API...`)

    let aiResponse
    
    if (aiConfig.isAnthropic) {
      // Claude API with vision support
      const content = []
      
      if (imageData && imageData.startsWith('data:image')) {
        // Extract base64 data and media type
        const matches = imageData.match(/^data:(.+);base64,(.+)$/)
        if (matches) {
          content.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: matches[1],
              data: matches[2]
            }
          })
        }
      }
      
      content.push({
        type: 'text',
        text: userMessage || `Please analyze this ${subjectName} homework problem and create a step-by-step learning guide.`
      })

      const message = await aiConfig.client.messages.create({
        model: aiConfig.model,
        max_tokens: 4096,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content }]
      })
      aiResponse = message.content[0].text
    } else {
      // OpenAI API with vision support
      const messages = [
        { role: 'system', content: systemPrompt }
      ]

      if (imageData && imageData.startsWith('data:image')) {
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: userMessage || `Please analyze this ${subjectName} homework problem.` },
            { type: 'image_url', image_url: { url: imageData } }
          ]
        })
      } else {
        messages.push({
          role: 'user',
          content: userMessage
        })
      }

      const completion = await aiConfig.client.chat.completions.create({
        model: imageData ? 'gpt-4o' : aiConfig.model, // Use GPT-4o for vision
        messages,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
      aiResponse = completion.choices[0].message.content
    }

    console.log('✅ [Homework Helper] AI response received')

    // Parse the AI response
    let analysisData
    try {
      analysisData = JSON.parse(aiResponse)
    } catch (parseError) {
      // Try to extract JSON from markdown
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/```\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[1])
      } else {
        throw new Error('Failed to parse AI response')
      }
    }

    // Create session
    const sessionId = `hw_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    
    const session = {
      userId,
      subject,
      problemText,
      hasImage: !!imageData,
      analysis: analysisData,
      steps: analysisData.steps || [],
      currentStep: 0,
      hintsUsed: 0,
      messages: [],
      createdAt: new Date(),
      model: aiConfig.model,
      provider: aiConfig.provider
    }

    homeworkSessions.set(sessionId, session)

    // Clean up old sessions (older than 2 hours)
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
    for (const [id, sess] of homeworkSessions) {
      if (new Date(sess.createdAt).getTime() < twoHoursAgo) {
        homeworkSessions.delete(id)
      }
    }

    res.json({
      success: true,
      sessionId,
      problemSummary: analysisData.problemSummary,
      problemType: analysisData.problemType,
      steps: analysisData.steps,
      initialMessage: analysisData.initialMessage,
      encouragement: analysisData.encouragement
    })

  } catch (error) {
    console.error('❌ [Homework Helper] Error analyzing homework:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze homework'
    })
  }
})

// Get a hint for current step
router.post('/hint', async (req, res) => {
  try {
    const { sessionId, userId, currentStep, hintsUsed } = req.body

    const session = homeworkSessions.get(sessionId)
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' })
    }

    if (session.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    const step = session.steps[currentStep]
    if (!step) {
      return res.status(400).json({ success: false, error: 'Invalid step' })
    }

    const hints = step.hints || []
    const hintIndex = Math.min(hintsUsed, hints.length - 1)
    const hint = hints[hintIndex] || "Try breaking down the problem into smaller parts. What do you know? What are you trying to find?"

    // Update session
    session.hintsUsed = (session.hintsUsed || 0) + 1
    homeworkSessions.set(sessionId, session)

    res.json({
      success: true,
      hint,
      hintsRemaining: Math.max(0, hints.length - hintsUsed - 1)
    })

  } catch (error) {
    console.error('❌ [Homework Helper] Error getting hint:', error)
    res.status(500).json({ success: false, error: 'Failed to get hint' })
  }
})

// Check student's answer and provide feedback
router.post('/check', async (req, res) => {
  try {
    const { sessionId, userId, answer, currentStep } = req.body

    const session = homeworkSessions.get(sessionId)
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' })
    }

    if (session.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    // Get AI client for response evaluation
    let aiConfig
    try {
      aiConfig = getAIClient()
    } catch (error) {
      return res.status(500).json({ success: false, error: 'AI service not configured' })
    }

    const step = session.steps[currentStep]
    const subjectName = subjectNames[session.subject] || session.subject

    // Build evaluation prompt
    const systemPrompt = `You are a supportive tutor evaluating a student's response. The student is working on step ${currentStep + 1} of a ${subjectName} problem.

Step being worked on: "${step?.title || 'Current step'}"
Step guidance: "${step?.guidance || ''}"
Key concept: "${step?.concept || ''}"

Evaluate the student's answer and respond with:
1. Whether they're on the right track (partially or fully correct)
2. Encouraging feedback
3. If incorrect, guide them toward the right thinking WITHOUT giving the answer
4. If correct, celebrate and prepare them for the next step

Respond in JSON format:
{
  "isCorrect": true/false,
  "isPartiallyCorrect": true/false,
  "response": "Your encouraging feedback and guidance",
  "shouldMoveToNextStep": true/false
}`

    console.log(`📚 [Homework Helper] Evaluating answer for step ${currentStep + 1}...`)

    let aiResponse
    if (aiConfig.isAnthropic) {
      const message = await aiConfig.client.messages.create({
        model: aiConfig.model,
        max_tokens: 1024,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Student's answer: "${answer}"` }]
      })
      aiResponse = message.content[0].text
    } else {
      const completion = await aiConfig.client.chat.completions.create({
        model: aiConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Student's answer: "${answer}"` }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
      aiResponse = completion.choices[0].message.content
    }

    let evaluation
    try {
      evaluation = JSON.parse(aiResponse)
    } catch (e) {
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[1])
      } else {
        evaluation = {
          isCorrect: false,
          response: "I see you're thinking about this! Can you explain your reasoning a bit more?",
          shouldMoveToNextStep: false
        }
      }
    }

    // Determine next step
    const shouldAdvance = evaluation.isCorrect || evaluation.shouldMoveToNextStep
    const nextStep = shouldAdvance ? currentStep + 1 : currentStep
    const problemSolved = shouldAdvance && nextStep >= session.steps.length

    // Update session
    session.currentStep = nextStep
    session.messages.push({ role: 'user', content: answer, timestamp: new Date() })
    session.messages.push({ role: 'tutor', content: evaluation.response, timestamp: new Date() })
    homeworkSessions.set(sessionId, session)

    res.json({
      success: true,
      isCorrect: evaluation.isCorrect,
      isPartiallyCorrect: evaluation.isPartiallyCorrect,
      response: evaluation.response,
      nextStep,
      problemSolved
    })

  } catch (error) {
    console.error('❌ [Homework Helper] Error checking answer:', error)
    res.status(500).json({ success: false, error: 'Failed to check answer' })
  }
})

// Chat with tutor (free-form conversation about the problem)
router.post('/chat', async (req, res) => {
  try {
    const { sessionId, userId, message } = req.body

    const session = homeworkSessions.get(sessionId)
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' })
    }

    if (session.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    let aiConfig
    try {
      aiConfig = getAIClient()
    } catch (error) {
      return res.status(500).json({ success: false, error: 'AI service not configured' })
    }

    const subjectName = subjectNames[session.subject] || session.subject
    const currentStep = session.steps[session.currentStep]

    // Build conversation context
    const systemPrompt = `You are a patient, encouraging ${subjectName} tutor. You are helping a student with their homework.

Problem: ${session.analysis?.problemSummary || session.problemText || 'Homework problem'}
Current step (${session.currentStep + 1}/${session.steps.length}): ${currentStep?.title || 'Working on problem'}
Concept: ${currentStep?.concept || 'Understanding the problem'}

IMPORTANT:
- NEVER give the final answer directly
- Ask guiding questions
- Encourage their thinking
- Celebrate progress
- Keep responses concise but helpful

Previous conversation:
${session.messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n')}

Respond naturally and helpfully.`

    let aiResponse
    if (aiConfig.isAnthropic) {
      const msg = await aiConfig.client.messages.create({
        model: aiConfig.model,
        max_tokens: 512,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }]
      })
      aiResponse = msg.content[0].text
    } else {
      const completion = await aiConfig.client.chat.completions.create({
        model: aiConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
      aiResponse = completion.choices[0].message.content
    }

    // Update session
    session.messages.push({ role: 'user', content: message, timestamp: new Date() })
    session.messages.push({ role: 'tutor', content: aiResponse, timestamp: new Date() })
    homeworkSessions.set(sessionId, session)

    res.json({
      success: true,
      response: aiResponse
    })

  } catch (error) {
    console.error('❌ [Homework Helper] Error in chat:', error)
    res.status(500).json({ success: false, error: 'Failed to process message' })
  }
})

export default router

