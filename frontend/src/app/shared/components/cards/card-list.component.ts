import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="list">
    <ng-content></ng-content>
  </div> `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .list {
      display: grid;
      gap: $spacing-4;
    }
  `
})
export class CardListComponent {}
