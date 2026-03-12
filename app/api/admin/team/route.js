import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';

export async function GET() {
  await connectDB();
  const members = await TeamMember.find({}).sort({ createdAt: -1 });
  return NextResponse.json(members);
}

export async function POST(request) {
  await connectDB();
  const data = await request.json();
  const member = await TeamMember.create(data);
  return NextResponse.json(member);
}

export async function PUT(request) {
  await connectDB();
  const data = await request.json();
  const { id, ...updateData } = data;
  const member = await TeamMember.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(member);
}

export async function DELETE(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await TeamMember.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
