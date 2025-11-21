export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AiSession {
  id: string;
  userId: string;
  title: string;
  messages: AiMessage[];
  createdAt: string;
  updatedAt: string;
}
