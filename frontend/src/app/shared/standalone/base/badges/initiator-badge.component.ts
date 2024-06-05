import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

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
        font-size: 1.2rem;
        .icon {
          display: flex;
          align-items: center;
        }
        .label {
          color: $blue-navy;
        }
      }
    `
  ],
  template: `
    <div class="initiator-badge">
      <div class="icon"><app-outlined-icon>verified</app-outlined-icon></div>
      <div class="label">{{ 'labels.initiator' | translate }}</div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule]
})
export class InitiatorBadgeComponent {}
