import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game-service';
import { Instruction } from '../instruction/instruction';
import { Game } from '../game/game';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Instruction, MatDialogModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  public gameService = inject(GameService);
  public showHowToPlay = signal<boolean>(false);


  constructor(private router: Router) {
     effect(() => {
      if (this.gameService.connectionStatus() === 'MATCHED') {
        this.router.navigate(['/humanvsbot']);
      }
    });
   }
 
  toggleHowToPlay(value: boolean) {
    if (!value) {
      this.router.navigate(['/']);
    }
    this.showHowToPlay.set(value);
  }
  navigateToHowToPlay() {
    this.router.navigate(['/how-to-play']);
  }
}

@Component({
  selector: 'dialog-confirm-lobby',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './dialog-confirm-lobby.html',
})
export class DialogConfirmLobby {
  readonly dialogRef = inject(MatDialogRef<DialogConfirmLobby>);
}