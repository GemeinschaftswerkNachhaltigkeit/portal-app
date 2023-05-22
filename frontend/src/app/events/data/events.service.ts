import { Injectable } from '@angular/core';
import EventDto from '../models/event-dto';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';
import { EventsApiService } from './events-api.service';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import SearchFilter from '../models/search-filter';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService
  ) {}

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
    this.searchFilters
      .pipe(
        switchMap((searchParams) => {
          return this.eventsApi.search(searchParams);
        })
      )
      .subscribe({
        next: (data: PagedResponse<EventDto>) => {
          this.eventsState.next(data);
        },
        error: (e) => {
          this.feedback.showFeedback(
            'error',
            this.translate.instant('errors.unkown')
          );
        }
      });
  }

  search(filters: SearchFilter): void {
    this.searchFilters.next(filters);
  }
}
