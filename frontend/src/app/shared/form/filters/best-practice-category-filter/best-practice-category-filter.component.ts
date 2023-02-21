import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BestPracticesCategories } from 'src/app/marketplace/models/best-practices-categories';
import FilterOption from 'src/app/shared/models/filter-options';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';

@Component({
  selector: 'app-best-practice-category-filter',
  templateUrl: './best-practice-category-filter.component.html',
  styleUrls: ['./best-practice-category-filter.component.scss']
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
