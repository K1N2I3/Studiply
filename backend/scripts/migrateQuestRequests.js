import dotenv from 'dotenv'
import mongoose from 'mongoose'
import admin from 'firebase-admin'
import QuestRequest from '../models/QuestRequest.js'
import Quest from '../models/Quest.js'

dotenv.config()

const shouldDeleteSource = process.env.DELETE_SOURCE_AFTER_MIGRATION === 'true'

const initFirebase = () => {
  if (admin.apps.length) return
  const projectId = process.env.FIREBASE_PROJECT_ID || 'study-hub-1297a'
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) {
    console.error('Firebase credentials are not set. Please configure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.')
    process.exit(1)
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    })
  })
}

const migrateQuestRequests = async (firestore) => {
  const snapshot = await firestore.collection('questRequests').get()
  console.log(`📦 Found ${snapshot.size} questRequests in Firestore`)

  let migrated = 0
  for (const doc of snapshot.docs) {
    const data = doc.data()
    await QuestRequest.findOneAndUpdate(
      { legacyId: doc.id },
      { ...data, legacyId: doc.id },
      { upsert: true, setDefaultsOnInsert: true }
    )

    if (shouldDeleteSource) {
      await doc.ref.delete()
    }

    migrated++
  }

  console.log(`✅ Migrated ${migrated} quest requests`)
}

const migrateQuests = async (firestore) => {
  const snapshot = await firestore.collection('quests').get()
  console.log(`📦 Found ${snapshot.size} quests in Firestore`)

  let migrated = 0
  for (const doc of snapshot.docs) {
    const data = doc.data()
    const { questId, subject = 'general', category = 'general' } = data

    if (!questId) {
      console.warn(`Skipping quest ${doc.id} because questId is missing`)
      continue
    }

    await Quest.findOneAndUpdate(
      { questId, subject, category },
      { questId, subject, category, ...data },
      { upsert: true, setDefaultsOnInsert: true }
    )

    if (shouldDeleteSource) {
      await doc.ref.delete()
    }

    migrated++
  }

  console.log(`✅ Migrated ${migrated} quests`)
}

const migrate = async () => {
  try {
    initFirebase()

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studyhub'
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    const firestore = admin.firestore()

    await migrateQuestRequests(firestore)
    await migrateQuests(firestore)

    console.log('🎉 Quest data migration complete.')
    if (shouldDeleteSource) {
      console.log('🧹 Source documents were deleted from Firestore.')
    } else {
      console.log('ℹ️ Source documents were left intact. Set DELETE_SOURCE_AFTER_MIGRATION=true to remove them automatically.')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

