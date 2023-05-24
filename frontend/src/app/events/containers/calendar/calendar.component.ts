import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { EventsService } from '../../data/events.service';
import { SearchFields } from '../../components/search-input/search-controls.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('marker') marker: ElementRef;

  query = '';
  location = '';
  events$ = this.eventsService.events$;
  paging$ = this.eventsService.eventsPaging$;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          this.handleLoadMore();
        }
      });
    },
    {
      root: document.querySelector('.mat-drawer-content'),
      rootMargin: '100px'
    }
  );

  constructor(private eventsService: EventsService) {}

  handleSearch({ query, location }: SearchFields): void {
    this.eventsService.search({
      query: query,
      location: location
    });
  }

  handleLoadMore(): void {
    this.eventsService.loadMore();
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

  ngAfterViewInit(): void {
    this.observer.observe(this.marker.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.marker.nativeElement);
  }
}
