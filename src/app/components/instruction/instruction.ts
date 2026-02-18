import { Component, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instruction',
  imports: [],
  templateUrl: './instruction.html',
  styleUrl: './instruction.scss',
})
export class Instruction {
  constructor(private router: Router) { }

  close() {
    this.router.navigate(['/']); // Navigate back to home
  }
}
