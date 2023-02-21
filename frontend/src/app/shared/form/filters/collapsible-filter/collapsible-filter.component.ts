import { Component, EventEmitter, Input, Output } from '@angular/core';
import FilterOption from 'src/app/shared/models/filter-options';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';

@Component({
  selector: 'app-collapsible-filter',
  templateUrl: './collapsible-filter.component.html',
  styleUrls: ['./collapsible-filter.component.scss']
})
export class CollapsibleFilterComponent {
  @Input() filterName!: SecondaryFilters;
  @Input() options: FilterOption[] = [];
  @Input() selected: string[] = [];
  @Output() filterChanged = new EventEmitter<string[]>();

  constructor(private filterService: SecondaryFitlersService) {}

  clear(): void {
    this.handleChange([]);
  }

  handleChange(values: FilterOption[]): void {
    this.filterChanged.emit(values.map((v) => v.key));
  }

  filterOpen(): boolean {
    return this.filterService.filterOpen(this.filterName);
  }
}
