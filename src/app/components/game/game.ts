import { Component, effect, ElementRef, inject, ViewChild, signal, AfterViewInit } from '@angular/core';
import { GameService } from '../../services/game-service';
import { ApiService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements AfterViewInit {
  public gameService = inject(GameService);
  private apiService = inject(ApiService);
  
  messageInput = '';
  isRevealing = signal(false);
  gameResult = signal<any>(null);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      if (this.gameService.messages().length > 0) {
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });
  }

  ngAfterViewInit() {
    this.gameService.onMatchFound.subscribe(() => this.focusInput());
    this.focusInput();
  }

  handleSendMessage() {
    if (!this.messageInput.trim()) return;
    this.gameService.sendMessage(this.messageInput);
    this.messageInput = '';
  }

  async selectIdentity(choice: 'AI' | 'Human') {
    this.isRevealing.set(true);
    try {
      const result = await this.apiService.submitGuess(this.gameService.roomId(), choice);
      this.gameResult.set(result);
    } catch (err) {
      console.error('Error revealing identity:', err);
    } finally {
      this.isRevealing.set(false);
    }
  }

  private focusInput() {
    this.chatInput?.nativeElement.focus();
  }

  private scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch {}
  }
}