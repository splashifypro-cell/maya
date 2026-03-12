import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatSession from '@/lib/models/ChatSession';

export async function GET() {
  await connectDB();
  const conversations = await ChatSession.find({})
    .sort({ updatedAt: -1 })
    .limit(50);
  return NextResponse.json(conversations);
}
