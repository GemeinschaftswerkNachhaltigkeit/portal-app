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
  private searchFilters = new BehaviorSubject<SearchFilter>({});
  private eventsState = new BehaviorSubject<PagedResponse<EventDto>>({
    content: []
  });

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
    return this.eventsState
      .asObservable()
      .pipe(map((response) => response.content));
  }

  get eventsPaging$(): Observable<Paging> {
    return this.eventsState.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  init(): void {
    this.loader.start('load-events');
    this.searchFilters
      .pipe(
        switchMap((searchParams) => {
          return this.eventsApi.search(searchParams);
        })
      )
      .subscribe({
        next: (data: PagedResponse<EventDto>) => {
          this.loader.stop('load-events');
          this.eventsState.next(data);
        },
        error: () => {
          this.loader.stop('load-events');
          this.feedback.showFeedback(
            'error',
            this.translate.instant('errors.unkown')
          );
        }
      });
  }

  search(searchFilter: SearchFilter): void {
    const existingFilters = this.getFilters();
    const filters = {
      ...existingFilters,
      ...searchFilter
    };
    this.persistFilters.setFiltersToUrl(filters);
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
