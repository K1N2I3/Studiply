import mongoose from 'mongoose'

const QuestSchema = new mongoose.Schema(
  {
    questId: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true }
  },
  {
    timestamps: true,
    strict: false,
    minimize: false
  }
)

QuestSchema.index({ subject: 1, category: 1, questId: 1 }, { unique: true })

export default mongoose.model('Quest', QuestSchema)

