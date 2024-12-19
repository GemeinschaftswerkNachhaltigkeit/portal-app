import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivityType } from 'src/app/shared/models/activity-type';
import FilterOption from 'src/app/shared/models/filter-options';
import { OrganisationType } from 'src/app/shared/models/organisation-type';
import { SecondaryFilters } from './secondary-filters.component';

import { CollapsibleFilterComponent } from './collapsible-filter.component';

@Component({
  selector: 'app-orga-types-filter',
  standalone: true,
  imports: [TranslateModule, CollapsibleFilterComponent],
  template: `
    <app-collapsible-filter
      [filterName]="filterName"
      [selected]="selected"
      [options]="createOptions()"
      (filterChanged)="filterChanged.emit($event)"
      >{{ 'labels.orgaTypes' | translate }}</app-collapsible-filter
    >
  `
})
export class OrgaTypesFilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() selected: string[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();
  filterName = SecondaryFilters.ORGA_TYPES;

  constructor(private translate: TranslateService) {}

  createOptions(): FilterOption[] {
    const excludedFromSorting = ['FEDERAL', 'STATE', 'MUNICIPALITY', 'OTHER'];
    const first = this.mapOrgaType(this.getFirstOrgaTypes());
    const other = this.mapOrgaType(this.getOtherType(OrganisationType));

    const remaining = this.mapOrgaType(
      this.getRemainingTypes(OrganisationType, excludedFromSorting)
    ).sort((o1, o2) => this.sortAlpha(o1, o2));
    return [...first, ...remaining, ...other];
  }

  private mapOrgaType(keys: string[]): FilterOption[] {
    return keys.map((orgaType) => {
      return {
        key: orgaType,
        labelKey: `organisationType.${orgaType}`,
        checked: this.selected?.includes(orgaType)
      };
    });
  }

  private getFirstOrgaTypes(): string[] {
    return Object.keys(OrganisationType).filter((key) => {
      return ['FEDERAL', 'STATE', 'MUNICIPALITY'].includes(key);
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
