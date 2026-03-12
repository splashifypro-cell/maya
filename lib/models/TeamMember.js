import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'agent', 'viewer'], default: 'agent' },
  isOnline: { type: Boolean, default: false },
  avatar: String,
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
