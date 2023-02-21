import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import AdditionalFilters from '../../../shared/models/additional-filters';
import { DynamicFilters } from '../../models/search-filter';
import { AdditionalFiltersModalComponent } from '../../../shared/form/filters/additional-filters-modal/additional-filters-modal.component';
import { SecondaryFilters } from 'src/app/shared/form/filters/secondary-filters/secondary-filters.component';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  @Input() activeFilters: DynamicFilters | null = {};
  @Output() searchParamsChanged = new EventEmitter<DynamicFilters>();

  filters = [
    SecondaryFilters.THEMATIC_FOCUS,
    SecondaryFilters.SDGS,
    SecondaryFilters.IMPACT_AREAS,
    SecondaryFilters.ORGA_TYPES,
    SecondaryFilters.ACTIVITY_TYPES,
    SecondaryFilters.ACTIVITY_PERIOD
  ];
  searchForm = this.fb.group({
    query: [''],
    location: ['']
  });
  showOrga = true;
  showActivity = true;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {}

  openFilters(): void {
    const filters = this.getActiveFilters();
    const dialogRef = this.dialog.open(AdditionalFiltersModalComponent, {
      width: '800px',
      data: {
        use: this.filters,
        selectedThematicFocusValues: filters.thematicFocus,
        selectedImpactAreas: filters.impactAreas,
        selectedSdgValues: filters.sdgs,
        selectedOrgaTypes: filters.orgaTypes,
        selectedActivityTypes: filters.activityTypes,
        selectedStartDate: filters.startDate,
        selectedEndDate: filters.endDate
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.emitFilters(result);
      }
    });
  }

  filterCount(): number {
    const selectedThematicFocusValues = this.activeFilters
      ? (this.activeFilters['thematicFocus'] as string[])
      : [];
    const selectedSdgValues = this.activeFilters
      ? (this.activeFilters['sdgs'] as string[])
      : [];
    const selectedImpactAreas = this.activeFilters
      ? (this.activeFilters['impactAreas'] as string[])
      : [];
    const selectedOrgaTypes = this.activeFilters
      ? (this.activeFilters['orgaTypes'] as string[])
      : [];
    const selectedActivityTypes = this.activeFilters
      ? (this.activeFilters['activityTypes'] as string[])
      : [];
    const hasDateRange =
      this.activeFilters &&
      this.activeFilters['startDate'] &&
      this.activeFilters['endDate'];

    const sdgs = selectedSdgValues ? selectedSdgValues.length : 0;
    const impactAreas = selectedImpactAreas ? selectedImpactAreas.length : 0;
    const orgaTypes = selectedOrgaTypes ? selectedOrgaTypes.length : 0;
    const activityTypes = selectedActivityTypes
      ? selectedActivityTypes.length
      : 0;
    const focus = selectedThematicFocusValues
      ? selectedThematicFocusValues.length
      : 0;
    const dateRange = hasDateRange ? 1 : 0;
    const query = this.searchForm?.get('query')?.value ? 1 : 0;
    const location = this.searchForm?.get('location')?.value ? 1 : 0;

    return (
      sdgs +
      focus +
      impactAreas +
      orgaTypes +
      activityTypes +
      dateRange +
      query +
      location
    );
  }

  clearAll(): void {
    this.searchForm.reset();
    this.emitFilters({});
  }

  viewTypeHandler(): void {
    let viewType = '';
    if (this.showOrga && !this.showActivity) {
      viewType = 'ORGANISATION';
    }
    if (!this.showOrga && this.showActivity) {
      viewType = 'ACTIVITY';
    }
    if (this.showOrga && this.showActivity) {
      viewType = '';
    }
    if (!this.showOrga && !this.showActivity) {
      // viewType = 'NONE';
      viewType = '';
    }
    this.emitFilters(undefined, viewType);
  }

  private getActiveFilters(): AdditionalFilters & {
    viewType?: string;
    startDate?: string;
    endDate?: string;
  } {
    const selectedThematicFocusValues = this.activeFilters
      ? (this.activeFilters['thematicFocus'] as string[])
      : [];
    const selectedSdgValues = this.activeFilters
      ? (this.activeFilters['sdgs'] as string[])
      : [];
    const selectedImpactAreas = this.activeFilters
      ? (this.activeFilters['impactAreas'] as string[])
      : [];
    const selectedOrgaTypes = this.activeFilters
      ? (this.activeFilters['orgaTypes'] as string[])
      : [];
    const selectedActivityTypes = this.activeFilters
      ? (this.activeFilters['activityTypes'] as string[])
      : [];
    const viewType = this.activeFilters
      ? (this.activeFilters['viewType'] as string)
      : '';
    const startDate = this.activeFilters
      ? (this.activeFilters['startDate'] as string)
      : '';
    const endDate = this.activeFilters
      ? (this.activeFilters['endDate'] as string)
      : '';

    return {
      sdgs: selectedSdgValues,
      thematicFocus: selectedThematicFocusValues,
      impactAreas: selectedImpactAreas,
      orgaTypes: selectedOrgaTypes,
      activityTypes: selectedActivityTypes,
      startDate: startDate,
      endDate: endDate,
      viewType: viewType
    };
  }

  private setActiveFilters(): void {
    if (this.activeFilters) {
      this.searchForm.patchValue(this.activeFilters);
      const { viewType } = this.getActiveFilters();
      this.showActivity = viewType === 'ACTIVITY' || !viewType;
      this.showOrga = viewType === 'ORGANISATION' || !viewType;
    }
  }

  private emitFilters(
    additionalFilters?: AdditionalFilters,
    viewType?: string
  ): void {
    const value = this.searchForm.value;
    const addFilters = additionalFilters || this.getActiveFilters();
    const viewTypeValue =
      viewType !== undefined ? viewType : this.getActiveFilters().viewType;
    const values = {
      query: value.query || '',
      location: value.location || '',
      sdgs: addFilters.sdgs || [],
      thematicFocus: addFilters.thematicFocus || [],
      impactAreas: addFilters.impactAreas || [],
      orgaTypes: addFilters.orgaTypes || [],
      activityTypes: addFilters.activityTypes || [],
      startDate: addFilters.startDate || '',
      endDate: addFilters.endDate || '',
      viewType: viewTypeValue || ''
    };
    this.searchParamsChanged.emit(values);
  }

  ngOnInit(): void {
    this.setActiveFilters();
    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.emitFilters();
      });
  }
}
