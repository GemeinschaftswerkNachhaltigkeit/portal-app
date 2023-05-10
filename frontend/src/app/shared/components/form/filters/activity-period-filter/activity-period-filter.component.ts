import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';
import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { SecondaryFilters } from '../secondary-filters/secondary-filters.component';

@Component({
  selector: 'app-activity-period-filter',
  templateUrl: './activity-period-filter.component.html',
  styleUrls: ['./activity-period-filter.component.scss']
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
