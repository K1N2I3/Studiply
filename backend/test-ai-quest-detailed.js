import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const API_BASE_URL = process.env.API_BASE_URL || 'https://studiply.onrender.com/api'

async function testAIGuestGeneration() {
  console.log('🧪 Testing AI Quest Generation (Detailed)...\n')
  console.log('API Base URL:', API_BASE_URL)
  console.log('')

  // Test with different configurations
  const testCases = [
    {
      name: 'Test 1: Basic Math (3 questions)',
      data: {
        userId: 'test-user-123',
        userName: 'Test User',
        subject: 'mathematics',
        prompt: 'Basic algebra equations with one variable',
        difficulty: 'beginner',
        questionCount: 3
      }
    },
    {
      name: 'Test 2: English Grammar (5 questions)',
      data: {
        userId: 'test-user-456',
        userName: 'Test User 2',
        subject: 'english',
        prompt: 'Present tense and past tense verbs',
        difficulty: 'intermediate',
        questionCount: 5
      }
    }
  ]

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(testCase.name)
    console.log('='.repeat(60))
    console.log('📝 Request Data:')
    console.log(JSON.stringify(testCase.data, null, 2))
    console.log('')

    try {
      console.log('🚀 Sending request...')
      const startTime = Date.now()

      const response = await fetch(`${API_BASE_URL}/ai-quests/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.data)
      })

      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2)
      console.log(`⏱️  Response time: ${elapsedTime}s`)
      console.log(`📊 Status: ${response.status} ${response.statusText}`)

      const result = await response.json()

      if (response.ok && result.success) {
        console.log('\n✅ SUCCESS! Quest generated!\n')
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
          console.log('📝 Sample Questions:')
          result.quest.questions.slice(0, 2).forEach((q, idx) => {
            console.log(`\n  Question ${idx + 1}:`)
            console.log('    -', q.question)
            console.log('    - Options:', q.options)
            console.log('    - Correct:', q.options[q.correctAnswer])
            console.log('    - Explanation:', q.explanation)
          })
        }
      } else {
        console.log('\n❌ ERROR! Failed to generate quest\n')
        console.log('Error Response:')
        console.log(JSON.stringify(result, null, 2))
        
        // Check if it's a model name error
        if (result.error && result.error.includes('not_found_error') && result.error.includes('model:')) {
          console.log('\n⚠️  MODEL NAME ERROR DETECTED!')
          console.log('This means the Render backend is still using an old model name.')
          console.log('Please update CLAUDE_MODEL in Render environment variables to:')
          console.log('  claude-sonnet-4-20250514')
          console.log('Or delete CLAUDE_MODEL to use the new default.')
        }
      }
    } catch (error) {
      console.error('❌ EXCEPTION:', error.message)
      if (error.stack) {
        console.error('Stack:', error.stack.split('\n').slice(0, 3).join('\n'))
      }
    }

    // Wait a bit between tests
    if (testCase !== testCases[testCases.length - 1]) {
      console.log('\n⏳ Waiting 2 seconds before next test...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ All tests completed')
  console.log('='.repeat(60))
}

// Run the test
testAIGuestGeneration()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })

