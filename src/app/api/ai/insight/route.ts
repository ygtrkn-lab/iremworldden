import { NextRequest, NextResponse } from 'next/server';
import { logActivity as fileLogActivity } from '@/lib/server-utils';
import OpenAI from 'openai';

// Vercel serverless function timeout configuration
export const maxDuration = 30; // 30 seconds max (Vercel Pro: 60s, Hobby: 10s default)
export const dynamic = 'force-dynamic';

const MAX_HISTORY_MESSAGES = 4; // shorter history speeds up prompts and reduces token use

// Simple in-memory cache to return repeated questions quickly (local dev only).
// Use a persistent cache (Redis) in production if needed.
const ANSWER_CACHE = new Map<
  string,
  { answer: string; expiresAt: number; usage?: unknown }
>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
let cachedClient: OpenAI | null = null;

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return cachedClient;
};

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type CountryContext = {
  capital?: string;
  population?: string;
  region?: string;
  subRegion?: string;
  currency?: string;
  language?: string;
  area?: string;
  density?: string;
  dominantReligion?: string;
  avgPrimePrice?: string;
  marketMomentum?: string;
  riskSignal?: string;
  highlight?: string;
};

const sanitizeConversation = (conversation: unknown): ConversationMessage[] => {
  if (!Array.isArray(conversation)) {
    return [];
  }

  return conversation
    .map<ConversationMessage | null>((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const roleValue = (item as { role?: unknown }).role;
      const role: ConversationMessage['role'] = roleValue === 'assistant' ? 'assistant' : 'user';
      const contentValue = (item as { content?: unknown }).content;
      const content = typeof contentValue === 'string' ? contentValue.trim() : '';

      if (!content) {
        return null;
      }

      return { role, content } as ConversationMessage;
    })
    .filter((item): item is ConversationMessage => Boolean(item))
    .slice(-MAX_HISTORY_MESSAGES);
};

const buildContextBlock = (countryName?: string, countryCode?: string, context?: CountryContext) => {
  const rows: string[] = [];

  if (countryName) {
    rows.push(`Ülke: ${countryName}${countryCode ? ` (${countryCode})` : ''}`);
  }

  if (context?.capital) rows.push(`Başkent: ${context.capital}`);
  if (context?.population) rows.push(`Nüfus: ${context.population}`);
  if (context?.region) rows.push(`Bölge: ${context.region}${context?.subRegion ? ` / ${context.subRegion}` : ''}`);
  if (context?.currency) rows.push(`Para birimi: ${context.currency}`);
  if (context?.language) rows.push(`Resmi diller: ${context.language}`);
  if (context?.area) rows.push(`Yüzölçümü: ${context.area}`);
  if (context?.density) rows.push(`Nüfus yoğunluğu: ${context.density}`);
  if (context?.dominantReligion) rows.push(`Hakim inanç: ${context.dominantReligion}`);
  if (context?.avgPrimePrice) rows.push(`Prime fiyat aralığı: ${context.avgPrimePrice}`);
  if (context?.marketMomentum) rows.push(`Piyasa momentumu: ${context.marketMomentum}`);
  if (context?.riskSignal) rows.push(`Risk seviyesi: ${context.riskSignal}`);
  if (context?.highlight) rows.push(`Öne çıkan not: ${context.highlight}`);

  return rows.length > 0 ? rows.join('\n') : undefined;
};

// Helper: cosine similarity
// dot/magnitude helpers moved to `src/lib/ai-utils.ts` if needed

// cosine moved to `src/lib/ai-utils.ts`

// Relevance classifier and similarity fallback moved to `src/lib/ai-utils.ts`

type ChatCompletionContentPart = {
  text?: string | string[];
  type?: string;
};

const extractText = (content: string | Array<ChatCompletionContentPart | string>) => {
  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }

        if (typeof part?.text === 'string') {
          return part.text;
        }

        if (Array.isArray(part?.text)) {
          return part.text.join(' ');
        }

        return '';
      })
      .join(' ')
      .trim();
  }

  return '';
};

const systemPrompt = `Sen IREMWORLD'ün premium gayrimenkul danışmanı AI asistanısın.\n` +
  `Kullanıcılara seçtikleri ülke hakkında yatırım, yaşam ve gayrimenkul odaklı içgörüler ver.\n` +
  `ÖNEMLİ GÜVENLİK KURALI: SADECE seçilen ülke hakkında soruları yanıtla. Başka ülkeler veya genel konular için kibarca reddet ve kullanıcıyı seçilen ülke hakkında soru sormaya yönlendir.\n` +
  `Yanıtlarını kısa, öz ve hızlı anlaşılır tut (2-3 paragraf maksimum). Uzun açıklamalardan kaçın.\n` +
  `Verileri güncel tut, varsayımlarını net belirt, gerektiğinde kaynak veya uzman desteği öner.\n` +
  `Kullanıcının dili Türkçe değilse onun dilinde cevap ver; aksi halde Türkçe yanıtla.`;
