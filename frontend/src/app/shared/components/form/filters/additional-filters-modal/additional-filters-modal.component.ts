import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';

export type AdditionalFiltersData = {
  use?: SecondaryFilters[];
  selectedThematicFocusValues?: string[];
  selectedSdgValues?: string[];
  selectedImpactAreas?: string[];
  selectedOrgaTypes?: string[];
  selectedActivityTypes?: string[];
  selectedOfferCategories?: string[];
  selectedBestPracticeCategories?: string[];
  selectedStartDate?: string;
  selectedEndDate?: string;
  initiator?: boolean;
  projectSustainabilityWinner?: boolean;
};

@Component({
  selector: 'app-additional-filters-modal',
  templateUrl: './additional-filters-modal.component.html',
  styleUrls: ['./additional-filters-modal.component.scss']
})
export class AdditionalFiltersModalComponent {
  filters?: AdditionalFilters;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AdditionalFiltersData,
    public dialogRef: MatDialogRef<AdditionalFiltersModalComponent>
  ) {}

  handleFiltersChanged(fitlers: AdditionalFilters): void {
    this.filters = fitlers;
  }

  apply(): void {
    this.dialogRef.close(this.filters);
  }
}
