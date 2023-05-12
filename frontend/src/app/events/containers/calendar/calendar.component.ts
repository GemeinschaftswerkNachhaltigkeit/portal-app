import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  query = '';
  location = '';

  handleSearchValueChanged({
    query,
    location
  }: {
    query: string;
    location: string;
  }): void {
    this.query = query;
    this.location = location;
  }

  handleSearch(query: string): void {
    // this.marketplaceFacade.search({ query: query });
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
}
