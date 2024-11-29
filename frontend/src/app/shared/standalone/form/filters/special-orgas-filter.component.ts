import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatCheckboxChange,
  MatCheckboxModule
} from '@angular/material/checkbox';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { SecondaryFilters } from './secondary-filters.component';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { FilterCountBadgeComponent } from './filter-count-badge.component';

export type SpecialOrgaFilters = {
  initiator: boolean;
  projectSustainabilityWinner: boolean;
};

@Component({
  selector: 'app-special-orgas-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCheckboxModule,
    TranslateModule,
    FilterCountBadgeComponent
  ],
  template: `
    <mat-expansion-panel class="filter mat-elevation-z0">
      <mat-expansion-panel-header>
        <mat-panel-title>
          {{ 'labels.specialOrgas' | translate }}
        </mat-panel-title>
        <mat-panel-description>
          <app-filter-count-badge
            [active]="activeFilters() > 0"
            (clicked)="clear()"
            >{{ activeFilters() }}</app-filter-count-badge
          >
        </mat-panel-description>
      </mat-expansion-panel-header>

      <ul class="filter-checkbox-entries">
        <li class="entry">
          <mat-checkbox
            (change)="handleProjectSustainabilityWinnerFilter($event)"
            [checked]="projectSustainabilityWinner"
            ><span class="label">{{
              'labels.projectSustainabilityWinnerLong' | translate
            }}</span></mat-checkbox
          >
        </li>
        <li class="entry">
          <mat-checkbox
            (change)="handleInitatorFilter($event)"
            [checked]="initiator"
            ><span class="label">{{
              'labels.initiator' | translate
            }}</span></mat-checkbox
          >
        </li>
      </ul>
    </mat-expansion-panel>
  `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;
    .filter-checkbox-entries {
      display: grid;
      gap: $spacing-2;
      padding: 0;
      margin: 0;

      .entry {
        list-style-type: none;
        width: 100%;
        .label {
          display: block;
          width: 230px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          @media screen and (min-width: 550px) {
            width: 400px;
          }
          @media screen and (min-width: 700px) {
            width: 500px;
          }
          @media screen and (min-width: 800px) {
            width: 600px;
          }
          @media screen and (min-width: 900px) {
            width: auto;
          }

          .prefix {
            margin-right: $spacing-2;
          }
        }
      }
    }
    div.mat-dialog-content {
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
    .check {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hidden {
      height: 0;
      opacity: 0;
    }
    .filter {
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
  `
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
