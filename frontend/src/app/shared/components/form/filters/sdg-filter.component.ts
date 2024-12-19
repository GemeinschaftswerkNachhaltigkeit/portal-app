import { Component, EventEmitter, Input, Output } from '@angular/core';
import FilterOption from 'src/app/shared/models/filter-options';
import { SdgsService } from 'src/app/shared/services/sdgs.service';
import { SecondaryFilters } from './secondary-filters.component';

import { TranslateModule } from '@ngx-translate/core';
import { CollapsibleFilterComponent } from './collapsible-filter.component';

@Component({
  selector: 'app-sdg-filter',
  standalone: true,
  imports: [TranslateModule, CollapsibleFilterComponent],
  template: `
    <app-collapsible-filter
      [filterName]="filterName"
      [selected]="selected"
      [options]="createOptions()"
      (filterChanged)="filterChanged.emit($event)"
      >{{ 'labels.sdgs' | translate }}</app-collapsible-filter
    >
  `
})
export class SdgFilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() selected: string[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();
  filterName = SecondaryFilters.SDGS;

  constructor(private sdgService: SdgsService) {}

  createOptions(): FilterOption[] {
    const allSdgs = this.sdgService.allSdgs || [];
    return allSdgs.map((sdg) => {
      return {
        key: `${sdg}`,
        labelKey: `SDGS.goal_${sdg}`,
        labelPrefix: `${sdg}`,
        checked: this.selected?.includes(`${sdg}`)
      };
    });
  }
}
