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
      <a
        *ngIf="route; else label"
        class="breadcrumb-link"
        [ngClass]="{ isLast: isLast }"
        [routerLink]="route"
        >{{ name }}</a
      >
      <ng-template #label>
        <div class="breadcrumb-label">{{ name }}</div>
      </ng-template>
      <div class="icon" *ngIf="!isLast">
        <mat-icon>chevron_right</mat-icon>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
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
