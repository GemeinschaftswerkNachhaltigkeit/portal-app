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
import { AdditionalFiltersData } from './additional-filters-modal.component';
import {
  SpecialOrgaFilters,
  SpecialOrgasFilterComponent
} from './special-orgas-filter.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { OrderedFilterComponent } from './ordered-filter.component';
import { ThematicFocusFilterComponent } from './thematic-focus-filter.component';
import { SdgFilterComponent } from './sdg-filter.component';
import { ImpactAreasFilterComponent } from './impact-areas-filter.component';
import { OrgaTypesFilterComponent } from './orga-types-filter.component';
import { ActiTypesFilterComponent } from './acti-types-filter.component';
import { OfferCategoryFilterComponent } from './offer-category-filter.component';
import { BestPracticeCategoryFilterComponent } from './best-practice-category-filter.component';
import { ActivityPeriodFilterComponent } from './activity-period-filter.component';
import { OnlineFilterComponent } from './online-filter.component';
import { OnlyDanFilterComponent } from './only-dan-filter.component';

export enum SecondaryFilters {
  THEMATIC_FOCUS = 'THEMATIC_FOCUS',
  SDGS = 'SDGS',
  IMPACT_AREAS = 'IMPACT_AREAS',
  ORGA_TYPES = 'ORGA_TYPES',
  ACTIVITY_TYPES = 'ACTIVITY_TYPES',
  OFFER_CATS = 'OFFER_CATS',
  BEST_PRACTICE_CATS = 'BEST_PRACTICE_CATS',
  ACTIVITY_PERIOD = 'ACTIVITY_PERIOD',
  SPECIAL_ORGAS = 'SPECIAL_ORGAS',
  ONLINE = 'ONLINE',
  ONLY_DAN = 'ONLY_DAN'
}

