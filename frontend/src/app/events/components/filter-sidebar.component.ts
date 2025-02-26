import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule],
  template: `
    <header class="filter-header">
      <button
        class="tab-button"
        [ngClass]="{ active: !permanent }"
        (click)="handleTabChange(false)"
      >
        {{ 'labels.upcoming' | translate }}
      </button>
      <button
        class="tab-button"
        [ngClass]="{ active: permanent }"
        (click)="handleTabChange(true)"
      >
        {{ 'labels.permanent' | translate }}
      </button>
    </header>

    <div>
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .filter-header {
      display: flex;
      width: 100%;
      margin-bottom: $spacing-4;

      .tab-button {
        flex-grow: 1;
        background-color: transparent;
        border: none;
        color: $blue-navy;
        padding: $spacing-2;
        border-bottom: 2px solid $gray-light;
        cursor: pointer;
        &.active {
          border-bottom: 2px solid $magenta;
          font-weight: bold;
        }
      }
    }
  `
})
export class FilterSidebarComponent {
  @Input() permanent = false;
  @Output() permanentChanged = new EventEmitter<boolean>();

  handleTabChange(permanent: boolean): void {
    this.permanentChanged.emit(permanent);
  }
}
