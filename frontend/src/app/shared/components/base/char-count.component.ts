import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-char-count',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `<div class="char-count" [ngClass]="{ invalid: count > total }">
    <div class="icon-wrapper">
      <mat-icon *ngIf="count > total">priority_hight</mat-icon>
    </div>
    <div class="wrapper">
      <div class="count">{{ count }}</div>
      <div class="sep"></div>
      <div class="total">{{ total }}</div>
    </div>
  </div> `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    .char-count {
      display: flex;
      align-items: center;
      height: 2rem;
      .icon-wrapper {
        transform: scale(0.6);
        display: flex;
        align-items: center;
        justify-items: center;
      }

      .wrapper {
        display: flex;
        gap: 1rem;
        font-size: 1rem;
        height: 100%;
        font-weight: bold;
        align-items: center;
        .sep {
          width: 2px;
          height: 70%;
          transform: rotate(10deg);
          color: $blue-navy;
          background-color: $blue-navy;
        }
      }

      &.invalid {
        .icon-wrapper {
          color: $bordeauxe;
        }
        .wrapper {
          color: $bordeauxe;
          .sep {
            background-color: $bordeauxe;
          }
        }
      }
    }
  `
})
export class CharCountComponent {
  @Input() count = 0;
  @Input() total = 0;
}
