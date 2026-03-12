import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatSession from '@/lib/models/ChatSession';

export async function POST(request) {
  try {
    const { sessionId, message } = await request.json();

    if (!sessionId || !message?.trim()) {
      return NextResponse.json(
        { error: 'sessionId and message are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    session.messages.push({
      role: 'assistant',
      content: message.trim(),
      createdAt: new Date(),
    });

    session.updatedAt = new Date();
    await session.save();

    return NextResponse.json({ success: true, messageCount: session.messages.length });
  } catch (err) {
    console.error('[Admin Reply] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
