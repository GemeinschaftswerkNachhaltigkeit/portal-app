import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import { AdditionalFiltersData } from '../additional-filters-modal/additional-filters-modal.component';
import { SpecialOrgaFilters } from '../special-orgas-filter/special-orgas-filter.component';

export enum SecondaryFilters {
  THEMATIC_FOCUS = 'THEMATIC_FOCUS',
  SDGS = 'SDGS',
  IMPACT_AREAS = 'IMPACT_AREAS',
  ORGA_TYPES = 'ORGA_TYPES',
  ACTIVITY_TYPES = 'ACTIVITY_TYPES',
  OFFER_CATS = 'OFFER_CATS',
  BEST_PRACTICE_CATS = 'BEST_PRACTICE_CATS',
  ACTIVITY_PERIOD = 'ACTIVITY_PERIOD',
  SPECIAL_ORGAS = 'SPECIAL_ORGAS'
}

@Component({
  selector: 'app-secondary-filters',
  templateUrl: './secondary-filters.component.html',
  styleUrls: ['./secondary-filters.component.scss']
})
export class SecondaryFiltersComponent implements OnInit, OnChanges {
  @Input() data!: AdditionalFiltersData;
  @Output() filtersChanged = new EventEmitter<AdditionalFilters>();

  filterTypes = SecondaryFilters;
  filters: AdditionalFilters = {};

  useFilter(type: SecondaryFilters): boolean {
    if (this.data.use) {
      return this.data.use.includes(type);
    }

    return true;
  }

  getOrder(type: SecondaryFilters): number {
    if (!this.data.use || !this.data.use.length) {
      return 0;
    }
    const index = this.data.use.indexOf(type);
    return index === -1 ? 0 : index;
  }

  thematicFocusHandler(values: string[]): void {
    this.filters.thematicFocus = values;
    this.updateFilters();
  }

  sdgsHandler(values: string[]): void {
    this.filters.sdgs = values;
    this.updateFilters();
  }

  impactAreaHandler(values: string[]): void {
    this.filters.impactAreas = values;
    this.updateFilters();
  }

  orgaTypeHandler(values: string[]): void {
    this.filters.orgaTypes = values;
    this.updateFilters();
  }

  activityTypeHandler(values: string[]): void {
    this.filters.activityTypes = values;
    this.updateFilters();
  }

  specialOrgaHandler(values: SpecialOrgaFilters): void {
    this.filters.initiator = values.initiator;
    this.filters.projectSustainabilityWinner =
      values.projectSustainabilityWinner;
    this.updateFilters();
  }

  offerCategoriesHandler(values: string[]): void {
    this.filters.offerCat = values;
    this.updateFilters();
  }

  bestPracticeCategoriesHandler(values: string[]): void {
    this.filters.bestPractiseCat = values;
    this.updateFilters();
  }

  dateRangeHandler(values: { startDate: string; endDate: string }): void {
    this.filters.startDate = values.startDate;
    this.filters.endDate = values.endDate;
    this.updateFilters();
  }

  private updateFilters(): void {
    const f = { ...this.filters };
    if (!this.useFilter(SecondaryFilters.THEMATIC_FOCUS)) {
      delete f.thematicFocus;
    }
    if (!this.useFilter(SecondaryFilters.SDGS)) {
      delete f.sdgs;
    }
    if (!this.useFilter(SecondaryFilters.IMPACT_AREAS)) {
      delete f.impactAreas;
    }
    if (!this.useFilter(SecondaryFilters.OFFER_CATS)) {
      delete f.offerCat;
    }
    if (!this.useFilter(SecondaryFilters.BEST_PRACTICE_CATS)) {
      delete f.bestPractiseCat;
    }
    if (!this.useFilter(SecondaryFilters.ACTIVITY_TYPES)) {
      delete f.activityTypes;
    }
    if (!this.useFilter(SecondaryFilters.ORGA_TYPES)) {
      delete f.orgaTypes;
    }
    if (!this.useFilter(SecondaryFilters.ACTIVITY_PERIOD)) {
      delete f.startDate;
      delete f.endDate;
    }
    if (!this.useFilter(SecondaryFilters.SPECIAL_ORGAS)) {
      delete f.initiator;
      delete f.projectSustainabilityWinner;
    }
    this.filtersChanged.emit(f);
  }

  private setFilters(): void {
    this.filters = {
      thematicFocus: this.data.selectedThematicFocusValues || [],
      sdgs: this.data.selectedSdgValues || [],
      impactAreas: this.data.selectedImpactAreas || [],
      orgaTypes: this.data.selectedOrgaTypes || [],
      activityTypes: this.data.selectedActivityTypes || [],
      bestPractiseCat: this.data.selectedBestPracticeCategories || [],
      offerCat: this.data.selectedOfferCategories || [],
      startDate: this.data.selectedStartDate || '',
      endDate: this.data.selectedEndDate || '',
      initiator: this.data.initiator || false,
      projectSustainabilityWinner:
        this.data.projectSustainabilityWinner || false
    };
  }

  ngOnInit(): void {
    this.setFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.setFilters();
    }
  }
}
