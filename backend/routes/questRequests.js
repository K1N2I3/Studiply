import express from 'express'
import QuestRequest from '../models/QuestRequest.js'
import Quest from '../models/Quest.js'

const router = express.Router()

const buildQuery = ({ status, userId }) => {
  const query = {}
  if (status && status !== 'all') {
    query.status = status
  }
  if (userId) {
    query.createdBy = userId
  }
  return query
}

// Create quest request
router.post('/', async (req, res) => {
  try {
    console.log('📝 [Quest Request] Received POST request:', {
      userId: req.body.userId,
      userName: req.body.userName,
      hasQuestData: !!req.body.questData,
      subject: req.body.questData?.subject,
      category: req.body.questData?.category,
      title: req.body.questData?.title
    })

    const {
      userId,
      userName,
      questData = {}
    } = req.body

    if (!userId) {
      console.error('❌ [Quest Request] Missing userId')
      return res.status(400).json({ success: false, error: 'userId is required' })
    }

    if (!questData.subject || !questData.category || !questData.title) {
      console.error('❌ [Quest Request] Missing required fields:', {
        hasSubject: !!questData.subject,
        hasCategory: !!questData.category,
        hasTitle: !!questData.title
      })
      return res.status(400).json({ success: false, error: 'subject, category and title are required' })
    }

    const payload = {
      title: questData.title,
      description: questData.description || '',
      subject: questData.subject,
      category: questData.category,
      difficulty: questData.difficulty || 'beginner',
      questionType: questData.questionType || 'multiple-choice',
      questions: Array.isArray(questData.questions) ? questData.questions : [],
      createdBy: userId,
      createdByName: userName || 'Unknown',
      metadata: questData.metadata || {}
    }

    console.log('💾 [Quest Request] Saving to MongoDB...')
    const request = await QuestRequest.create(payload)
    console.log('✅ [Quest Request] Successfully saved to MongoDB:', {
      requestId: request._id,
      title: request.title,
      subject: request.subject,
      category: request.category
    })

    res.json({
      success: true,
      requestId: request._id,
      request
    })
  } catch (error) {
    console.error('❌ [Quest Request] Error creating quest request:', error)
    res.status(500).json({ success: false, error: 'Failed to create quest request' })
  }
})

// Get quest requests by status
router.get('/', async (req, res) => {
  try {
    const { status = 'all' } = req.query
    const query = buildQuery({ status })
    const requests = await QuestRequest.find(query).sort({ createdAt: -1 }).lean()
    res.json({ success: true, requests })
  } catch (error) {
    console.error('Error fetching quest requests:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch quest requests' })
  }
})

// Get quest requests for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const requests = await QuestRequest.find({ createdBy: userId }).sort({ createdAt: -1 }).lean()
    res.json({ success: true, requests })
  } catch (error) {
    console.error('Error fetching user quest requests:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch quest requests' })
  }
})

// Approve quest request
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const { adminUserId } = req.body

    const request = await QuestRequest.findById(id)
    if (!request) {
      return res.status(404).json({ success: false, error: 'Quest request not found' })
    }

    if (request.status === 'approved') {
      return res.json({ success: true, questId: request.approvedQuestId, request })
    }

    const questId = request.approvedQuestId || `user-quest-${Date.now()}`
    const subject = request.subject || 'general'
    const category = request.category || 'general'

    const requestData = request.toObject({ depopulate: true })
    const { _id, __v, createdAt, updatedAt, ...rest } = requestData

    const questPayload = {
      ...rest,
      createdAt,
      updatedAt,
      questId,
      subject,
      category,
      status: 'approved',
      reviewedAt: new Date(),
      reviewedBy: adminUserId || 'system',
      approvedAt: new Date()
    }

    await Quest.findOneAndUpdate(
      { questId, subject, category },
      questPayload,
      { upsert: true, setDefaultsOnInsert: true }
    )

    request.status = 'approved'
    request.reviewedAt = new Date()
    request.reviewedBy = adminUserId || 'system'
    request.approvedQuestId = questId
    await request.save()

    res.json({ success: true, questId, request })
  } catch (error) {
    console.error('Error approving quest request:', error)
    res.status(500).json({ success: false, error: 'Failed to approve quest request' })
  }
})

// Reject quest request
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params
    const { adminUserId, rejectionReason = '' } = req.body

    const request = await QuestRequest.findById(id)
    if (!request) {
      return res.status(404).json({ success: false, error: 'Quest request not found' })
    }

    request.status = 'rejected'
    request.reviewedAt = new Date()
    request.reviewedBy = adminUserId || 'system'
    request.rejectionReason = rejectionReason || 'No reason provided'
    await request.save()

    res.json({ success: true, request })
  } catch (error) {
    console.error('Error rejecting quest request:', error)
    res.status(500).json({ success: false, error: 'Failed to reject quest request' })
  }
})

// Delete quest request
router.delete('/:id', async (req, res) => {
  try {
    await QuestRequest.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting quest request:', error)
    res.status(500).json({ success: false, error: 'Failed to delete quest request' })
  }
})

export default router

