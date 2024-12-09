import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  template: ` <ng-content></ng-content> `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    :host {
      display: flex;
      flex-direction: column;
      gap: 0;
      width: 100%;
    }
  `
})
export class EventListComponent {}
