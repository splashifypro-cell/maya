import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatSession from '@/lib/models/ChatSession';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const session = await ChatSession.findOne({ sessionId: params.id }).lean();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      sessionId: session.sessionId,
      messages: session.messages,
      metadata: session.metadata,
      createdAt: session.createdAt,
      lastActive: session.lastActive,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
