import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRequest } from '../models/chat-request';
import { ChatResponse } from '../models/chat-response';
import { ChatMessage } from '../models/chat-message';
import { ConversationSummary } from '../models/conversation-summary';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiBaseUrl = 'https://ai-chatbot-backend-nwim.onrender.com/api';

  constructor(private readonly http: HttpClient) {
  }

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiBaseUrl}/chat`, request);
  }

  getConversations(): Observable<ConversationSummary[]> {
    return this.http.get<ConversationSummary[]>(`${this.apiBaseUrl}/conversations`);
  }

  getMessages(conversationId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiBaseUrl}/conversations/${conversationId}/messages`);
  }

  deleteConversation(conversationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/conversations/${conversationId}`);
  }
}
