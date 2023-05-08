import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivityType } from 'src/app/shared/models/activity-type';
import FilterOption from 'src/app/shared/models/filter-options';
import { OrganisationType } from 'src/app/shared/models/organisation-type';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';

@Component({
  selector: 'app-acti-types-filter',
  templateUrl: './acti-types-filter.component.html',
  styleUrls: ['./acti-types-filter.component.scss']
})
export class ActiTypesFilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() selected: string[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();
  filterName = SecondaryFilters.ACTIVITY_TYPES;

  constructor(private translate: TranslateService) {}

  createOptions(): FilterOption[] {
    const excludedFromSorting = ['OTHER'];
    const other = this.mapActivityType(this.getOtherType(ActivityType));
    const remaining = this.mapActivityType(
      this.getRemainingTypes(ActivityType, excludedFromSorting)
    ).sort((o1, o2) => this.sortAlpha(o1, o2));

    return [...remaining, ...other];
  }

  private mapActivityType(keys: string[]): FilterOption[] {
    return keys.map((activityType) => {
      return {
        key: activityType,
        labelKey: `activityType.${activityType}`,
        checked: this.selected?.includes(activityType)
      };
    });
  }

  private getRemainingTypes(
    type: typeof OrganisationType | typeof ActivityType,
    excludedTypes: string[]
  ): string[] {
    return Object.keys(type).filter((key) => {
      return !excludedTypes.includes(key);
    });
  }

  private getOtherType(
    type: typeof OrganisationType | typeof ActivityType
  ): string[] {
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
