import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-online-filter',
  templateUrl: './online-filter.component.html',
  styleUrls: ['./online-filter.component.scss']
})
export class OnlineFilterComponent {
  @Input() selected? = false;
  @Output() filterChanged = new EventEmitter<boolean>();
  filterName = SecondaryFilters.ONLINE;

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

  onlineHandler(event: MatSlideToggleChange) {
    this.filterChanged.emit(event.checked);
  }
}
