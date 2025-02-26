import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterCountBadgeComponent } from './filter-count-badge.component';
import { MatButtonModule } from '@angular/material/button';
import { OutlinedIconComponent } from '../../base/outlined-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-modal-button',
  standalone: true,
  imports: [
    FilterCountBadgeComponent,
    MatButtonModule,
    OutlinedIconComponent,
    TranslateModule
  ],
  template: `
    <div class="filter-btn-wrapper">
      <button mat-button (click)="openFilters()">
        <div class="label">
          <app-outlined-icon>tune</app-outlined-icon>
          <span class="filter-btn-text">{{ 'btn.filters' | translate }}</span>
        </div>
      </button>
      @if (count) {
        <app-filter-count-badge [active]="true" (clicked)="clearAll()">{{
          count
        }}</app-filter-count-badge>
      }
    </div>
  `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    .filter-btn-wrapper {
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;
      .label {
        display: flex;
        align-items: center;
        .filter-btn-text {
          margin-left: $spacing-2;
        }
      }
    }

    @media screen and (min-width: 760px) {
      .filter-btn-wrapper {
        margin-left: 0;
      }
    }
  `
})
export class FilterModalButtonComponent {
  @Input() count!: number;
  @Output() clear = new EventEmitter<void>();
  @Output() openModal = new EventEmitter<void>();

  clearAll(): void {
    this.clear.emit();
  }

  openFilters(): void {
    this.openModal.emit();
  }
}
