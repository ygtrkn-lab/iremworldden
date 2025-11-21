import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'Missing GOOGLE_CLIENT_ID env variable' }, { status: 500 });
  }

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(url);
}
