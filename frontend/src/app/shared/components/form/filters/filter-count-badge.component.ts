import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-count-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      class="badge"
      (click)="deleteHandler($event)"
      [ngClass]="{ active: active }"
    >
      <div class="number"><ng-content></ng-content></div>
      <div class="clear">
        <mat-icon>close</mat-icon>
      </div>
    </div>
  `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    .badge {
      height: $spacing-8;
      min-width: $spacing-8;
      border-radius: $spacing-8;
      background-color: $gray-light;
      color: $gray;
      display: flex;
      flex-grow: 0;
      align-items: center;
      justify-content: center;
      padding: 0 $spacing-1;
      cursor: pointer;

      &.active {
        background-color: $magenta;
        color: white;
      }

      .number {
        display: block;
      }

      .clear {
        display: none;
      }

      &:hover {
        .number {
          display: none;
        }

        .clear {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  `
})
export class FilterCountBadgeComponent {
  @Input() active? = false;
  @Output() clicked = new EventEmitter();

  deleteHandler(event: MouseEvent): void {
    event?.stopPropagation();
    this.clicked.emit();
  }
}