// Security: the assistant should only answer questions about the selected country
// and should not answer general or cross-country questions.
// The server also enforces a pre-check to block non-country queries to reduce API usage.

export async function POST(request: NextRequest) {
  const client = getClient();

  if (!client) {
    return NextResponse.json(
      { error: 'OpenAI API anahtarı yapılandırılmadı.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json(
        { error: 'Lütfen bir soru iletin.' },
        { status: 400 }
      );
    }

    const countryName = typeof body?.countryName === 'string' ? body.countryName : undefined;
    const countryCode = typeof body?.countryCode === 'string' ? body.countryCode : undefined;
    const countryContext: CountryContext | undefined =
      body?.countryContext && typeof body.countryContext === 'object'
        ? body.countryContext
        : undefined;

    const conversation = sanitizeConversation(body?.conversation ?? []);
    const latestIsUser = conversation.at(-1)?.role === 'user';
    const transcript = latestIsUser
      ? [...conversation]
      : [...conversation, { role: 'user', content: message } as ConversationMessage];

    const contextBlock = buildContextBlock(countryName, countryCode, countryContext);

    // Guard: only respond to questions about the selected country
    const isCountryMentioned = (msg: string) => {
      if (!msg) return false;
      const m = msg.toLowerCase();
      if (countryName && m.includes(countryName.toLowerCase())) return true;
      if (countryCode && m.includes(String(countryCode).toLowerCase())) return true;

      const countryReferencePhrases = [
      'bu ülke',
      'seçilen ülke',
      'seçtiğim ülke',
      'seçtiğiniz ülke',
      'seçtiğimiz ülke',
      'buradaki ülke',
      'this country',
      'selected country',
      'the selected country',
      'this country',
      ];

      for (const phrase of countryReferencePhrases) {
      if (m.includes(phrase)) return true;
      }

      return false;
    };

    const mentionedInTranscript = transcript.some((entry) => isCountryMentioned(entry.content));

    // Run LLM based classifier to determine semantic relevance
    const classifier = await classifyRelevance(client, message, countryName, countryCode, contextBlock);

    // If model says it's not relevant with high confidence, block
    if (!classifier.relevant && classifier.confidence > 0.6 && !mentionedInTranscript) {
      const assistantReply = `Ben IREMWORLD’ün yapay zeka asistanıyım. AI Asistan yalnızca seçilen ülke ile ilgili sorulara yanıt verir. Lütfen ${countryName || 'seçilen ülke'} hakkında soru sorun.`;

      // Log blocked logic
      try {
        fileLogActivity(
          request.headers.get('x-user-id') || 'anonymous',
          request.headers.get('x-user-name') || 'Anonymous',
          request.headers.get('x-user-email') || '',
          'ai_insight_blocked',
          `Classifier blocked: ${message.slice(0, 240)} (reason: ${classifier.reason})`,
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
          request.headers.get('user-agent') || 'Unknown',
          'system',
          undefined,
          'warning',
          { classifier, conversation: transcript.slice(-3) }
        );
      } catch {
        // ignore
      }

      return NextResponse.json({ answer: assistantReply, skipped: true });
    }

    // If classifier is uncertain, use token-based fallback: if already has country mention, allow.
    if (classifier.confidence <= 0.6 && !mentionedInTranscript) {
      // Try embeddings similarity: see if question matches country context
      const contextText = contextBlock || `${countryName || countryCode || ''}`;
      const sim = contextText ? await similarityFallback(client, message, contextText) : 0;

      // confidence rule: if sim high (>=0.28) allow; if low and classifier unsure, block and log
      if (sim < 0.28) {
        const assistantReply = `Ben IREMWORLD’ün yapay zeka asistanıyım. Sorduğunuz soru ${countryName || 'seçilen ülke'} ile ilgili görünmüyor. Lütfen daha spesifik soru sorunuz veya ülkeyi net belirtiniz.`;

        try {
          fileLogActivity(
            request.headers.get('x-user-id') || 'anonymous',
            request.headers.get('x-user-name') || 'Anonymous',
            request.headers.get('x-user-email') || '',
            'ai_insight_blocked',
            `Ambiguous blocked: ${message.slice(0, 240)} (sim=${sim}, classifier=${classifier.confidence})`,
            request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
            request.headers.get('user-agent') || 'Unknown',
            'system',
            undefined,
            'warning',
            { classifier, sim }
          );
        } catch {
          // ignore
        }

        return NextResponse.json({ answer: assistantReply, skipped: true });
      }
    }

    // If we get here, proceed with regular behavior (allowed by classifier or similarity fallback)
    if (classifier.relevant) {
      // also optionally write a log of successful classification for monitoring
      try {
        fileLogActivity(
          request.headers.get('x-user-id') || 'anonymous',
          request.headers.get('x-user-name') || 'Anonymous',
          request.headers.get('x-user-email') || '',
          'ai_insight_allowed',
          `Classifier allowed (debug): ${message.slice(0, 240)} (conf=${classifier.confidence})`,
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
          request.headers.get('user-agent') || 'Unknown',
          'system',
          undefined,
          'success',
          { classifier }
        );
      } catch {
    }
    }

    // Quick cache lookup before calling OpenAI
    try {
      const cacheKey = `${countryCode || countryName || 'ANY'}::${message}`.toLowerCase();
      const cached = ANSWER_CACHE.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return NextResponse.json({ answer: cached.answer, cached: true });
      }
    } catch {
      // ignore cache errors
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    if (contextBlock) {
      messages.push({ role: 'system', content: `Ülke bağlamı:\n${contextBlock}` });
    }

    messages.push(
      ...transcript.map((entry) => ({
        role: entry.role,
        content: entry.content,
      }))
    );

    const MAX_REPLY_TOKENS = 512; // Reduce token limit for faster responses (was 1024)

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.35,
      max_tokens: MAX_REPLY_TOKENS,
    }, {
      timeout: 25000, // 25 second timeout for API call
    });

    const rawContent = completion.choices[0]?.message?.content;
    let assistantReply = extractText(rawContent);

    // Skip continuation for performance - keep responses concise for faster delivery
    // If answer is cut off, user can ask follow-up questions

    // Ensure every assistant output references IREMWORLD's AI assistant.
    // If the model already mentions 'yapay zeka asistan', replace the generic
    // 'Ben ... yapay zeka asistanıyım' with the branded phrase; otherwise prefix it.
    const ensureBrand = (text: string) => {
      const brand = 'Ben IREMWORLD’ün yapay zeka asistanıyım.';
      if (!text) return brand;

      const normalized = (text || '').toLowerCase();

      // already references IREMWORLD -> keep as-is
      if (normalized.includes('iremworld') || normalized.includes('irem')) {
        // If the response already mentions the brand but also has a non-branded
        // 'Ben ... yapay zeka asistanıyım', remove that extra phrase to avoid
        // duplication.
        const assistantMatch = /\bben\b[\s\S]{0,80}?yapay\s+zeka\s+asistan(?:[ıi]yım|ım)?/i;
        if (assistantMatch.test(text)) {
          return text.replace(assistantMatch, '').replace(/\s{2,}/g, ' ').trim();
        }
        return text;
      }

      // If the model already claims to be 'yapay zeka asistanı', replace with brand
      const assistantMatch = /\bben\b[\s\S]{0,80}?yapay\s+zeka\s+asistan(?:[ıi]yım|ım)?/i;
      if (assistantMatch.test(text)) {
        // Replace the first occurrence of that phrase with our brand phrase
        return text.replace(assistantMatch, brand);
      }

      // Otherwise, prefix the brand sentence
      return `${brand} ${text}`;
    };

    const finalReply = ensureBrand(assistantReply);

    if (!finalReply) {
      return NextResponse.json(
        { error: 'Yanıt oluşturulamadı.' },
        { status: 502 }
      );
    }

    // Store in cache (best-effort)
    try {
      const cacheKey = `${countryCode || countryName || 'ANY'}::${message}`.toLowerCase();
      ANSWER_CACHE.set(cacheKey, { answer: finalReply, expiresAt: Date.now() + CACHE_TTL, usage: completion.usage });
    } catch {
      // ignore cache writes
    }

    return NextResponse.json({
      answer: finalReply,
      usage: completion.usage,
    });
  } catch (error) {
    console.error('AI insight error:', error);

    return NextResponse.json(
      { error: 'AI servisi şu anda yanıt veremiyor.' },
      { status: 500 }
    );
  }
}
