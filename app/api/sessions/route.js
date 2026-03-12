import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatSession from '@/lib/models/ChatSession';

// GET /api/sessions?limit=50
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

    const sessions = await ChatSession.find({})
      .sort({ lastActive: -1 })
      .limit(limit)
      .select('sessionId messageCount lastActive createdAt messages')
      .lean();

    const result = sessions.map((s) => ({
      sessionId: s.sessionId,
      messageCount: s.messages?.length || 0,
      lastMessage: s.messages?.at(-1)?.content?.slice(0, 80) || '',
      lastActive: s.lastActive,
      createdAt: s.createdAt,
    }));

    return NextResponse.json({ sessions: result, total: result.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
