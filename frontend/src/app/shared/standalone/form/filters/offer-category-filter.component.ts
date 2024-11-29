import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OfferCategories } from 'src/app/marketplace/models/offer-categories';
import FilterOption from 'src/app/shared/models/filter-options';
import { SecondaryFilters } from './secondary-filters.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CollapsibleFilterComponent } from './collapsible-filter.component';

@Component({
  selector: 'app-offer-category-filter',
  standalone: true,
  imports: [CommonModule, TranslateModule, CollapsibleFilterComponent],
  template: `
    <app-collapsible-filter
      [filterName]="filterName"
      [selected]="selected"
      [options]="createOptions()"
      (filterChanged)="filterChanged.emit($event)"
      >{{ 'labels.offers' | translate }}
    </app-collapsible-filter>
  `
})
export class OfferCategoryFilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() selected: string[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();
  filterName = SecondaryFilters.OFFER_CATS;

  createOptions(): FilterOption[] {
    return Object.keys(OfferCategories).map((cat) => {
      return {
        key: cat,
        labelKey: `marketplace.labels.${cat}`,
        checked: this.selected?.includes(cat)
      };
    });
  }
}
