import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-only-dan-filter',
  templateUrl: './only-dan-filter.component.html',
  styleUrls: ['./only-dan-filter.component.scss']
})
export class OnlyDanFilterComponent {
  @Input() selected? = false;
  @Output() filterChanged = new EventEmitter<boolean>();
  filterName = SecondaryFilters.ONLY_DAN;

  constructor(private filtersService: SecondaryFitlersService) {}

  isOpen(): boolean {
    return this.filtersService.filterOpen(this.filterName);
  }

  clear(): void {
    this.filterChanged.emit(false);
  }
  activeFilters(): number {
    return this.selected ? 1 : 0;
  }

  onlyDanHandler(event: MatSlideToggleChange) {
    this.filterChanged.emit(event.checked);
  }
}
