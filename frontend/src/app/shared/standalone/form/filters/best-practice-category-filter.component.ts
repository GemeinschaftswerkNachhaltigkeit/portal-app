import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BestPracticesCategories } from 'src/app/marketplace/models/best-practices-categories';
import FilterOption from 'src/app/shared/models/filter-options';
import { SecondaryFilters } from './secondary-filters.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CollapsibleFilterComponent } from './collapsible-filter.component';

@Component({
  selector: 'app-best-practice-category-filter',
  standalone: true,
  imports: [CommonModule, TranslateModule, CollapsibleFilterComponent],
  template: `
    <app-collapsible-filter
      [filterName]="filterName"
      [selected]="selected"
      [options]="createOptions()"
      (filterChanged)="filterChanged.emit($event)"
      >{{ 'labels.bestPracitces' | translate }}
    </app-collapsible-filter>
  `
})
export class BestPracticeCategoryFilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() selected: string[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();
  filterName = SecondaryFilters.BEST_PRACTICE_CATS;

  createOptions(): FilterOption[] {
    return Object.keys(BestPracticesCategories).map((cat) => {
      return {
        key: cat,
        labelKey: `marketplace.labels.${cat}`,
        checked: this.selected?.includes(cat)
      };
    });
  }
}
