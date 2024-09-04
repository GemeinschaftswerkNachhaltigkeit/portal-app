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
import { EventCalenderEntry } from '../../data/events.service';

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.scss']
})
export class DateSelectComponent implements AfterViewInit, OnChanges {
  @Input() selected: DateTime = DateTime.now();
  @Input() data: { [key: string]: EventCalenderEntry } = {};
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
    setTimeout(() => {
      this.addClasses();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.addClasses();
    });
  }

  addClasses(): void {
    const cells = document.querySelectorAll('.mat-calendar-body-cell');
    const newData: { [key: string]: EventCalenderEntry } = {};
    for (const key of Object.keys(this.data)) {
      const index = DateTime.fromISO(key).get('day') + '';
      newData[index] = this.data[key];
    }

    cells.forEach((cell) => {
      cell.classList.remove('date-with-data');
      cell.classList.remove('dan');
      const cellContent = cell.querySelector(
        '.mat-calendar-body-cell-content'
      ) as HTMLElement;
      if (cellContent) {
        const cellData = newData[cellContent.innerText];
        if (cellData) {
          cell.classList.add('date-with-data');
          if (cellData.inDanPeriod) {
            cell.classList.add('dan');
          }
        }
      }
    });
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
