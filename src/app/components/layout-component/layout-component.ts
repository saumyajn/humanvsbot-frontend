import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game-service';
import { DialogConfirmLobby } from '../home/home';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-component',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.scss',
})
export class LayoutComponent {
  public gameService = inject(GameService);
  private dialog = inject(MatDialog);

  constructor(private route: Router) { }
  handleLeaveAction() {
    if (this.gameService.connectionStatus() === 'MATCHED') {
      const dialogRef = this.dialog.open(DialogConfirmLobby);
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.gameService.leaveGame();
          this.route.navigate(['/']);
        }
      });
    } else {
      this.gameService.leaveGame();
      this.route.navigate(['/']);
    }
  }
}
