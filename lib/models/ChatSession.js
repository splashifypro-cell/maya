import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    messages:  [MessageSchema],
    metadata: {
      userAgent:  String,
      ip:         String,
      language:   String,
    },
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
