import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ChatMessage } from '../models/chat-message';
import { ConversationSummary } from '../models/conversation-summary';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  conversations: ConversationSummary[] = [];
  currentConversationId?: string;
  message = '';
  loading = false;
  conversationsLoading = false;
  error: string | null = null;

  constructor(private readonly chatService: ChatService) {
  }

  ngOnInit(): void {
    this.loadConversations();
  }

  send(): void {
    const trimmedMessage = this.message.trim();
    if (!trimmedMessage || this.loading) {
      return;
    }

    this.messages = [...this.messages, { role: 'user', content: trimmedMessage }];
    this.message = '';
    this.error = null;
    this.loading = true;

    this.chatService.sendMessage({
      conversationId: this.currentConversationId,
      message: trimmedMessage
    })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.currentConversationId = response.conversationId;
          this.messages = [...this.messages, { role: 'assistant', content: response.answer }];
          this.loadConversations();
        },
        error: () => {
          this.error = 'Le backend ou le service IA est indisponible. Veuillez réessayer.';
        }
      });
  }

  startNewConversation(): void {
    this.currentConversationId = undefined;
    this.messages = [];
    this.message = '';
    this.error = null;
  }

  selectConversation(conversation: ConversationSummary): void {
    if (this.loading) {
      return;
    }

    this.currentConversationId = conversation.id;
    this.error = null;
    this.chatService.getMessages(conversation.id).subscribe({
      next: (messages) => {
        this.messages = messages.filter((chatMessage) => chatMessage.role !== 'SYSTEM');
      },
      error: () => {
        this.error = 'Impossible de charger les messages de cette conversation.';
      }
    });
  }

  deleteConversation(conversation: ConversationSummary, event: MouseEvent): void {
    event.stopPropagation();
    if (this.loading) {
      return;
    }

    this.chatService.deleteConversation(conversation.id).subscribe({
      next: () => {
        if (this.currentConversationId === conversation.id) {
          this.startNewConversation();
        }
        this.loadConversations();
      },
      error: () => {
        this.error = 'Impossible de supprimer cette conversation.';
      }
    });
  }

  messageClass(chatMessage: ChatMessage): string {
    return chatMessage.role === 'USER' || chatMessage.role === 'user' ? 'user' : 'assistant';
  }

  private loadConversations(): void {
    this.conversationsLoading = true;
    this.chatService.getConversations()
      .pipe(finalize(() => this.conversationsLoading = false))
      .subscribe({
        next: (conversations) => {
          this.conversations = conversations;
        },
        error: () => {
          this.error = 'Impossible de charger les conversations.';
        }
      });
  }
}
