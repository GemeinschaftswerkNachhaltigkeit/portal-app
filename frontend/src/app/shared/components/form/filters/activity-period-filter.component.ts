import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxChange,
  MatCheckboxModule
} from '@angular/material/checkbox';
import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { SecondaryFilters } from './secondary-filters.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FilterCountBadgeComponent } from './filter-count-badge.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-activity-period-filter',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCheckboxModule,
    MatExpansionModule,
    FilterCountBadgeComponent,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
    <!-- Date Range -->
    <mat-expansion-panel class="filter mat-elevation-z0">
      <mat-expansion-panel-header>
        <mat-panel-title>
          {{ 'labels.dateRange' | translate }}
        </mat-panel-title>
        <mat-panel-description>
          <app-filter-count-badge [active]="hasDateRange()" (clicked)="clear()">
            @if (hasDateRange()) {
              <span class="check"><mat-icon>check</mat-icon></span>
            }
            @if (!hasDateRange()) {
              <span>-</span>
            }
          </app-filter-count-badge></mat-panel-description
        >
      </mat-expansion-panel-header>

      <mat-checkbox
        (change)="handlePermanentFilter($event)"
        [checked]="isPermanent()"
        >{{ 'labels.permanent' | translate }}</mat-checkbox
      >
      <div [ngClass]="{ hidden: isPermanent() }">
        <mat-form-field appearance="outline">
          <mat-date-range-input
            [formGroup]="dateRange"
            [rangePicker]="dateRangePicker"
          >
            <input
              matStartDate
              [placeholder]="'map.labels.startDate' | translate"
              formControlName="start"
              [readonly]="true"
            />
            <input
              matEndDate
              [placeholder]="'map.labels.endDate' | translate"
              formControlName="end"
              [readonly]="true"
            />
          </mat-date-range-input>
          <mat-datepicker-toggle
            matSuffix
            [for]="dateRangePicker"
          ></mat-datepicker-toggle>
          <mat-date-range-picker #dateRangePicker></mat-date-range-picker>
        </mat-form-field>
      </div>
    </mat-expansion-panel>
  `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;
    div.mat-dialog-content {
      padding: 0;
    }
    .filter {
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
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
  `
})
export class ActivityPeriodFilterComponent implements OnInit, OnDestroy {
  private static readonly utcPermanentStart = '1970-01-01T00:00:00.000Z';
  private static readonly utcPermanentEnd = '9999-12-31T00:00:00.000Z';

  @Input() startDate? = '';
  @Input() endDate? = '';
  @Output() filterChanged = new EventEmitter<{
    startDate: string;
    endDate: string;
  }>();
  filterName = SecondaryFilters.ACTIVITY_PERIOD;

  constructor(private filtersService: SecondaryFitlersService) {}

  unsubscribe$ = new Subject();
  permanent = false;

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  isOpen(): boolean {
    return this.filtersService.filterOpen(this.filterName);
  }

  clear(): void {
    this.dateRange.reset();
  }

  handlePermanentFilter(event: MatCheckboxChange) {
    const checked = event.checked;
    if (checked) {
      const permanentStart = DateTime.fromISO('1970-01-01');
      const permanentEnd = DateTime.fromISO('9999-12-31');

      this.dateRange.setValue({
        start: permanentStart,
        end: permanentEnd
      });
      this.dateRange.disable();
    } else {
      this.dateRange.enable();
      this.dateRange.updateValueAndValidity();
      const start = DateTime.fromISO(this.startDate || '');
      const end = DateTime.fromISO(this.endDate || '');

      if (!this.datesArePermanentDates(start, end)) {
        this.dateRange.setValue({
          start: start,
          end: end
        });
      } else {
        this.dateRange.reset();
      }
    }
  }

  isPermanent(): boolean {
    const start = this.dateRange.get('start')?.value;
    const end = this.dateRange.get('end')?.value;

    const currentStart = start ? start.startOf('day') : null;
    const currentEnd = end ? end.startOf('day') : null;

    return this.datesArePermanentDates(currentStart, currentEnd);
  }

  private datesArePermanentDates(start: DateTime, end: DateTime): boolean {
    if (!start || !end) {
      return false;
    }
    const permanentStart = DateTime.fromISO('1970-01-01');
    const permanentEnd = DateTime.fromISO('9999-12-31');
    const equal =
      start.hasSame(permanentStart, 'year') &&
      start.hasSame(permanentStart, 'month') &&
      start.hasSame(permanentStart, 'day') &&
      end.hasSame(permanentEnd, 'year') &&
      end.hasSame(permanentEnd, 'month') &&
      end.hasSame(permanentEnd, 'day');

    return equal;
  }

  hasDateRange(): boolean {
    return this.dateRange.value.start && this.dateRange.value.end;
  }

  ngOnInit(): void {
    if (this.startDate && this.endDate) {
      this.dateRange.setValue({
        start: DateTime.fromISO(this.startDate),
        end: DateTime.fromISO(this.endDate)
      });
    }

    this.dateRange.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        const dateRange = this.dateRange.value;
        this.filterChanged.emit({
          startDate: this.isPermanent()
            ? ActivityPeriodFilterComponent.utcPermanentStart
            : dateRange.start?.toISO(),
          endDate: this.isPermanent()
            ? ActivityPeriodFilterComponent.utcPermanentEnd
            : dateRange.end?.toISO()
        });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
