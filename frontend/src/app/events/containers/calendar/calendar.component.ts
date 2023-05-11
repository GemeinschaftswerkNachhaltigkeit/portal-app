import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  countFilters(): number {
    return 0;
  }

  clearAll(): void {
    //
  }

  openFilters(): void {
    //
  }
}
