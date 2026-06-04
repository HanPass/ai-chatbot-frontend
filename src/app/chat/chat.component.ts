import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ChatMessage } from '../models/chat-message';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  messages: ChatMessage[] = [];
  message = '';
  loading = false;
  error: string | null = null;

  constructor(private readonly chatService: ChatService) {
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

    this.chatService.ask(trimmedMessage)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.messages = [...this.messages, { role: 'assistant', content: response.answer }];
        },
        error: () => {
          this.error = 'Le backend ou le service IA est indisponible. Veuillez réessayer.';
        }
      });
  }
}
