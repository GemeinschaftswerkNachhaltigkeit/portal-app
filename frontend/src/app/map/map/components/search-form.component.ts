import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AdditionalFiltersModalComponent } from 'src/app/shared/components/form/filters/additional-filters-modal.component';
import { SecondaryFilters } from 'src/app/shared/components/form/filters/secondary-filters.component';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import { DynamicFilters } from '../../models/search-filter';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterModalButtonComponent } from 'src/app/shared/components/form/filters/filter-modal-button.component';
import { FeatureComponent } from 'src/app/shared/components/feature/feature.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FilterModalButtonComponent,
    FeatureComponent,
    MatCheckboxModule,
    TranslateModule
],
  template: `
    <div class="form-wrapper map-filters">
      <div class="left">
        @if (searchForm) {
          <form novalidate [formGroup]="searchForm">
            <div class="what-and-where">
              <div class="field">
                <mat-form-field appearance="outline" color="primary">
                  <mat-label>{{ 'forms.labels.query' | translate }}</mat-label>
                  <input matInput formControlName="query" />
                </mat-form-field>
              </div>
              <div class="field">
                <mat-form-field appearance="outline" color="primary">
                  <mat-label>{{ 'forms.labels.location' | translate }}</mat-label>
                  <input matInput formControlName="location" />
                </mat-form-field>
              </div>
            </div>
          </form>
        }
        <div class="filter-button">
          <app-filter-modal-button
            [count]="filterCount()"
            (clear)="clearAll()"
            (openModal)="openFilters()"
          ></app-filter-modal-button>
        </div>
      </div>
    
      <div class="right">
        <app-feature feature="dan-account">
          <div class="view-type">
            <mat-checkbox
              class="dan"
              color="primary"
              [(ngModel)]="showDan"
              (ngModelChange)="viewTypeHandler()"
              [ngModelOptions]="{ standalone: true }"
              >{{ 'map.labels.dan' | translate }}</mat-checkbox
              >
              <mat-checkbox
                class="orga"
                color="primary"
                [(ngModel)]="showOrga"
                (ngModelChange)="viewTypeHandler()"
                [ngModelOptions]="{ standalone: true }"
                >{{ 'map.labels.organisation' | translate }}</mat-checkbox
                >
              </div>
            </app-feature>
          </div>
        </div>
    `,
  styles: `
    @use 'theme' as *;

    :host {
      height: 100%;
    }

    .form-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      height: 100%;

      .left {
        display: flex;
        flex-direction: column;
        gap: $spacing-2;
        width: 100%;
        align-items: center;
        form {
          width: 100%;
        }
        .what-and-where {
          display: flex;
          flex-direction: column;
          gap: $spacing-2;
          align-items: center;
          width: 100%;
        }

        .field {
          flex-grow: 1;
          flex-shrink: 1;
          width: 100%;

          .mat-mdc-form-field {
            margin-bottom: 0;
          }
        }

        .filter-button {
          display: flex;
          width: 100%;
          padding-inline: $spacing-4;
        }
      }

      .right {
        width: 100%;
        margin: $spacing-2 0;

        .view-type {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-start;
          gap: $spacing-2;
        }
      }
    }

    @media screen and (min-width: 600px) {
      .form-wrapper {
        .left {
          .what-and-where {
            flex-direction: row;
          }
        }
      }
    }

    @media screen and (min-width: 760px) {
      .form-wrapper {
        width: 100%;
        flex-direction: row;
        flex-wrap: nowrap;

        .left {
          flex-direction: row;
          width: auto;

          .what-and-where {
            flex-direction: row;
          }
        }

        .field {
          flex-grow: 0;
          flex-shrink: 1;
          width: auto;
          min-width: none;
        }

        .right {
          width: auto;

          .view-type {
            justify-content: flex-end;
            gap: $spacing-4;
          }
        }
      }
    }
  `
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
  showDan = true;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

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
      if (this.activeFilters['viewType']) {
        const viewTypes = this.activeFilters['viewType'] as string[];
        this.showOrga = viewTypes.includes('ORGANISATION');
        this.showDan = viewTypes.includes('DAN');
      }
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
