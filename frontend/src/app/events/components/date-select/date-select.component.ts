import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output
} from '@angular/core';
import {
  MatCalendarCellClassFunction,
  MatCalendarView
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
export class DateSelectComponent implements AfterViewInit {
  @Input() selected: DateTime = DateTime.now();
  @Input() data: { [key: string]: number } = {};
  @Output() dateSelected = new EventEmitter<DateTime>();

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
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ready = true;
      this.dateClass = (cellDate, view) => {
        if (view === 'month') {
          if (cellDate) {
            const date = DateTime.utc(
              cellDate.year,
              cellDate.month,
              cellDate.day
            ).toISO();
            console.log('>>> DATE', date);
            console.log('>>> DATA', this.data);
            const inData = date && this.data[date] > 0;
            return inData ? 'date-with-data' : '';
          }
        }

        return '';
      };
    }, 0);
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

  handleViewChange(view: MatCalendarView): void {
    console.log('>>>> VIEW', view);
  }
}
