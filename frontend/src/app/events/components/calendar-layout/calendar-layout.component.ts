import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calendar-layout',
  templateUrl: './calendar-layout.component.html',
  styleUrls: ['./calendar-layout.component.scss']
})
export class CalendarLayoutComponent {
  @Input() total!: number;
  @Input() loading: boolean | null = false;
}
