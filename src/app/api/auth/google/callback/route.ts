import { NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/server-utils';
import { User } from '@/types/user';

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
};

type GoogleProfileResponse = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

function generateUserId(users: User[]): string {
  const numericIds = users
    .map(user => Number(user.id?.replace(/\D/g, '')))
    .filter(id => !Number.isNaN(id));
  const nextId = (numericIds.length ? Math.max(...numericIds) + 1 : 1)
    .toString()
    .padStart(3, '0');
  return `U${nextId}`;
}

function buildHtmlRedirect(user: Omit<User, 'password'>, error?: string) {
  if (error) {
    const safeMessage = error.replace(/</g, '&lt;');
    return new Response(
      `<!DOCTYPE html><html><body style="font-family:system-ui;background:#050505;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;">
        <div style="background:rgba(255,255,255,0.06);padding:32px;border-radius:16px;border:1px solid rgba(255,255,255,0.12);max-width:420px;text-align:center;">
          <h1>Google Girişi Başarısız</h1>
          <p style="margin:16px 0;color:#ddd;">${safeMessage}</p>
          <a href="/login" style="color:#ff8c42;text-decoration:none;font-weight:600;">Giriş sayfasına dön</a>
        </div>
      </body></html>`
    , { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const serializedUser = JSON.stringify(user).replace(/</g, '\\u003c');
  const script = `
    (function(){
      try {
        const user = ${serializedUser};
        localStorage.setItem('irem_user', JSON.stringify(user));
        localStorage.setItem('irem_session', JSON.stringify({ timestamp: Date.now(), rememberMe: false }));
        localStorage.removeItem('irem_remember_me');
        window.location.replace('/');
      } catch (err) {
        console.error('Google login storage error', err);
        window.location.replace('/login?error=google-storage');
      }
    })();
  `;

  return new Response(
    `<!DOCTYPE html><html><body style="background:#050505;color:#fff;font-family:system-ui;">
      <p style="text-align:center;margin-top:20vh;">Google hesabınız doğrulanıyor...</p>
      <script>${script}</script>
    </body></html>`
  , { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return buildHtmlRedirect({} as User, 'Google doğrulama kodu alınamadı.');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${url.origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return buildHtmlRedirect({} as User, 'Sunucu yapılandırması eksik (GOOGLE_CLIENT_ID veya SECRET bulunamadı).');
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      return buildHtmlRedirect({} as User, `Google token isteği başarısız: ${err}`);
    }

    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
    if (!tokenData.access_token) {
      return buildHtmlRedirect({} as User, 'Google erişim tokenı alınamadı.');
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    if (!profileResponse.ok) {
      const err = await profileResponse.text();
      return buildHtmlRedirect({} as User, `Google profil isteği başarısız: ${err}`);
    }

    const profile = (await profileResponse.json()) as GoogleProfileResponse;
    if (!profile.email) {
      return buildHtmlRedirect({} as User, 'Google hesabınızın e-posta bilgisine ulaşılamadı.');
    }

    const users = readUsers();
    let existingUser = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());

    if (existingUser && !existingUser.isActive) {
      return buildHtmlRedirect({} as User, 'Hesabınız pasif durumda. Lütfen yönetici ile iletişime geçin.');
    }

    if (!existingUser) {
      existingUser = {
        id: generateUserId(users),
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        password: 'google-oauth',
        role: 'agent',
        avatar: profile.picture,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      users.push(existingUser);
    } else {
      existingUser.name = profile.name || existingUser.name;
      if (profile.picture) {
        existingUser.avatar = profile.picture;
      }
    }

    existingUser.lastLogin = new Date().toISOString();
    existingUser.updatedAt = new Date().toISOString();
    writeUsers(users);

    const { password, ...userWithoutPassword } = existingUser;
    return buildHtmlRedirect(userWithoutPassword);
  } catch (error) {
    console.error('Google callback error:', error);
    return buildHtmlRedirect({} as User, 'Google ile giriş sırasında bir hata oluştu.');
  }
}
