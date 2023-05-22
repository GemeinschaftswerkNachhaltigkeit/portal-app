import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AdditionalFiltersModalComponent } from 'src/app/shared/components/form/filters/additional-filters-modal/additional-filters-modal.component';
import { SecondaryFilters } from 'src/app/shared/components/form/filters/secondary-filters/secondary-filters.component';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import { DynamicFilters } from '../../models/search-filter';

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
    SecondaryFilters.SPECIAL_ORGAS
  ];
  searchForm = this.fb.group({
    query: [''],
    location: ['']
  });
  showOrga = true;
  showActivity = true;
  showDan = true;

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
        initiator: filters.initiator,
        projectSustainabilityWinner: filters.projectSustainabilityWinner
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
    const initiator =
      this.activeFilters &&
      (this.activeFilters['initiator'] === 'true' ||
        this.activeFilters['initiator'] === true)
        ? 1
        : 0;
    const projectSustainabilityWinner =
      this.activeFilters &&
      (this.activeFilters['projectSustainabilityWinner'] === 'true' ||
        this.activeFilters['projectSustainabilityWinner'] === true)
        ? 1
        : 0;
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
      location +
      initiator +
      projectSustainabilityWinner
    );
  }

  clearAll(): void {
    this.searchForm.reset();
    this.emitFilters({});
  }

  viewTypeHandler(): void {
    const viewType = [];
    if (this.showOrga) {
      viewType.push('ORGANISATION');
    }
    if (this.showActivity) {
      viewType.push('ACTIVITY');
    }
    if (this.showDan) {
      viewType.push('DAN');
    }
    this.emitFilters(undefined, viewType);
  }

  private getActiveFilters(): AdditionalFilters & {
    viewType?: string[];
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
      ? (this.activeFilters['viewType'] as string[])
      : [];
    const startDate = this.activeFilters
      ? (this.activeFilters['startDate'] as string)
      : '';
    const endDate = this.activeFilters
      ? (this.activeFilters['endDate'] as string)
      : '';
    const initiator = this.activeFilters
      ? this.activeFilters['initiator'] === 'true' ||
        this.activeFilters['initiator'] === true
      : false;
    const projectSustainabilityWinner = this.activeFilters
      ? this.activeFilters['projectSustainabilityWinner'] === 'true' ||
        this.activeFilters['projectSustainabilityWinner'] === true
      : false;

    return {
      sdgs: selectedSdgValues,
      thematicFocus: selectedThematicFocusValues,
      impactAreas: selectedImpactAreas,
      orgaTypes: selectedOrgaTypes,
      activityTypes: selectedActivityTypes,
      startDate: startDate,
      endDate: endDate,
      viewType: viewType,
      initiator: initiator,
      projectSustainabilityWinner: projectSustainabilityWinner
    };
  }

  private setActiveFilters(): void {
    if (this.activeFilters) {
      this.searchForm.patchValue(this.activeFilters);
    }
  }

  private emitFilters(
    additionalFilters?: AdditionalFilters,
    viewType?: string[]
  ): void {
    const value = this.searchForm.value;
    const addFilters = additionalFilters || this.getActiveFilters();
    const viewTypeValue =
      viewType !== undefined ? viewType : this.getActiveFilters().viewType;

    const activityTypeFilters = addFilters.activityTypes || [];

    const values = {
      query: value.query || '',
      location: value.location || '',
      sdgs: addFilters.sdgs || [],
      thematicFocus: addFilters.thematicFocus || [],
      impactAreas: addFilters.impactAreas || [],
      orgaTypes: addFilters.orgaTypes || [],
      activityTypes: activityTypeFilters,
      startDate: addFilters.startDate || '',
      endDate: addFilters.endDate || '',
      viewType: viewTypeValue || '',
      initiator: addFilters.initiator || false,
      projectSustainabilityWinner:
        addFilters.projectSustainabilityWinner || false
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
