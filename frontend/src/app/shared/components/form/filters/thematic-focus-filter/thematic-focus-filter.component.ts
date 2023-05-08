import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(private translate: TranslateService) {}

  createOptions(): FilterOption[] {
    const excludedFromSorting = ['OTHER'];
    const other = this.mapThematicFoucs(this.getOtherType(ThematicFocus));
    const remaining = this.mapThematicFoucs(
      this.getRemainingTypes(ThematicFocus, excludedFromSorting)
    ).sort((o1, o2) => this.sortAlpha(o1, o2));
    return [...remaining, ...other];
  }

  private mapThematicFoucs(keys: string[]): FilterOption[] {
    return keys.map((activityType) => {
      return {
        key: activityType,
        labelKey: `thematicFocus.${activityType}`,
        checked: this.selected?.includes(activityType)
      };
    });
  }

  private getRemainingTypes(
    type: typeof ThematicFocus,
    excludedTypes: string[]
  ): string[] {
    return Object.keys(type).filter((key) => {
      return !excludedTypes.includes(key);
    });
  }

  private getOtherType(type: typeof ThematicFocus): string[] {
    return Object.keys(type).filter((key) => {
      return key === 'OTHER';
    });
  }

  private sortAlpha(option1: FilterOption, option2: FilterOption): number {
    const opt1: string = this.translate.instant(option1.labelKey) || '';
    const opt2: string = this.translate.instant(option2.labelKey) || '';
    return opt1.localeCompare(opt2);
  }
}
