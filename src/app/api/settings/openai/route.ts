import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This API writes the OPENAI_API_KEY to a local `.env.local` file for
// convenience. IMPORTANT: do NOT enable this in production without
// a secure admin/auth gate and an audit trail.

export async function POST(req: NextRequest) {
  // Guard: refuse in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Bu işlem üretimde devre dışıdır.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newKey = typeof body?.key === 'string' ? body.key.trim() : '';

    if (!newKey) {
      return NextResponse.json({ error: 'Anahtar boş olamaz.' }, { status: 400 });
    }

    const root = process.cwd();
    const envPath = path.join(root, '.env.local');

    // Load or create file lines
    let lines: string[] = [];
    try {
      if (fs.existsSync(envPath)) {
        const current = fs.readFileSync(envPath, 'utf8');
        lines = current.split(/\r?\n/);
      }
    } catch {
      // ignore read error, we'll recreate
      lines = [];
    }

    // Replace or append
    const keyLineIndex = lines.findIndex(l => l.startsWith('OPENAI_API_KEY='));
    const escaped = `OPENAI_API_KEY=${newKey}`;

    if (keyLineIndex > -1) {
      lines[keyLineIndex] = escaped;
    } else {
      lines.push(escaped);
    }

    fs.writeFileSync(envPath, lines.join('\n'), { encoding: 'utf8' });

    // Don't echo the key back to client
    return NextResponse.json({ message: 'Anahtar .env.local dosyasına kaydedildi. Sunucuyu yeniden başlatın.' });
  } catch (err) {
    console.error('OPENAI KEY save error', err);
    return NextResponse.json({ error: 'Yazma hatası.' }, { status: 500 });
  }
}
