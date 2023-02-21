import { Component, EventEmitter, Input, Output } from '@angular/core';
import FilterOption from 'src/app/shared/models/filter-options';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';

@Component({
  selector: 'app-thematic-focus-filter',
  templateUrl: './thematic-focus-filter.component.html',
  styleUrls: ['./thematic-focus-filter.component.scss']
})
export class ThematicFocusFilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() selected: string[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();
  filterName = SecondaryFilters.THEMATIC_FOCUS;

  createOptions(): FilterOption[] {
    return Object.keys(ThematicFocus).map((thematicFocus) => {
      return {
        key: thematicFocus,
        labelKey: `thematicFocus.${thematicFocus}`,
        checked: this.selected.includes(thematicFocus)
      };
    });
  }
}
