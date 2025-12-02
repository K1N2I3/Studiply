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

const AIQuestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true },
    category: { type: String, default: 'ai-generated' },
    difficulty: { type: String, default: 'beginner' },
    questionType: { type: String, default: 'multiple-choice' },
    questions: { type: [QuestionSchema], default: [] },
    createdBy: { type: String, required: true, index: true },
    createdByName: { type: String, default: 'Unknown' },
    prompt: { type: String, default: '' }, // 保存用户输入的提示词
    isPrivate: { type: Boolean, default: true }, // AI 生成的 quest 默认私有
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: true
  }
)

AIQuestSchema.index({ createdBy: 1, createdAt: -1 })
AIQuestSchema.index({ subject: 1, createdAt: -1 })

const AIQuest = mongoose.model('AIQuest', AIQuestSchema)

export default AIQuest

