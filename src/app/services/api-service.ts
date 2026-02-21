import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API_URL = 'https://humanvsbot-middleware.onrender.com'; // Update with your actual backend URL

  /** Submit the final guess to the backend */
  async submitGuess(roomId: string | null, choice: 'AI' | 'Human') {
    const response = await fetch(`${this.API_URL}/api/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roomId, guess: choice })
    });

    if (!response.ok) {
      throw new Error('Failed to submit guess');
    }
console.log("Received response from /api/guess:", response);
    return await response.json();

  }

  /** Generate a professional avatar URL using DiceBear */
  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}&backgroundColor=b6e3f4`;
  }
}