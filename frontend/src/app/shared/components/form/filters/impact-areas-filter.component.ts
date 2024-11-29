import { Component, EventEmitter, Input, Output } from '@angular/core';
import FilterOption from 'src/app/shared/models/filter-options';
import { ImpactArea } from 'src/app/shared/models/impact-area';
import { SdgsService } from 'src/app/shared/services/sdgs.service';
import { SecondaryFilters } from './secondary-filters.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CollapsibleFilterComponent } from './collapsible-filter.component';

@Component({
  selector: 'app-impact-areas-filter',
  standalone: true,
  imports: [CommonModule, TranslateModule, CollapsibleFilterComponent],
  template: `
    <app-collapsible-filter
      [filterName]="filterName"
      [selected]="selected"
      [options]="createOptions()"
      (filterChanged)="filterChanged.emit($event)"
      >{{ 'labels.impactAreas' | translate }}
    </app-collapsible-filter>
  `
})
export class ImpactAreasFilterComponent {
  @Input() options: FilterOption[] = [];
  @Input() selected: string[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();
  filterName = SecondaryFilters.IMPACT_AREAS;

  constructor(private sdgService: SdgsService) {}

  createOptions(): FilterOption[] {
    return Object.keys(ImpactArea).map((impactArea) => {
      return {
        key: impactArea,
        labelKey: `impactArea.${impactArea}`,
        checked: this.selected?.includes(impactArea)
      };
    });
  }
}
