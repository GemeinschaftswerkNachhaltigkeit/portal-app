import { Component } from '@angular/core';

@Component({
  selector: 'app-tab-buttons',
  styles: [
    `
      @use 'palette' as *;
      @use 'theme' as *;

      .tab-buttons {
        display: flex;
        flex-direction: column;
        gap: $spacing-6;
        margin-left: -$spacing-2;
        padding: $spacing-6 0;
      }

      @media screen and (min-width: $breakpoint-xs) {
        .tab-buttons {
          flex-direction: row;
        }
      }
    `
  ],
  template: `
    <div class="tab-buttons">
      <ng-content></ng-content>
    </div>
  `
})
export class TabButtonsComponent {}
