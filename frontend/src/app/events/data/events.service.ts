import { Injectable } from '@angular/core';
import EventDto from '../models/event-dto';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';
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

  constructor(
    private eventsApi: EventsApiService,
    private feedback: FeedbackService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private loader: LoadingService,
    private persistFilters: PersistFiltersService
  ) {
    this.triggerSearchOnQueryParamsChange();
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

  init(): void {
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

  search(searchFilter: SearchFilter): void {
    this.fitlersChanged = true;
    this.nextPage = 0;
    this.eventsState.next([]);
    const existingFilters = this.getFilters();
    const filters = {
      ...existingFilters,
      ...searchFilter
    };
    this.persistFilters.setFiltersToUrl(filters);
  }

  loadMore(): void {
    this.loadNextPage();
  }

  private loadNextPage(): void {
    if (!this.fitlersChanged) {
      const pageInfo = this.pagedEventsState.value;
      const itemsPerPage = 15; //defaultPaginatorOptions.pageSize
      const total = pageInfo.totalElements ?? 0;
      const nextPage = this.nextPage + 1;
      const hasItemsLeft = total - itemsPerPage * nextPage > 0;
      console.log('has items left', total, nextPage, hasItemsLeft);
      if (hasItemsLeft) {
        this.nextPage = nextPage;
        const filters = this.getFilters();
        this.searchFilters.next(filters);
      }
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

  private getFilters(): DynamicFilters {
    return this.persistFilters.getFiltersFromUrl([
      'thematicFocus',
      'offerCat',
      'bestPractiseCat'
    ]);
  }
}