@Component({
  selector: 'app-secondary-filters',
  standalone: true,
  imports: [
    MatExpansionModule,
    OrderedFilterComponent,
    ThematicFocusFilterComponent,
    SdgFilterComponent,
    ImpactAreasFilterComponent,
    OrgaTypesFilterComponent,
    ActiTypesFilterComponent,
    SpecialOrgasFilterComponent,
    OfferCategoryFilterComponent,
    BestPracticeCategoryFilterComponent,
    ActivityPeriodFilterComponent,
    OnlineFilterComponent,
    OnlyDanFilterComponent
],
  template: `
    @if (filters) {
      <mat-accordion class="headers" [multi]="true">
        <div class="ordered-list">
          <app-ordered-filter [orderNumber]="getOrder(filterTypes.THEMATIC_FOCUS)"
            >@if (useFilter(filterTypes.THEMATIC_FOCUS)) {
            <app-thematic-focus-filter
              [selected]="filters.thematicFocus || []"
              (filterChanged)="thematicFocusHandler($event)"
              ></app-thematic-focus-filter
              >
            }</app-ordered-filter>
            <app-ordered-filter [orderNumber]="getOrder(filterTypes.SDGS)"
              >@if (useFilter(filterTypes.SDGS)) {
              <app-sdg-filter
                [selected]="filters.sdgs || []"
                (filterChanged)="sdgsHandler($event)"
                ></app-sdg-filter
                >
              }</app-ordered-filter>
              <app-ordered-filter [orderNumber]="getOrder(filterTypes.IMPACT_AREAS)"
                >@if (useFilter(filterTypes.IMPACT_AREAS)) {
                <app-impact-areas-filter
                  [selected]="filters.impactAreas || []"
                  (filterChanged)="impactAreaHandler($event)"
                  ></app-impact-areas-filter
                  >
                }</app-ordered-filter>
                <app-ordered-filter [orderNumber]="getOrder(filterTypes.ORGA_TYPES)"
                  >@if (useFilter(filterTypes.ORGA_TYPES)) {
                  <app-orga-types-filter
                    [selected]="filters.orgaTypes || []"
                    (filterChanged)="orgaTypeHandler($event)"
                    ></app-orga-types-filter
                    >
                  }</app-ordered-filter>
                  <app-ordered-filter [orderNumber]="getOrder(filterTypes.ACTIVITY_TYPES)"
                    >@if (useFilter(filterTypes.ACTIVITY_TYPES)) {
                    <app-acti-types-filter
                      [selected]="filters.activityTypes || []"
                      (filterChanged)="activityTypeHandler($event)"
                      ></app-acti-types-filter
                      >
                    }</app-ordered-filter>
                    <app-ordered-filter [orderNumber]="getOrder(filterTypes.SPECIAL_ORGAS)">
                      @if (useFilter(filterTypes.SPECIAL_ORGAS)) {
                        <app-special-orgas-filter
                          [initiator]="filters.initiator || false"
            [projectSustainabilityWinner]="
              filters.projectSustainabilityWinner || false
            "
                          (filterChanged)="specialOrgaHandler($event)"
                        ></app-special-orgas-filter>
                      }
                    </app-ordered-filter>
                    <app-ordered-filter [orderNumber]="getOrder(filterTypes.OFFER_CATS)"
                      >@if (useFilter(filterTypes.OFFER_CATS)) {
                      <app-offer-category-filter
                        [selected]="filters.offerCat || []"
                        (filterChanged)="offerCategoriesHandler($event)"
                        ></app-offer-category-filter
                        >
                      }</app-ordered-filter>
                      <app-ordered-filter
                        [orderNumber]="getOrder(filterTypes.BEST_PRACTICE_CATS)"
                        >@if (useFilter(filterTypes.BEST_PRACTICE_CATS)) {
                        <app-best-practice-category-filter
                          [selected]="filters.bestPractiseCat || []"
                          (filterChanged)="bestPracticeCategoriesHandler($event)"
                          ></app-best-practice-category-filter
                          >
                        }</app-ordered-filter>
                        <app-ordered-filter
                          [orderNumber]="getOrder(filterTypes.ACTIVITY_PERIOD)"
                          >@if (useFilter(filterTypes.ACTIVITY_PERIOD)) {
                          <app-activity-period-filter
                            [startDate]="filters.startDate"
                            [endDate]="filters.endDate"
                            (filterChanged)="dateRangeHandler($event)"
                            ></app-activity-period-filter
                            >
                          }</app-ordered-filter>
                          <app-ordered-filter [orderNumber]="getOrder(filterTypes.ONLINE)"
                            >@if (useFilter(filterTypes.ONLINE)) {
                            <app-online-filter
                              [selected]="filters.online"
                              (filterChanged)="onlineHandler($event)"
                              ></app-online-filter
                              >
                            }</app-ordered-filter>
                            <app-ordered-filter [orderNumber]="getOrder(filterTypes.ONLY_DAN)"
                              >@if (useFilter(filterTypes.ONLY_DAN)) {
                              <app-only-dan-filter
                                [selected]="filters.onlyDan"
                                (filterChanged)="onlyDanHandler($event)"
                                ></app-only-dan-filter
                                >
                              }</app-ordered-filter>
                            </div>
                          </mat-accordion>
                        }
    `,
  styles: `
    .ordered-list {
      display: flex;
      flex-direction: column;
    }
  `
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

  onlineHandler(checked: boolean): void {
    this.filters.online = checked;
    this.updateFilters();
  }

  onlyDanHandler(checked: boolean): void {
    this.filters.onlyDan = checked;
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
    if (!this.useFilter(SecondaryFilters.ONLINE)) {
      delete f.online;
    }
    if (!this.useFilter(SecondaryFilters.ONLY_DAN)) {
      delete f.onlyDan;
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
        this.data.projectSustainabilityWinner || false,
      online: this.data.online || false,
      onlyDan: this.data.onlyDan || false
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
