import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game-service';
import { Instruction } from '../instruction/instruction';
import { Game } from '../game/game';
import { 
  MatDialog, 
  MatDialogModule, 
  MatDialogRef, 
  MatDialogTitle, 
  MatDialogContent, 
  MatDialogActions, 
  MatDialogClose 
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chat',
  standalone: true,
  // We add DialogConfirmLobby to the imports of Chat so it can be used by MatDialog
  imports: [
    CommonModule, 
    FormsModule, 
    Instruction, 
    Game, 
    MatDialogModule, 
    MatButtonModule,
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  public gameService = inject(GameService);
  private dialog = inject(MatDialog);
  
  public showHowToPlay = signal<boolean>(false);

  toggleHowToPlay(value: boolean) {
    this.showHowToPlay.set(value);
  }

  handleLeaveAction() {
    if (this.gameService.connectionStatus() === 'MATCHED') {
      const dialogRef = this.dialog.open(DialogConfirmLobby, {
        width: '320px',
        panelClass: 'cyber-dialog' // Custom class for styling
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.executeExit();
        }
      });
    } else {
      this.executeExit();
    }
  }

  private executeExit() {
    this.gameService.leaveGame();
    this.showHowToPlay.set(false);
  }
}

/**
 * Helper Dialog Component
 * Defined in the same file for tight encapsulation
 */
@Component({
  selector: 'dialog-confirm-lobby',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './dialog-confirm-lobby.html',
})
export class DialogConfirmLobby {
  // Inject the dialog reference to control manual closing if needed
  readonly dialogRef = inject(MatDialogRef<DialogConfirmLobby>);
}