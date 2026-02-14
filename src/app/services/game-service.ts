import { effect, EventEmitter, Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  text: string;
  sender: 'me' | 'opponent' | 'system';
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: Socket;
  private readonly API_URL = 'http://localhost:3000';

  private searchInterval: any; // To store the timer ID
  public myAvatarUrl = signal<string>('');
  public opponentAvatarUrl = signal<string>('');
  public searchSeconds = signal<number>(0);

 public gameTimer = signal<number>(120); // 120 seconds = 2 mins
  public messageCount = signal<number>(0);
  public isGameOver = signal<boolean>(false);

  private gameInterval: any;
  public onMatchFound = new EventEmitter<void>();

  public connectionStatus = signal<'DISCONNECTED' | 'SEARCHING' | 'MATCHED'>('DISCONNECTED');
  public messages = signal<ChatMessage[]>([]);
  public roomId = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.gameTimer() <= 0 || this.messageCount() >= 10) {
        this.endGame();
      }
    });
    this.socket = io(this.API_URL, { autoConnect: true });
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => console.log('Connected'));

    this.socket.on('match_found', (data) => {
      this.stopSearchTimer(); // <--- STOP TIMER
      this.roomId.set(data.roomId);
      this.connectionStatus.set('MATCHED');
      const mySeed = Math.random().toString(36).substring(7);
      const oppSeed = Math.random().toString(36).substring(7);
      this.myAvatarUrl.set(this.generateAvatar(mySeed));
      this.opponentAvatarUrl.set(this.generateAvatar(oppSeed));
      this.addSystemMessage('Match found! Say hello.');
      setTimeout(() => this.onMatchFound.emit(), 100);
    });

    this.socket.on('new_message', (msg: any) => {
      if (msg.sender !== 'me') this.addMessage(msg.text, 'opponent');
    });

    this.socket.on('disconnect', () => {
      this.stopSearchTimer(); // <--- SAFETY STOP
      this.connectionStatus.set('DISCONNECTED');
    });
  }

  // --- ACTIONS ---

  public findMatch() {
    this.connectionStatus.set('SEARCHING');
    this.messages.set([]);
    this.socket.emit('find_match');
    this.startSearchTimer(); // <--- START TIMER
  }

  public sendMessage(text: string) {
    if (!text.trim()) return;
    const currentRoom = this.roomId();
    if (currentRoom) {
      this.socket.emit('send_message', { roomId: currentRoom, text, sender: 'me' });
      this.addMessage(text, 'me');
    }
  }

  public startGameTimer() {
    this.gameTimer.set(120);
    this.messageCount.set(0);
    this.isGameOver.set(false);
    
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => {
      this.gameTimer.update(v => v > 0 ? v - 1 : 0);
    }, 1000);
  }

  // Update this in your existing sendMessage/receiveMessage logic
  public incrementMessages() {
    this.messageCount.update(n => n + 1);
  }
  public cancelSearch() {
    this.stopSearchTimer(); // Stop the local countdown
    this.connectionStatus.set('DISCONNECTED'); // Reset UI to lobby
    this.socket.emit('cancel_search'); // Tell server to forget us
  }
  private endGame() {
    clearInterval(this.gameInterval);
    this.isGameOver.set(true);
    // You can trigger a "Show Results" screen here
  }

  public leaveGame() {
    const currentRoom = this.roomId();
    if (currentRoom) {
      this.socket.emit('leave_game', currentRoom);
    }

    // Reset everything to go back to "Home" (Lobby)
    this.roomId.set(null);
    this.messages.set([]);
    this.connectionStatus.set('DISCONNECTED'); // This switches the UI back to the Lobby
  }

  // --- TIMER LOGIC ---

  private startSearchTimer() {
    this.searchSeconds.set(10); // Start at 10
    clearInterval(this.searchInterval);

    this.searchInterval = setInterval(() => {
      this.searchSeconds.update(v => {
        if (v <= 0) {
          clearInterval(this.searchInterval);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  private stopSearchTimer() {
    clearInterval(this.searchInterval);
    this.searchSeconds.set(0);
  }


  // --- HELPERS ---
  private addMessage(text: string, sender: 'me' | 'opponent') {
    this.messages.update(c => [...c, { text, sender, timestamp: Date.now() }]);
  }

  private addSystemMessage(text: string) {
    this.messages.update(c => [...c, { text, sender: 'system', timestamp: Date.now() }]);
  }

  private generateAvatar(seed: string): string {
    const randomEntropy = Math.random().toString(36).substring(7) + Date.now();
    const finalSeed = `${seed}-${randomEntropy}`;
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${finalSeed}&backgroundColor=transparent`;
  }
}