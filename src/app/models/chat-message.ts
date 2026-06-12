export type ChatMessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM' | 'user' | 'assistant';

export interface ChatMessage {
  id?: string;
  role: ChatMessageRole;
  content: string;
  createdAt?: string;
}
