import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatSession from '@/lib/models/ChatSession';
import TeamMember from '@/lib/models/TeamMember';

export async function GET() {
  try {
    await connectDB();

    // 1. Total Conversations
    const totalConversations = await ChatSession.countDocuments();

    // 2. Active Visitors (visitors who were active in the last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const activeVisitors = await ChatSession.countDocuments({
      lastActive: { $gte: fifteenMinutesAgo }
    });

    // 3. Open vs Resolved
    const openConversations = await ChatSession.countDocuments({ status: 'open' });
    const resolvedConversations = await ChatSession.countDocuments({ status: 'resolved' });

    // 4. Team Online Status
    const totalTeam = await TeamMember.countDocuments();
    const onlineTeam = await TeamMember.countDocuments({ isOnline: true });

    // 5. Recent Activity (last 5 conversations)
    const recentConversations = await ChatSession.find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('sessionId visitor status updatedAt messages');

    return NextResponse.json({
      stats: {
        totalConversations,
        activeVisitors,
        openConversations,
        resolvedConversations,
        totalTeam,
        onlineTeam
      },
      recentConversations: recentConversations.map(conv => ({
        id: conv.sessionId,
        name: conv.visitor?.name || `Visitor #${conv.sessionId.slice(-4)}`,
        lastMessage: conv.messages[conv.messages.length - 1]?.content || 'New chat',
        status: conv.status,
        time: conv.updatedAt
      }))
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
