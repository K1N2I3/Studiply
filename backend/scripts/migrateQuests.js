import dotenv from 'dotenv'
import mongoose from 'mongoose'
import admin from 'firebase-admin'
import Quest from '../models/Quest.js'

dotenv.config()

const initFirebase = () => {
  if (admin.apps.length) {
    return admin.app()
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.')
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    })
  })
}

const migrateQuests = async () => {
  try {
    initFirebase()
    const firestore = admin.firestore()

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studyhub'
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    const snapshot = await firestore.collection('quests').get()
    console.log(`🔄 Found ${snapshot.size} quests in Firestore. Migrating...`)

    let migrated = 0
    for (const doc of snapshot.docs) {
      const data = doc.data()
      const { subject, category, questId } = data || {}

      if (!subject || !category || !questId) {
        console.warn(`⚠️ Skipping quest ${doc.id} due to missing identifiers`)
        continue
      }

      await Quest.findOneAndUpdate(
        { subject, category, questId },
        {
          ...data,
          subject,
          category,
          questId,
          migratedAt: new Date()
        },
        { upsert: true, setDefaultsOnInsert: true }
      )

      migrated += 1
      if (migrated % 50 === 0) {
        console.log(`...migrated ${migrated} quests`)
      }
    }

    console.log(`✅ Migration complete. Total quests migrated: ${migrated}`)
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Quest migration failed:', error)
    process.exit(1)
  }
}

migrateQuests()

