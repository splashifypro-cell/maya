
import { NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rate-limiter';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  if (isRateLimited(ip, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { job_id, filename } = await request.json();

    if (!job_id || !filename) {
      return NextResponse.json({ error: 'job_id and filename are required' }, { status: 400 });
    }

    const sarvamRes = await fetch(`https://api.sarvam.ai/doc-digitization/job/v1/${job_id}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': process.env.SARVAM_API_KEY || '',
      },
      body: JSON.stringify({
        files: [filename]
      })
    });

    if (!sarvamRes.ok) {
      const err = await sarvamRes.text();
      return NextResponse.json({ error: 'Sarvam API error', details: err }, { status: sarvamRes.status });
    }

    const data = await sarvamRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Sarvam Get Upload Links]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
