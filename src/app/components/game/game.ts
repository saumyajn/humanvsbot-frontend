import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { GameService } from '../../services/game-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  imports: [CommonModule, FormsModule],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {
  gameService = inject(GameService);
  messageInput = '';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;
  constructor() {
    // Effect runs whenever signals change. Good for side effects like scrolling.
    effect(() => {
      const msgs = this.gameService.messages();
      if (msgs.length > 0) {
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });
  }
  ngAfterViewInit() {
    // Listen for the match event to focus
    this.gameService.onMatchFound.subscribe(() => {
      this.focusInput();
    });

    this.focusInput();
  }
  private focusInput() {
    if (this.chatInput) {
      this.chatInput.nativeElement.focus();
      // On some mobile devices, we need to click it programmatically
      this.chatInput.nativeElement.click();
    }
  }



  handleSendMessage() {
    if (!this.messageInput.trim()) return;

    this.gameService.sendMessage(this.messageInput);
    this.messageInput = ''; // Clear input
  }


  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
