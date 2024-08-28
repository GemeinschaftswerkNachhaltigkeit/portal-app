import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats
} from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { EventsService } from '../../data/events.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-date-select-header',
  styles: [
    `
      .header {
        display: flex;
        align-items: center;
        padding: 0.5em;
      }

      .header-label {
        flex: 1;
        height: 1em;
        font-weight: 500;
        text-align: center;
      }
    `
  ],
  template: `
    <div class="header">
      <button mat-icon-button (click)="previousClicked('year')">
        <mat-icon>keyboard_double_arrow_left</mat-icon>
      </button>
      <button mat-icon-button (click)="previousClicked('month')">
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <span class="header-label">{{ periodLabel }}</span>
      <button mat-icon-button (click)="nextClicked('month')">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
      <button mat-icon-button (click)="nextClicked('year')">
        <mat-icon>keyboard_double_arrow_right</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateSelectHeaderComponent<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private eventsService: EventsService
  ) {
    this.translate.onLangChange.subscribe((event) => {
      this._locale = event.lang;
      this._dateAdapter.setLocale(this._locale);
    });
    _calendar.stateChanges.pipe(takeUntil(this._destroyed)).subscribe((x) => {
      cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(
        this._calendar.activeDate,
        this._dateFormats.display.monthYearLabel
      )
      .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year') {
    const newDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
    this.eventsService.setCurrentMonthOfCalendar(newDate as DateTime);
    this.eventsService.loadAvailableEvents(() => {
      this._calendar.activeDate = newDate;
    });
  }

  nextClicked(mode: 'month' | 'year') {
    const newDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
    this.eventsService.setCurrentMonthOfCalendar(newDate as DateTime);
    this.eventsService.loadAvailableEvents(() => {
      this._calendar.activeDate = newDate;
    });
  }
}
