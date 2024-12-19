import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="breadcrumb">
      @if (route) {
        <a
          class="breadcrumb-link"
          [ngClass]="{ isLast: isLast }"
          [routerLink]="route"
          >{{ name }}</a
          >
        } @else {
          <div class="breadcrumb-label">{{ name }}</div>
        }
        @if (!isLast) {
          <div class="icon">
            <mat-icon>chevron_right</mat-icon>
          </div>
        }
      </div>
    `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: $spacing-3;
      color: $blue-navy;
      .icon {
        display: flex;
        align-items: center;
      }
      .breadcrumb-link {
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
      .breadcrumb-label {
        text-decoration: none;
        cursor: default;
      }
    }
  `
})
export class BreadcrumbComponent {
  @Input() isLast?: boolean = false;
  @Input() route?: (string | number)[];
  @Input() name? = '';
}
