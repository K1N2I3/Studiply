import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Use native fetch (Node.js 18+)
// If using older Node.js, uncomment: import fetch from 'node-fetch'

const API_BASE_URL = process.env.API_BASE_URL || 'https://studiply.onrender.com/api'

async function testAIGuestGeneration() {
  console.log('🧪 Testing AI Quest Generation...\n')
  console.log('API Base URL:', API_BASE_URL)
  console.log('Environment check:')
  console.log('  - ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Not set')
  console.log('  - OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set')
  console.log('  - DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '✅ Set' : '❌ Not set')
  console.log('')

  const testData = {
    userId: 'test-user-123',
    userName: 'Test User',
    subject: 'mathematics',
    prompt: 'Basic algebra equations with one variable',
    difficulty: 'beginner',
    questionCount: 3
  }

  console.log('📝 Test Request Data:')
  console.log(JSON.stringify(testData, null, 2))
  console.log('')

  try {
    console.log('🚀 Sending request to:', `${API_BASE_URL}/ai-quests/generate`)
    const startTime = Date.now()

    const response = await fetch(`${API_BASE_URL}/ai-quests/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`⏱️  Response time: ${elapsedTime}s\n`)

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('✅ SUCCESS! Quest generated successfully!\n')
      console.log('📊 Quest Details:')
      console.log('  - Quest ID:', result.questId)
      console.log('  - Title:', result.quest?.title)
      console.log('  - Description:', result.quest?.description)
      console.log('  - Subject:', result.quest?.subject)
      console.log('  - Difficulty:', result.quest?.difficulty)
      console.log('  - Question Count:', result.quest?.questions?.length)
      console.log('  - AI Provider:', result.quest?.metadata?.provider)
      console.log('  - AI Model:', result.quest?.metadata?.model)
      console.log('')

      if (result.quest?.questions && result.quest.questions.length > 0) {
        console.log('📝 Sample Question (first one):')
        const firstQ = result.quest.questions[0]
        console.log('  - Question:', firstQ.question)
        console.log('  - Options:', firstQ.options)
        console.log('  - Correct Answer:', firstQ.options[firstQ.correctAnswer])
        console.log('  - Explanation:', firstQ.explanation)
      }
    } else {
      console.log('❌ ERROR! Failed to generate quest\n')
      console.log('Error Response:')
      console.log(JSON.stringify(result, null, 2))
    }
  } catch (error) {
    console.error('❌ EXCEPTION:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Run the test
testAIGuestGeneration()
  .then(() => {
    console.log('\n✅ Test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })

