import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OfferCategories } from 'src/app/marketplace/models/offer-categories';
import FilterOption from 'src/app/shared/models/filter-options';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';

@Component({
  selector: 'app-offer-category-filter',
  templateUrl: './offer-category-filter.component.html',
  styleUrls: ['./offer-category-filter.component.scss']
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
