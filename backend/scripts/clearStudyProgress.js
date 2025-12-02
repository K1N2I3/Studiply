import dotenv from 'dotenv'
import admin from 'firebase-admin'
import readline from 'readline'

dotenv.config()

const initFirebase = () => {
  if (admin.apps.length) return
  
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Firebase credentials are not set.')
    console.error('Please configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in backend/.env')
    process.exit(1)
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    })
    console.log('✅ Firebase Admin initialized')
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message)
    process.exit(1)
  }
}

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

const clearAllProgress = async (firestore) => {
  console.log('\n🗑️  Clearing all studyprogress data...')
  
  const snapshot = await firestore.collection('studyprogress').get()
  const totalDocs = snapshot.size
  
  if (totalDocs === 0) {
    console.log('✅ No documents found in studyprogress collection')
    return
  }

  console.log(`📦 Found ${totalDocs} document(s) to delete`)
  
  let deleted = 0
  const batch = firestore.batch()
  let batchCount = 0
  const BATCH_SIZE = 500 // Firestore batch limit

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref)
    batchCount++
    deleted++

    // Firestore allows max 500 operations per batch
    if (batchCount >= BATCH_SIZE) {
      await batch.commit()
      console.log(`   Deleted ${deleted}/${totalDocs} documents...`)
      batchCount = 0
    }
  }

  // Commit remaining deletions
  if (batchCount > 0) {
    await batch.commit()
  }

  console.log(`✅ Successfully deleted ${deleted} document(s) from studyprogress collection`)
}

const clearUserProgress = async (firestore, userId) => {
  console.log(`\n🗑️  Clearing studyprogress for user: ${userId}`)
  
  const userRef = firestore.collection('studyprogress').doc(userId)
  const userDoc = await userRef.get()

  if (!userDoc.exists) {
    console.log(`⚠️  No progress found for user ${userId}`)
    return
  }

  await userRef.delete()
  console.log(`✅ Successfully deleted progress for user ${userId}`)
}

const listAllUsers = async (firestore) => {
  console.log('\n📋 Listing all users in studyprogress collection...')
  
  const snapshot = await firestore.collection('studyprogress').get()
  
  if (snapshot.empty) {
    console.log('   No users found')
    return []
  }

  const users = []
  snapshot.forEach(doc => {
    const data = doc.data()
    users.push({
      userId: doc.id,
      totalXP: data.totalXP || 0,
      gold: data.gold || 0,
      completedQuests: data.completedQuests?.length || 0,
      currentLevel: data.currentLevel || 1
    })
  })

  console.log(`\n   Found ${users.length} user(s):\n`)
  users.forEach((user, index) => {
    console.log(`   ${index + 1}. User ID: ${user.userId}`)
    console.log(`      XP: ${user.totalXP}, Gold: ${user.gold}, Quests: ${user.completedQuests}, Level: ${user.currentLevel}`)
    console.log('')
  })

  return users
}

const main = async () => {
  try {
    initFirebase()
    const firestore = admin.firestore()

    console.log('\n🧹 Study Progress Data Cleaner')
    console.log('================================\n')

    // List all users first
    const users = await listAllUsers(firestore)

    if (users.length === 0) {
      console.log('✅ No data to clear')
      process.exit(0)
    }

    // Ask what to do
    console.log('\nWhat would you like to do?')
    console.log('1. Clear ALL studyprogress data')
    console.log('2. Clear specific user progress')
    console.log('3. Exit')
    
    const choice = await askQuestion('\nEnter your choice (1-3): ')

    if (choice === '1') {
      const confirm = await askQuestion('\n⚠️  WARNING: This will delete ALL studyprogress data. Are you sure? (yes/no): ')
      if (confirm.toLowerCase() === 'yes') {
        await clearAllProgress(firestore)
      } else {
        console.log('❌ Operation cancelled')
      }
    } else if (choice === '2') {
      const userId = await askQuestion('\nEnter user ID to clear: ')
      if (userId.trim()) {
        const confirm = await askQuestion(`\n⚠️  Delete progress for user ${userId}? (yes/no): `)
        if (confirm.toLowerCase() === 'yes') {
          await clearUserProgress(firestore, userId.trim())
        } else {
          console.log('❌ Operation cancelled')
        }
      } else {
        console.log('❌ Invalid user ID')
      }
    } else {
      console.log('👋 Exiting...')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()

