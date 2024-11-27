import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `<div class="no-data" [style]="{ 'border-color': color }">
    <div class="icon-wrapper" *ngIf="showIcon">
      <div class="bg-icon">
        <mat-icon class="material-icons-outlined">{{ bgIcon }}</mat-icon>
      </div>

      <div class="fg-icon" [style]="{ color: color }">
        <mat-icon class="material-icons-outlined">{{ fgIcon }}</mat-icon>
      </div>
    </div>
    <div class="msg">
      <h3 class="title">{{ title }}</h3>
      <p class="text"><ng-content></ng-content></p>
    </div>
  </div> `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    .no-data {
      padding: $spacing-6 $spacing-4;
      background: white;
      width: 100%;
      border-left: $spacing-4 solid $magenta;
      border-top: 2px solid $magenta;
      border-bottom: 2px solid $magenta;
      border-right: 2px solid $magenta;
      color: $blue-navy;
      display: flex;
      gap: $spacing-4;
      flex-direction: column;

      .msg {
        .title {
          font-weight: bold;
        }
      }

      .icon-wrapper {
        position: relative;
        width: 7.2rem;
        height: 7.2rem;
        flex-shrink: 0;
        .bg-icon {
          position: absolute;
          left: 2.4rem;
          top: 2.4rem;
          z-index: 1;
          mat-icon {
            opacity: 0.1;
            transform: scaleY(3) scaleX(-3);
          }
        }
        .fg-icon {
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: 2;
          mat-icon {
            transform: scale(2);
          }
        }
      }
    }

    @media screen and (min-width: $breakpoint-xs) {
      .no-data {
        flex-direction: row;
      }
    }
  `
})
export class AlertComponent {
  @Input() title = '';
  @Input() showIcon = false;
  @Input() bgIcon = '';
  @Input() fgIcon = '';
  @Input() color = '#dd1367';
}
