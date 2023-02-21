import { Component, EventEmitter, Input, Output } from '@angular/core';
import FilterOption from 'src/app/shared/models/filter-options';
import { ImpactArea } from 'src/app/shared/models/impact-area';
import { SdgsService } from 'src/app/shared/services/sdgs.service';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';

@Component({
  selector: 'app-impact-areas-filter',
  templateUrl: './impact-areas-filter.component.html',
  styleUrls: ['./impact-areas-filter.component.scss']
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
