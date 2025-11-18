import express from 'express'
import Quest from '../models/Quest.js'

const router = express.Router()

const buildFilter = (query = {}) => {
  const filter = {}
  if (query.subject) filter.subject = query.subject
  if (query.category) filter.category = query.category
  if (query.questId) filter.questId = query.questId
  return filter
}

// Get quests (optionally filtered by subject/category)
router.get('/', async (req, res) => {
  try {
    const filter = buildFilter(req.query)
    const quests = await Quest.find(filter).lean()
    res.json({ success: true, quests })
  } catch (error) {
    console.error('Error fetching quests:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch quests' })
  }
})

// Get quest by composite key
router.get('/by-key', async (req, res) => {
  try {
    const { subject, category, questId } = req.query
    if (!questId) {
      return res.status(400).json({ success: false, error: 'questId is required' })
    }

    const quest = await Quest.findOne(buildFilter({ subject, category, questId })).lean()
    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found' })
    }

    res.json({ success: true, quest })
  } catch (error) {
    console.error('Error fetching quest by key:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch quest' })
  }
})

// Create or update quest
router.post('/', async (req, res) => {
  try {
    const { questId, subject = 'general', category = 'general', ...rest } = req.body
    if (!questId) {
      return res.status(400).json({ success: false, error: 'questId is required' })
    }

    const quest = await Quest.findOneAndUpdate(
      { questId, subject, category },
      { questId, subject, category, ...rest },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean()

    res.json({ success: true, quest })
  } catch (error) {
    console.error('Error creating/updating quest:', error)
    res.status(500).json({ success: false, error: 'Failed to save quest' })
  }
})

// Update quest by composite key
router.put('/by-key', async (req, res) => {
  try {
    const { questId, subject = 'general', category = 'general', ...rest } = req.body
    if (!questId) {
      return res.status(400).json({ success: false, error: 'questId is required' })
    }

    const quest = await Quest.findOneAndUpdate(
      { questId, subject, category },
      { $set: { ...rest, updatedAt: new Date() } },
      { new: true }
    ).lean()

    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found' })
    }

    res.json({ success: true, quest })
  } catch (error) {
    console.error('Error updating quest:', error)
    res.status(500).json({ success: false, error: 'Failed to update quest' })
  }
})

// Bulk upsert quests
router.post('/bulk', async (req, res) => {
  try {
    const { quests } = req.body
    if (!Array.isArray(quests)) {
      return res.status(400).json({ success: false, error: 'quests must be an array' })
    }

    const operations = quests.map((quest) => {
      const { questId, subject = 'general', category = 'general', ...rest } = quest
      if (!questId) {
        return null
      }
      return Quest.findOneAndUpdate(
        { questId, subject, category },
        { questId, subject, category, ...rest },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    }).filter(Boolean)

    const results = await Promise.all(operations)
    res.json({ success: true, count: results.length })
  } catch (error) {
    console.error('Error bulk saving quests:', error)
    res.status(500).json({ success: false, error: 'Failed to save quests' })
  }
})

// Delete quest by id (Mongo _id)
router.delete('/:id', async (req, res) => {
  try {
    await Quest.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting quest:', error)
    res.status(500).json({ success: false, error: 'Failed to delete quest' })
  }
})

export default router
