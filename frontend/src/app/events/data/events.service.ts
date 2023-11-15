import { Injectable } from '@angular/core';
import EventDto from '../models/event-dto';
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  switchMap,
  take
} from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging, { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { EventsApiService } from './events-api.service';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import SearchFilter, { DynamicFilters } from '../models/search-filter';
import { TranslateService } from '@ngx-translate/core';
import { PersistFiltersService } from 'src/app/shared/services/persist-filters.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { DateTime } from 'luxon';
import { RegisterOrLoginService } from 'src/app/core/services/register-or-login.service.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FeatureService } from 'src/app/shared/components/feature/feature.service';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';

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
  private availableEventsState = new BehaviorSubject<{
    [key: string]: number;
  } | null>(null);
  initialized = false;

  constructor(
    private eventsApi: EventsApiService,
    private feedback: FeedbackService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private loader: LoadingService,
    private persistFilters: PersistFiltersService,
    private registerOrLogin: RegisterOrLoginService,
    private router: Router,
    private auth: AuthService,
    private feature: FeatureService,
    private lp: LandingpageService
  ) {
    this.triggerSearchOnQueryParamsChange();
    this.triggerNewEventRedirect();

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

  get availableEvents$(): Observable<{ [key: string]: number } | null> {
    return this.availableEventsState.asObservable();
  }

  get events$(): Observable<EventDto[]> {
    return this.eventsState.asObservable();
  }

  get groupedEvents$(): Observable<{ group: string; list: EventDto[] }[]> {
    return this.eventsState.asObservable().pipe(
      map((events: EventDto[]) => {
        const groups: { [date: string]: EventDto[] } = {};
        events.forEach((e) => {
          const start = e.period?.start;
          let day: string = 'undefined';
          if (start) {
            day = DateTime.fromISO(start).toISODate() || '';
          }

          if (!groups[day]) groups[day] = [];
          groups[day].push(e);
        });
        return Object.entries(groups).map((e) => {
          return {
            group: e[0],
            list: e[1]
          };
        });
      })
    );
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

  loadAvailableEvents(month: DateTime, cb?: () => void): void {
    this.eventsApi
      .getDates(month)
      .pipe(take(1))
      .subscribe({
        next: (dates) => {
          this.availableEventsState.next(dates);
          if (cb) cb();
        },
        error: (e) => {
          console.log(e);
        }
      });
  }

  searchValuesChanged(query: string, location: string) {
    const existingFilters = this.getFilters();
    return (
      query !== existingFilters['query'] ||
      location !== existingFilters['location']
    );
  }

  search(searchFilter: DynamicFilters): void {
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
    this.persistFilters.setFiltersToUrl({});
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
    return this.persistFilters.getFiltersFromUrl(['thematicFocus']);
  }

  addNewEvent(): void {
    if (this.auth.isLoggedIn()) {
      this.finalizeAddNewEvent();
    } else {
      this.registerOrLogin.open({
        title: this.translate.instant('events.titles.addLoginModal'),
        subtitle: this.translate.instant('events.texts.addLoginModal'),
        next: `${this.router.url}?add=true`
      });
    }
  }

  addNewAction(): void {
    if (this.auth.isLoggedIn() && this.feature.showSync('dan-account')) {
      this.router.navigate(['/', 'account', 'dan-activities']);
    } else {
      window.open(this.lp.getDanUrl() + '#mitmachen', '_blank');
    }
  }

  private finalizeAddNewEvent(): void {
    const hasOrga = this.auth.userHasOrga();
    if (hasOrga) {
      this.router.navigate(['/', 'account', 'activities']);
    }
    if (!hasOrga) {
      this.router.navigate(['/', 'account']);
    }
  }

  private triggerNewEventRedirect(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const params = this.route.snapshot.queryParams;
        if (params['add']) {
          this.finalizeAddNewEvent();
        }
      });
  }
}
