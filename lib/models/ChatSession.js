import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant', 'agent'], required: true },
  content:   { type: String, required: true },
  isInternal: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const ChatSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    visitor: {
      name: String,
      email: String,
      whatsapp: String,
    },
    status: { type: String, enum: ['open', 'resolved', 'pending'], default: 'open' },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages:  [MessageSchema],
    metadata: {
      userAgent:  String,
      ip:         String,
      language:   String,
      pageUrl:    String,
      country:    String,
    },
    tags: [String],
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-update lastActive on save
ChatSessionSchema.pre('save', function () {
  this.lastActive = new Date();
});

export default mongoose.models.ChatSession ||
  mongoose.model('ChatSession', ChatSessionSchema);
