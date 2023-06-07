import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { DateTime } from 'luxon';
import EventDto from '../../models/event-dto';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data-select',
  templateUrl: './data-select.component.html',
  styleUrls: ['./data-select.component.scss']
})
export class DataSelectComponent implements AfterViewInit {
  @Input() selected: DateTime = DateTime.now();
  @Input() data: EventDto[] = [];
  @Output() dateSelected = new EventEmitter<DateTime>();

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
        console.log('>>>>>>>>>>> TEST', this.data);
        if (view === 'month') {
          if (cellDate) {
            const date = cellDate.day;
            const inData = this.data.find((d) => {
              const start = DateTime.fromISO(d.period?.start || '');
              console.log('>>>>>>>>>>>>> start day', start.day);
              console.log('>>>>>>>>>>>>> date', date);

              return start.day === date;
            });
            console.log('IN DATA', inData);
            // Highlight the 1st and 20th day of each month.
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
}
