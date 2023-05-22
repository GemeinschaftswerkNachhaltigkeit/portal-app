import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../data/events.service';
import { SearchFields } from '../../components/search-input/search-controls.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  query = '';
  location = '';

  events$ = this.eventsService.events$;
  paging$ = this.eventsService.eventsPaging$;

  constructor(private eventsService: EventsService) {}

  handleSearch({ query, location }: SearchFields): void {
    this.eventsService.search({
      query: query,
      location: location
    });
  }

  countFilters(): number {
    return 0;
  }

  clearAll(): void {
    //
  }

  openFilters(): void {
    //
  }

  ngOnInit(): void {
    this.eventsService.init();
  }
}
