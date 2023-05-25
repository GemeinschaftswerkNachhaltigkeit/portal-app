import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { EventsService } from '../../data/events.service';
import EventDto from '../../models/event-dto';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AdditionalFiltersData } from 'src/app/shared/components/form/filters/additional-filters-modal/additional-filters-modal.component';
import { SecondaryFilters } from 'src/app/shared/components/form/filters/secondary-filters/secondary-filters.component';
import AdditionalFilters from 'src/app/shared/models/additional-filters';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('marker') marker: ElementRef;

  events$ = this.eventsService.events$;
  paging$ = this.eventsService.eventsPaging$;
  loading$ = this.loader.isLoading$();

  searchControl = new FormControl({ query: '', location: '' });

  includedFilters: SecondaryFilters[] = [SecondaryFilters.THEMATIC_FOCUS];

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

  constructor(
    private eventsService: EventsService,
    private loader: LoadingService,
    private router: Router,
    public translate: TranslateService
  ) {}

  handleSearch(): void {
    const vals = this.searchControl.value;
    this.eventsService.search({
      query: vals?.query || '',
      location: vals?.location || ''
    });
  }

  handleLoadMore(): void {
    this.eventsService.loadMore();
  }

  handleOpen({ orgaId, actiId }: { orgaId: number; actiId: number }): void {
    this.router.navigate(['/', 'organisations', orgaId, actiId]);
  }

  groupEventsByDate(events: EventDto[]): [string, EventDto[]][] {
    const groups: { [date: string]: EventDto[] } = {};
    events.forEach((e) => {
      const start = e.period?.start || 'undefined';

      if (!groups[start]) groups[start] = [];
      groups[start].push(e);
    });
    return Object.entries(groups);
  }

  handleFiltersChanged(filters: AdditionalFilters): void {
    console.log('>>>> FILTER', filters);
    this.eventsService.search(filters);
  }

  getFilterData(): AdditionalFiltersData {
    const filters: AdditionalFilters = this.eventsService.getFilters();

    return {
      use: this.includedFilters,
      selectedThematicFocusValues: filters['thematicFocus']
    };
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
    this.eventsService.triggerSearch();
    const filters = this.eventsService.getFilters();
    this.searchControl.setValue({
      query: (filters['query'] || '') as string,
      location: (filters['location'] || '') as string
    });
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.marker.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.marker.nativeElement);
  }
}
