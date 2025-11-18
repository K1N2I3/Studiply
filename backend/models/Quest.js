import mongoose from 'mongoose'

const QuestSchema = new mongoose.Schema(
  {
    questId: { type: String, required: true },
    subject: { type: String, default: 'general' },
    category: { type: String, default: 'general' }
  },
  {
    timestamps: true,
    strict: false
  }
)

QuestSchema.index({ subject: 1, category: 1, questId: 1 }, { unique: true })

const Quest = mongoose.model('Quest', QuestSchema)

export default Quest
