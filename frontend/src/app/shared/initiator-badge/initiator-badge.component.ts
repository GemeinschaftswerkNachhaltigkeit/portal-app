import { Component, Input } from '@angular/core';
import Organisation from '../models/organisation';

@Component({
  selector: 'app-initiator-badge',
  styles: [
    `
      @use 'theme' as *;
      @use 'palette' as *;

      .initiator-badge {
        display: flex;
        gap: $spacing-2;
        align-items: center;
        color: $orange;
        font-weight: 600;
        .icon {
          display: flex;
          align-items: center;
        }
      }
    `
  ],
  template: `
    <div class="initiator-badge">
      <div class="icon"><app-outlined-icon>verified</app-outlined-icon></div>
      <div class="label">{{ 'labels.initiator' | translate }}</div>
    </div>
  `
})
export class InitiatorBadgeComponent {
  @Input() organisation?: Organisation;
}
