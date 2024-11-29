import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import {
  SecondaryFilters,
  SecondaryFiltersComponent
} from './secondary-filters.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

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
  online?: boolean;
  onlyDan?: boolean;
};

@Component({
  selector: 'app-additional-filters-modal',
  standalone: true,
  imports: [
    CommonModule,
    SecondaryFiltersComponent,
    TranslateModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <div mat-dialog-content>
      <app-secondary-filters
        *ngIf="data"
        [data]="data"
        (filtersChanged)="handleFiltersChanged($event)"
      ></app-secondary-filters>
    </div>
    <div mat-dialog-actions>
      <button mat-flat-button cdkFocusInitial (click)="apply()" color="accent">
        {{ 'btn.apply' | translate }}
      </button>
      <button mat-button mat-dialog-close>
        {{ 'btn.close' | translate }}
      </button>
    </div>
  `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    div.mat-mdc-dialog-content {
      padding: 0;
    }
    .mat-expansion-panel-header-title,
    .mat-expansion-panel-header-description {
      color: $blue-navy;
      flex-basis: 0;
    }
    .mat-expansion-panel-header-description {
      justify-content: flex-end;
      align-items: center;
      width: 3.2rem;
      flex-grow: 0;
    }

    .filter {
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
    .check {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hidden {
      height: 0;
      opacity: 0;
    }
  `
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
