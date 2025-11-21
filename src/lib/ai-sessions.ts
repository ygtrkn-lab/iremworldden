import fs from 'fs';
import path from 'path';
import { AiSession } from '@/types/ai';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const SESSIONS_DATA_PATH = path.join(DATA_DIR, 'ai_sessions.json');

export function readAiSessions(): AiSession[] {
  try {
    const raw = fs.readFileSync(SESSIONS_DATA_PATH, 'utf8');
    return JSON.parse(raw) as AiSession[];
  } catch (error) {
    console.error('readAiSessions error', error);
    return [];
  }
}

export function writeAiSessions(sessions: AiSession[]) {
  try {
    fs.writeFileSync(SESSIONS_DATA_PATH, JSON.stringify(sessions, null, 2), 'utf8');
  } catch (error) {
    console.error('writeAiSessions error', error);
  }
}

export function getSessionsForUser(userId: string) {
  const sessions = readAiSessions();
  return sessions.filter(s => s.userId === userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getSessionById(sessionId: string) {
  const sessions = readAiSessions();
  return sessions.find(s => s.id === sessionId) || null;
}

export function upsertSession(session: Partial<AiSession> & { userId?: string }) {
  const sessions = readAiSessions();
  if (!session.id) {
    // new
    const newSession: AiSession = {
      id: `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      userId: session.userId || 'anonymous',
      title: session.title || 'Yeni Sohbet',
      messages: session.messages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessions.push(newSession);
    writeAiSessions(sessions);
    return newSession;
  }

  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx === -1) {
    const newSession: AiSession = {
      id: session.id!,
      userId: session.userId || 'anonymous',
      title: session.title || 'Yeni Sohbet',
      messages: session.messages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessions.push(newSession);
    writeAiSessions(sessions);
    return newSession;
  }

  const prev = sessions[idx];
  const updated: AiSession = {
    ...prev,
    title: session.title ?? prev.title,
    messages: session.messages ?? prev.messages,
    updatedAt: new Date().toISOString(),
  };
  sessions[idx] = updated;
  writeAiSessions(sessions);
  return updated;
}
