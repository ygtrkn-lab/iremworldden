import { NextRequest, NextResponse } from 'next/server';
import { logActivity } from '@/lib/server-utils';

export async function POST(request: NextRequest) {
  try {
    // Restrict this endpoint: require a server-side secret so it can't be called
    // directly from browser DevTools. Use an environment variable to avoid
    // leaking the secret.
    const secret = process.env.IREM_INTERNAL_API_SECRET || '';
    const headerSecret = request.headers.get('x-internal-secret') || '';
    if (!secret || headerSecret !== secret) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 });
    }
    const body = await request.json();
    const event = typeof body?.event === 'string' ? body.event : 'client_block';
    const message = typeof body?.message === 'string' ? body.message : '';
    const reason = typeof body?.reason === 'string' ? body.reason : '';
    const confidence = typeof body?.confidence === 'number' ? body.confidence : undefined;

    const userId = request.headers.get('x-user-id') || 'anonymous';
    const userName = request.headers.get('x-user-name') || 'Anonymous';
    const userEmail = request.headers.get('x-user-email') || '';

    const action = event === 'client_block' ? 'ai_insight_blocked' : 'ai_insight_allowed';

    await logActivity(
      userId,
      userName,
      userEmail,
      action,
      `Client AI log: ${message.slice(0, 240)}${reason ? ` (${reason})` : ''}`,
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
      request.headers.get('user-agent') || 'Unknown',
      'system',
      undefined,
      action === 'ai_insight_blocked' ? 'warning' : 'success',
      { event, reason, confidence }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Insight client log failed:', error);
    return NextResponse.json({ error: 'log failed' }, { status: 500 });
  }
}
