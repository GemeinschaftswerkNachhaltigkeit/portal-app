import { Injectable } from '@angular/core';
import EventDto from '../models/event-dto';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging, { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { EventsApiService } from './events-api.service';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import SearchFilter, { DynamicFilters } from '../models/search-filter';
import { TranslateService } from '@ngx-translate/core';
import { PersistFiltersService } from 'src/app/shared/services/persist-filters.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private nextPage = 0;
  private fitlersChanged = false;
  private searchFilters = new BehaviorSubject<SearchFilter>({});
  private pagedEventsState = new BehaviorSubject<PagedResponse<EventDto>>({
    content: []
  });
  private eventsState = new BehaviorSubject<EventDto[]>([]);
  initialized = false;

  constructor(
    private eventsApi: EventsApiService,
    private feedback: FeedbackService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private loader: LoadingService,
    private persistFilters: PersistFiltersService
  ) {
    this.triggerSearchOnQueryParamsChange();

    this.searchFilters
      .pipe(
        switchMap((searchParams) => {
          this.loader.start('load-events');
          return this.eventsApi.search(searchParams, this.nextPage);
        })
      )
      .subscribe({
        next: (data: PagedResponse<EventDto>) => {
          this.loader.stop('load-events');
          this.initialized = true;
          this.updateState(data);
          this.fitlersChanged = false;
        },
        error: () => {
          this.fitlersChanged = false;
          this.loader.stop('load-events');
          this.feedback.showFeedback(
            'error',
            this.translate.instant('errors.unkown')
          );
        }
      });
  }

  get events$(): Observable<EventDto[]> {
    return this.eventsState.asObservable();
  }

  get eventsPaging$(): Observable<Paging> {
    return this.pagedEventsState.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  search(searchFilter: SearchFilter): void {
    this.reset();
    const existingFilters = this.getFilters();
    const filters = {
      ...existingFilters,
      ...searchFilter
    };
    this.persistFilters.setFiltersToUrl(filters);
  }

  loadMore(): void {
    if (!this.fitlersChanged && this.eventsState.value.length > 0) {
      const pageInfo = this.pagedEventsState.value;
      const itemsPerPage = defaultPaginatorOptions.pageSize;
      const total = pageInfo.totalElements ?? 0;
      const nextPage = this.nextPage + 1;
      const hasItemsLeft = total - itemsPerPage * nextPage > 0;
      if (hasItemsLeft) {
        this.nextPage = nextPage;
        const filters = this.getFilters();
        this.searchFilters.next(filters);
      }
    }
  }

  reset(): void {
    this.fitlersChanged = true;
    this.nextPage = 0;
    this.eventsState.next([]);
    this.pagedEventsState.next({ content: [] });
  }

  triggerSearch(): void {
    if (this.initialized) {
      this.reset();
      this.searchFilters.next({});
    }
  }

  private updateState(data: PagedResponse<EventDto>): void {
    this.pagedEventsState.next(data);
    this.eventsState.next([...this.eventsState.value, ...data.content]);
  }

  private triggerSearchOnQueryParamsChange(): void {
    this.route.queryParamMap.subscribe(() => {
      const filters = this.getFilters();
      this.searchFilters.next(filters);
    });
  }

  getFilters(): DynamicFilters {
    return this.persistFilters.getFiltersFromUrl([
      'thematicFocus',
      'offerCat',
      'bestPractiseCat'
    ]);
  }
}
