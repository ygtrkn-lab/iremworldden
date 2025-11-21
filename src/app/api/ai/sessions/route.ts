import { NextRequest, NextResponse } from 'next/server';
import { getSessionsForUser, upsertSession, getSessionById } from '@/lib/ai-sessions';
import { logActivity } from '@/lib/server-utils';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const id = new URL(request.url).searchParams.get('id');

    if (id) {
      const session = getSessionById(id);
      if (!session) return NextResponse.json({ error: 'not found' }, { status: 404 });
      if (session.userId !== userId) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      return NextResponse.json({ session });
    }

    const sessions = getSessionsForUser(userId);
    return NextResponse.json({ sessions });
  } catch (err) {
    console.error('GET /api/ai/sessions', err);
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const body = await request.json();
    const sessionUpdate = {
      id: typeof body?.id === 'string' ? body.id : undefined,
      userId,
      title: typeof body?.title === 'string' ? body.title : undefined,
      messages: Array.isArray(body?.messages) ? body.messages : undefined,
    } as { id?: string; userId?: string; title?: string; messages?: unknown[] };

    const saved = upsertSession(sessionUpdate);
    // Log that a session was saved/updated for auditing
    try {
      logActivity(
        userId,
        request.headers.get('x-user-name') || 'Anonymous',
        request.headers.get('x-user-email') || '',
        'ai_insight_allowed',
        `Saved AI session ${saved.id} (${(saved.messages || []).length} messages)`,
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
        request.headers.get('user-agent') || 'Unknown',
        'system',
        saved.id,
        'success',
        { sessionId: saved.id, messageCount: (saved.messages || []).length }
      );
    } catch (err) {
      // ignore logging errors
    }
    return NextResponse.json({ session: saved });
  } catch (err) {
    console.error('POST /api/ai/sessions', err);
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}
