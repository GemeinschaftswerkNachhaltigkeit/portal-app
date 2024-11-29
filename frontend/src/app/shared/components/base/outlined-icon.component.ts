import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-outlined-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <mat-icon class="material-icons-outlined"
      ><ng-content></ng-content
    ></mat-icon>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.4rem;
      height: 2.4rem;
    }
  `
})
export class OutlinedIconComponent {}
