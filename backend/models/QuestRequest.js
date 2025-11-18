import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.Mixed },
    type: { type: String, default: 'multiple-choice' },
    question: String,
    options: [mongoose.Schema.Types.Mixed],
    correctAnswer: mongoose.Schema.Types.Mixed,
    correctAnswers: [mongoose.Schema.Types.Mixed],
    explanation: String,
    difficulty: String,
    points: Number
  },
  { _id: false }
)

const QuestRequestSchema = new mongoose.Schema(
  {
    legacyId: { type: String, default: null, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, default: 'beginner' },
    questionType: { type: String, default: 'multiple-choice' },
    questions: { type: [QuestionSchema], default: [] },
    createdBy: { type: String, required: true },
    createdByName: { type: String, default: 'Unknown' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: { type: String, default: null },
    reviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' },
    approvedQuestId: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: true
  }
)

QuestRequestSchema.index({ status: 1, createdAt: -1 })
QuestRequestSchema.index({ createdBy: 1, createdAt: -1 })

const QuestRequest = mongoose.model('QuestRequest', QuestRequestSchema)

export default QuestRequest

