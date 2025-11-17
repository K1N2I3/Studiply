import express from 'express'
import Quest from '../models/Quest.js'

const router = express.Router()

const sanitizeQuest = (questDoc) => {
  if (!questDoc) return null
  const { _id, __v, createdAt, updatedAt, ...rest } = questDoc
  return rest
}

// Get all quests grouped by subject/category
router.get('/all', async (req, res) => {
  try {
    const quests = await Quest.find({}).lean()
    const grouped = {}

    quests.forEach((quest) => {
      const { subject, category, questId } = quest
      if (!subject || !category || !questId) {
        return
      }

      if (!grouped[subject]) grouped[subject] = {}
      if (!grouped[subject][category]) grouped[subject][category] = {}

      grouped[subject][category][questId] = sanitizeQuest(quest)
    })

    res.json({
      success: true,
      quests: grouped
    })
  } catch (error) {
    console.error('Error fetching quests:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quests'
    })
  }
})

// Get single quest
router.get('/:subject/:category/:questId', async (req, res) => {
  const { subject, category, questId } = req.params
  try {
    const quest = await Quest.findOne({ subject, category, questId }).lean()

    if (!quest) {
      return res.status(404).json({
        success: false,
        error: 'Quest not found'
      })
    }

    res.json({
      success: true,
      quest: sanitizeQuest(quest)
    })
  } catch (error) {
    console.error('Error fetching quest:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quest'
    })
  }
})

// Create or update quest
router.post('/:subject/:category/:questId', async (req, res) => {
  const { subject, category, questId } = req.params
  const data = req.body || {}

  if (!subject || !category || !questId) {
    return res.status(400).json({
      success: false,
      error: 'Subject, category, and questId are required'
    })
  }

  try {
    const questData = {
      ...data,
      subject,
      category,
      questId,
      updatedAt: new Date()
    }

    const quest = await Quest.findOneAndUpdate(
      { subject, category, questId },
      questData,
      { upsert: true, new: true, setDefaultsOnInsert: true, lean: true }
    )

    res.json({
      success: true,
      quest: sanitizeQuest(quest)
    })
  } catch (error) {
    console.error('Error saving quest:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to save quest'
    })
  }
})

// Bulk sync quests (nested structure)
router.post('/bulk-sync', async (req, res) => {
  const { quests } = req.body || {}
  if (!quests || typeof quests !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Invalid quests payload'
    })
  }

  try {
    const operations = []
    for (const [subject, categories] of Object.entries(quests)) {
      if (!categories || typeof categories !== 'object') continue

      for (const [category, questMap] of Object.entries(categories)) {
        if (!questMap || typeof questMap !== 'object') continue

        for (const [questId, questData] of Object.entries(questMap)) {
          if (!questId) continue
          operations.push({
            updateOne: {
              filter: { subject, category, questId },
              update: {
                ...questData,
                subject,
                category,
                questId,
                updatedAt: new Date()
              },
              upsert: true
            }
          })
        }
      }
    }

    if (operations.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No quests to sync'
      })
    }

    await Quest.bulkWrite(operations, { ordered: false })

    res.json({
      success: true,
      count: operations.length
    })
  } catch (error) {
    console.error('Error bulk syncing quests:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to sync quests'
    })
  }
})

export default router

