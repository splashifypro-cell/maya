
import { NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rate-limiter';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  if (isRateLimited(ip, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { job_id } = await request.json();

    if (!job_id) {
      return NextResponse.json({ error: 'job_id is required' }, { status: 400 });
    }

    const sarvamRes = await fetch(`https://api.sarvam.ai/doc-digitization/job/v1/${job_id}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': process.env.SARVAM_API_KEY || '',
      }
    });

    if (!sarvamRes.ok) {
      const err = await sarvamRes.text();
      return NextResponse.json({ error: 'Sarvam API error', details: err }, { status: sarvamRes.status });
    }

    const data = await sarvamRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Sarvam Start Job]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
