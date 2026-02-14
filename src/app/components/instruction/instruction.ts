import { Component, output } from '@angular/core';

@Component({
  selector: 'app-instruction',
  imports: [],
  templateUrl: './instruction.html',
  styleUrl: './instruction.scss',
})
export class Instruction {
  close = output<void>();
}
