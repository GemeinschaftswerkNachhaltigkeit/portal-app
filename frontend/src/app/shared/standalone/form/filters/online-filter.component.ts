import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { SecondaryFilters } from './secondary-filters.component';
import {
  MatSlideToggleChange,
  MatSlideToggleModule
} from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-online-filter',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatSlideToggleModule],
  template: `
    <div class="slide-toggle">
      <div>{{ 'labels.onlyOnline' | translate }}</div>
      <mat-slide-toggle
        color="primary"
        [checked]="selected"
        (change)="onlineHandler($event)"
      >
      </mat-slide-toggle>
    </div>
  `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    .slide-toggle {
      padding: 0 $spacing-6;
      height: $spacing-12;
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    @media screen and (min-width: $breakpoint-md) {
      .slide-toggle {
        padding: 0;
        font-weight: bold;
      }
    }
  `
})
export class OnlineFilterComponent {
  @Input() selected? = false;
  @Output() filterChanged = new EventEmitter<boolean>();
  filterName = SecondaryFilters.ONLINE;

  constructor(private filtersService: SecondaryFitlersService) {}

  isOpen(): boolean {
    return this.filtersService.filterOpen(this.filterName);
  }

  clear(): void {
    this.filterChanged.emit(false);
  }
  activeFilters(): number {
    return this.selected ? 1 : 0;
  }

  onlineHandler(event: MatSlideToggleChange) {
    this.filterChanged.emit(event.checked);
  }
}
