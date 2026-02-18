import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000';

  /** Submit the final guess to the backend */
  async submitGuess(roomId: string | null, choice: 'AI' | 'Human') {
    return firstValueFrom(
      this.http.post<any>(`${this.API_URL}/game/guess`, { roomId, guess: choice })
    );
  }

  /** Generate a professional avatar URL using DiceBear */
  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}&backgroundColor=b6e3f4`;
  }
}