import express from 'express'
import AIQuest from '../models/AIQuest.js'
import OpenAI from 'openai'

const router = express.Router()

// Initialize AI client - supports both OpenAI and DeepSeek
// Priority: OpenAI > DeepSeek
const getAIClient = () => {
  if (process.env.OPENAI_API_KEY) {
    console.log('🤖 [AI Quest] Using OpenAI API')
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      }),
      model: 'gpt-4o-mini', // or 'gpt-3.5-turbo' for cheaper option
      provider: 'openai'
    }
  } else if (process.env.DEEPSEEK_API_KEY) {
    console.log('🤖 [AI Quest] Using DeepSeek API')
    return {
      client: new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1'
      }),
      model: 'deepseek-chat',
      provider: 'deepseek'
    }
  } else {
    throw new Error('No AI API key configured. Please set OPENAI_API_KEY or DEEPSEEK_API_KEY')
  }
}

// Generate AI quest
router.post('/generate', async (req, res) => {
  try {
    const { userId, userName, subject, prompt, difficulty = 'beginner', questionCount = 5 } = req.body

    console.log('🤖 [AI Quest] Received generation request:', {
      userId,
      subject,
      prompt,
      difficulty,
      questionCount
    })

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' })
    }

    if (!subject) {
      return res.status(400).json({ success: false, error: 'subject is required' })
    }

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'prompt is required' })
    }

    // Get AI client (OpenAI or DeepSeek)
    let aiConfig
    try {
      aiConfig = getAIClient()
    } catch (error) {
      console.error('❌ [AI Quest] AI service not configured:', error.message)
      return res.status(500).json({ 
        success: false, 
        error: 'AI service is not configured. Please set OPENAI_API_KEY or DEEPSEEK_API_KEY environment variable.' 
      })
    }

    // Build the AI prompt
    const subjectNames = {
      'italian': 'Italian Language',
      'english': 'English Language',
      'spanish': 'Spanish Language',
      'french': 'French Language',
      'german': 'German Language',
      'mandarin': 'Mandarin Chinese',
      'business': 'Business & Entrepreneurship',
      'philosophy': 'Philosophy',
      'mathematics': 'Mathematics',
      'computerScience': 'Computer Science',
      'chemistry': 'Chemistry',
      'biology': 'Biology',
      'history': 'History',
      'geography': 'Geography'
    }

    const subjectName = subjectNames[subject] || subject

    const systemPrompt = `You are an educational content creator. Generate ${questionCount} multiple-choice questions for ${subjectName} based on the user's request.

Requirements:
- Generate exactly ${questionCount} questions
- Each question should have 4 options (A, B, C, D)
- Include one correct answer and three plausible distractors
- Provide a clear explanation for each correct answer
- Questions should be appropriate for ${difficulty} level
- Make questions engaging and educational

Return the response as a JSON object with this exact structure:
{
  "title": "A descriptive title for this quest",
  "description": "A brief description of what students will learn",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of why this is correct"
    }
  ]
}`

    const userPrompt = `Create ${questionCount} ${difficulty} level questions about: ${prompt}`

    console.log(`🤖 [AI Quest] Calling ${aiConfig.provider.toUpperCase()} API with model: ${aiConfig.model}...`)
    const completion = await aiConfig.client.chat.completions.create({
      model: aiConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const aiResponse = completion.choices[0].message.content
    console.log(`✅ [AI Quest] ${aiConfig.provider.toUpperCase()} response received`)

    let questData
    try {
      questData = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('❌ [AI Quest] Failed to parse AI response:', parseError)
      // Try to extract JSON from markdown code blocks
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/```\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        questData = JSON.parse(jsonMatch[1])
      } else {
        throw new Error('Invalid JSON response from AI')
      }
    }

    // Validate and format the quest data
    if (!questData.questions || !Array.isArray(questData.questions)) {
      throw new Error('AI response does not contain valid questions array')
    }

    // Format questions to match our schema
    const formattedQuestions = questData.questions.map((q, index) => ({
      id: `ai-q-${index + 1}`,
      type: q.type || 'multiple-choice',
      question: q.question || '',
      options: q.options || [],
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
      correctAnswers: q.correctAnswers || [],
      explanation: q.explanation || '',
      difficulty: difficulty
    }))

    // Create the AI quest in MongoDB
    const aiQuest = await AIQuest.create({
      title: questData.title || `AI Generated Quest: ${prompt.substring(0, 50)}`,
      description: questData.description || `AI generated questions about: ${prompt}`,
      subject: subject,
      category: 'ai-generated',
      difficulty: difficulty,
      questionType: 'multiple-choice',
      questions: formattedQuestions,
      createdBy: userId,
      createdByName: userName || 'Unknown',
      prompt: prompt,
      isPrivate: true,
      metadata: {
        aiGenerated: true,
        model: aiConfig.model,
        provider: aiConfig.provider,
        questionCount: formattedQuestions.length
      }
    })

    console.log('✅ [AI Quest] Successfully created AI quest:', {
      questId: aiQuest._id,
      title: aiQuest.title,
      questionCount: formattedQuestions.length
    })

    res.json({
      success: true,
      quest: aiQuest,
      questId: aiQuest._id
    })
  } catch (error) {
    console.error('❌ [AI Quest] Error generating quest:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate AI quest'
    })
  }
})

// Get user's AI quests
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const quests = await AIQuest.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      quests
    })
  } catch (error) {
    console.error('Error fetching user AI quests:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch AI quests' })
  }
})

// Get a specific AI quest (only by creator)
router.get('/:questId', async (req, res) => {
  try {
    const { questId } = req.params
    const { userId } = req.query

    const quest = await AIQuest.findById(questId).lean()

    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found' })
    }

    // Only allow the creator to access their AI quest
    if (quest.createdBy !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    res.json({
      success: true,
      quest
    })
  } catch (error) {
    console.error('Error fetching AI quest:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch AI quest' })
  }
})

// Delete an AI quest (only by creator)
router.delete('/:questId', async (req, res) => {
  try {
    const { questId } = req.params
    const { userId } = req.query

    const quest = await AIQuest.findById(questId)

    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found' })
    }

    if (quest.createdBy !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    await AIQuest.findByIdAndDelete(questId)

    res.json({
      success: true,
      message: 'Quest deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting AI quest:', error)
    res.status(500).json({ success: false, error: 'Failed to delete AI quest' })
  }
})

export default router

