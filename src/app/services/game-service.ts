// src/app/services/game-service.ts

import { Injectable, signal, effect, DestroyRef, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatus, Message, GAME_LIMITS } from '../models/game.types';

@Injectable({ providedIn: 'root' })
export class GameService {
  private destroyRef = inject(DestroyRef);
  private socket!: Socket;

  // --- SIGNALS ---
  public connectionStatus = signal<ConnectionStatus>('IDLE');
  public messages = signal<Message[]>([]);
  public gameTimer = signal<number>(GAME_LIMITS.TOTAL_TIME_SECONDS);
  public messageCount = signal<number>(0);
  public isGameOver = signal<boolean>(false);
  public searchSeconds = signal<number>(0);
  
  private gameInterval: any;
  private searchInterval: any;

  constructor() {
    this.socket = io('http://localhost:3000'); // Replace with your Node.js URL
    this.setupSocketListeners();

    // watchdog for game-over conditions
    effect(() => {
      if (this.gameTimer() <= 0 || this.messageCount() >= GAME_LIMITS.MAX_MESSAGES) {
        this.endGame();
      }
    });

    this.destroyRef.onDestroy(() => this.cleanup());
  }

  private setupSocketListeners() {
    this.socket.on('match_found', (data: any) => {
      this.connectionStatus.set('MATCHED');
      this.stopSearchTimer();
      this.startGameTimer(); // Start 2-min limit
      this.addSystemMessage('Secure connection established. Start interrogation.');
    });

    this.socket.on('message', (msg: Message) => {
      this.messages.update(prev => [...prev, { ...msg, sender: 'opponent' }]);
      this.incrementMessages();
    });

    this.socket.on('opponent_left', () => {
      this.addSystemMessage('The subject has disconnected.');
      this.endGame();
    });
  }

  // --- GAME ACTIONS ---
  public findMatch() {
    this.connectionStatus.set('SEARCHING');
    this.startSearchTimer();
    this.socket.emit('find_match');
  }

  public sendMessage(text: string) {
    const msg: Message = { text, sender: 'me', timestamp: Date.now() };
    this.messages.update(prev => [...prev, msg]);
    this.socket.emit('send_message', msg);
    this.incrementMessages(); // Track toward 10-message limit
  }

  public leaveGame() {
    this.socket.emit('leave_game');
    this.executeExitCleanup();
  }

  // --- INTERNAL UTILITIES ---
  private startGameTimer() {
    this.gameTimer.set(GAME_LIMITS.TOTAL_TIME_SECONDS);
    this.isGameOver.set(false);
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => {
      this.gameTimer.update(v => v > 0 ? v - 1 : 0);
    }, 1000);
  }

  private incrementMessages() {
    this.messageCount.update(n => n + 1);
  }

  private endGame() {
    clearInterval(this.gameInterval);
    this.isGameOver.set(true);
    this.addSystemMessage('Session terminated. Cast your verdict.');
  }

  private executeExitCleanup() {
    this.connectionStatus.set('IDLE');
    this.messages.set([]);
    this.messageCount.set(0);
    this.isGameOver.set(false);
    clearInterval(this.gameInterval);
    this.stopSearchTimer();
  }

  private startSearchTimer() {
    this.searchSeconds.set(0);
    this.searchInterval = setInterval(() => this.searchSeconds.update(s => s + 1), 1000);
  }

  private stopSearchTimer() {
    clearInterval(this.searchInterval);
  }

  private addSystemMessage(text: string) {
    this.messages.update(prev => [...prev, { text, sender: 'system', timestamp: Date.now() }]);
  }

  private cleanup() {
    clearInterval(this.gameInterval);
    clearInterval(this.searchInterval);
    this.socket.disconnect();
  }
}