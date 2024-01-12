import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  MatCalendar,
  MatCalendarCellClassFunction
} from '@angular/material/datepicker';
import { DateTime } from 'luxon';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { DateSelectHeaderComponent } from '../date-select-header/date-select-header.component';

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.scss']
})
export class DateSelectComponent implements AfterViewInit, OnChanges {
  @Input() selected: DateTime = DateTime.now();
  @Input() data: { [key: string]: number } = {};
  @Output() dateSelected = new EventEmitter<DateTime>();
  @ViewChild('cal') cal: MatCalendar<DateTime>;

  header = DateSelectHeaderComponent;
  ready = false;

  constructor(
    private _adapter: DateAdapter<LuxonDateAdapter>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private translate: TranslateService
  ) {
    this.translate.onLangChange.subscribe((event) => {
      this.changeDatePickerLang(event.lang);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected']) {
      if (this.cal) {
        this.cal.activeDate = changes['selected'].currentValue as DateTime;
      }
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ready = true;
      this.dateClass = (cellDate, view) => {
        if (view === 'month') {
          if (cellDate) {
            const date = cellDate
              .startOf('day')
              .toUTC()
              .toISO({ suppressMilliseconds: true });
            const inData = date && this.data[date] > 0;

            return inData ? 'date-with-data' : '';
          }
        }

        return '';
      };
    }, 200);
  }

  changeDatePickerLang(locale: string) {
    this._locale = locale;
    this._adapter.setLocale(this._locale);
  }

  dateClass: MatCalendarCellClassFunction<DateTime> = () => '';

  handleDateChange(date: DateTime | null): void {
    if (date) {
      this.dateSelected.emit(date);
    }
  }
}
