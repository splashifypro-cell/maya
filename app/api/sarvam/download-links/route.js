
import { NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/rate-limiter';

export async function GET(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  if (isRateLimited(ip, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const job_id = searchParams.get('job_id');

  if (!job_id) {
    return NextResponse.json({ error: 'job_id is required' }, { status: 400 });
  }

  try {
    const sarvamRes = await fetch(`https://api.sarvam.ai/doc-digitization/job/v1/${job_id}/download`, {
      method: 'GET',
      headers: {
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
    console.error('[Sarvam Get Download Links]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
