import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';

export type SpecialOrgaFilters = {
  initiator: boolean;
  projectSustainabilityWinner: boolean;
};

@Component({
  selector: 'app-special-orgas-filter',
  templateUrl: './special-orgas-filter.component.html',
  styleUrls: ['./special-orgas-filter.component.scss']
})
export class SpecialOrgasFilterComponent {
  @Input() initiator = false;
  @Input() projectSustainabilityWinner = false;
  @Output() filterChanged = new EventEmitter<SpecialOrgaFilters>();
  filterName = SecondaryFilters.SPECIAL_ORGAS;

  constructor(private filtersService: SecondaryFitlersService) {}

  isOpen(): boolean {
    return this.filtersService.filterOpen(this.filterName);
  }

  clear(): void {
    this.filterChanged.emit({
      initiator: false,
      projectSustainabilityWinner: false
    });
  }
  activeFilters(): number {
    let count = 0;
    if (this.initiator) {
      count += 1;
    }
    if (this.projectSustainabilityWinner) {
      count += 1;
    }
    return count;
  }

  handleInitatorFilter(event: MatCheckboxChange) {
    const checked = event.checked;
    this.filterChanged.emit({
      initiator: checked,
      projectSustainabilityWinner: this.projectSustainabilityWinner
    });
  }
  handleProjectSustainabilityWinnerFilter(event: MatCheckboxChange) {
    const checked = event.checked;
    this.filterChanged.emit({
      initiator: this.initiator,
      projectSustainabilityWinner: checked
    });
  }
}
