import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

export async function POST(req: NextRequest) {
  // Restrict classify endpoint so it can't be called directly from the browser
  // Devs can set IREM_INTERNAL_API_SECRET to a random value and use the same
  // header from server-side calls. This prevents the route from showing in
  // casual DevTools network traces.
  const secret = process.env.IREM_INTERNAL_API_SECRET || '';
  const headerSecret = req.headers.get('x-internal-secret') || '';
  if (!secret || headerSecret !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 });
  }
  const client = getClient();
  if (!client) return NextResponse.json({ error: 'OpenAI key not configured' }, { status: 500 });

  try {
    const body = await req.json();
    const message = typeof body?.message === 'string' ? body.message : '';
    const countryName = typeof body?.countryName === 'string' ? body.countryName : '';
    const countryCode = typeof body?.countryCode === 'string' ? body.countryCode : '';
      const context = typeof body?.context === 'string' ? body.context : '';

    if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 });

      const prompt = `You are a relevance classifier. Check if the user's message is specifically about the selected country. Selected country: ${countryName || countryCode}. Context: ${context || 'none'}.\nReturn ONLY JSON: {"relevant": true|false, "confidence": 0.0-1.0, "reason":"one-line"}`;

    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: message }
    ];

    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages.map(m => ({ role: m.role as 'system' | 'user' | 'assistant', content: m.content })),
      temperature: 0,
      max_tokens: 80
    });

    const raw = String(resp.choices?.[0]?.message?.content || '').trim();
    try {
      const parsed = JSON.parse(raw);
      return NextResponse.json({ result: parsed });
    } catch {
      return NextResponse.json({ result: { relevant: /true|evet|yes/i.test(raw), confidence: /([0-9\.]+)/.exec(raw)?.[1] ? Number(/([0-9\.]+)/.exec(raw)?.[1]) : 0.5, reason: raw } });
    }
  } catch {
    console.error('classify error');
    return NextResponse.json({ error: 'classification failed' }, { status: 500 });
  }
}
