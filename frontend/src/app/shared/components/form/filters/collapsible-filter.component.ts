import { Component, EventEmitter, Input, Output } from '@angular/core';
import FilterOption from 'src/app/shared/models/filter-options';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { SecondaryFilters } from './secondary-filters.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { FilterCountBadgeComponent } from './filter-count-badge.component';
import { CheckboxFilterComponent } from './checkbox-filter.component';

@Component({
  selector: 'app-collapsible-filter',
  standalone: true,
  imports: [
    MatExpansionModule,
    FilterCountBadgeComponent,
    CheckboxFilterComponent
],
  template: `
    <mat-expansion-panel
      class="filter mat-elevation-z0"
      [expanded]="filterOpen()"
    >
      <mat-expansion-panel-header>
        <mat-panel-title> <ng-content></ng-content> </mat-panel-title>
        <mat-panel-description>
          <app-filter-count-badge
            [active]="!!selected.length"
            (clicked)="clear()"
            >{{ selected.length }}</app-filter-count-badge
          >
        </mat-panel-description>
      </mat-expansion-panel-header>

      <app-checkbox-filter
        [options]="options"
        (valueChanged)="handleChange($event)"
      ></app-checkbox-filter>
    </mat-expansion-panel>
  `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    .mat-expansion-panel-header-title,
    .mat-expansion-panel-header-description {
      color: $blue-navy;
      flex-basis: 0;
    }
    .mat-expansion-panel-header-description {
      justify-content: flex-end;
      align-items: center;
      width: 3.2rem;
      flex-grow: 0;
    }

    .filter {
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
    .check {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hidden {
      height: 0;
      opacity: 0;
    }
  `
})
export class CollapsibleFilterComponent {
  @Input() filterName!: SecondaryFilters;
  @Input() options: FilterOption[] = [];
  @Input() selected: string[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();

  constructor(private filterService: SecondaryFitlersService) {}

  clear(): void {
    this.handleChange([]);
  }

  handleChange(values: FilterOption[]): void {
    this.filterChanged.emit(values.map((v) => v.key));
  }

  filterOpen(): boolean {
    return this.filterService.filterOpen(this.filterName);
  }
}
