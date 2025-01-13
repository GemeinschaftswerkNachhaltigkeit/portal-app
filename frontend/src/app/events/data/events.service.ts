import { computed, inject, Injectable, signal } from '@angular/core';
import EventDto from '../models/event-dto';
import {
  EMPTY,
  catchError,
  filter,
  switchMap,
  take,
  tap
} from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { EventsApiService } from './events-api.service';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import SearchFilter, { DynamicFilters } from '../models/search-filter';
import { TranslateService } from '@ngx-translate/core';
import { PersistFiltersService } from 'src/app/shared/services/persist-filters.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { RegisterOrLoginService } from 'src/app/shared/services/register-or-login.service.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FeatureService } from 'src/app/shared/components/feature/feature.service';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

export type EventCalenderEntry = { count: number; inDanPeriod: boolean };

type AvailableEvents = {
  [key: string]: EventCalenderEntry;
} | null

interface EventState{
  filters: SearchFilter,
  pagedEvents: PagedResponse<EventDto> | null,
  events: EventDto[],
  availableEvents: AvailableEvents,
  currentCalenderMonth: DateTime,
  loading: boolean,
  filtersChanged: boolean,
  nextPage: number
  initialized: boolean
}


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private api = inject(EventsApiService)
  private feedback = inject(FeedbackService)
  private translate = inject(TranslateService)
  private route = inject(ActivatedRoute)
  private persistFilters = inject(PersistFiltersService)
  private registerOrLogin = inject(RegisterOrLoginService)
  private router = inject(Router)
  private auth = inject(AuthService)
  private feature = inject(FeatureService)
  private lp = inject(LandingpageService)

  // state
  private state = signal<EventState>({
    filters: {},
    pagedEvents: null,
    events: [],
    availableEvents: null,
    currentCalenderMonth: DateTime.now().startOf('month'),
    loading: false,
    filtersChanged: false,
    nextPage: 0,
    initialized: false
  })


  // selectors

  readonly filters = computed(() => this.state().filters)
  readonly filtersChanged = computed(() => this.state().filtersChanged)
  readonly loading = computed(() => this.state().loading)
  readonly nextPage = computed(() => this.state().nextPage)
  readonly currentMonth = computed(() => this.state().currentCalenderMonth)
  readonly events = computed(() => this.state().events)
  readonly availableEvents = computed(() => this.state().availableEvents)
  readonly initialized = computed(() => this.state().availableEvents)
  readonly currentMonthOfCalendar = computed(() => this.state().currentCalenderMonth)
  readonly groupedEvents = computed(() => {
    const groups: { [date: string]: EventDto[] } = {};
    this.events().forEach((e) => {
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
  readonly eventsPaging = computed(() => ({
    number: this.state().pagedEvents?.number,
    size: this.state().pagedEvents?.size,
    totalElements: this.state().pagedEvents?.totalElements,
    totalPages: this.state().pagedEvents?.totalPages
  }))

  constructor(
   
  ) {
    this.triggerNewEventRedirect();
    this.searchEventsOnFilterChange();
    this.featchAvailableEventsOnFilterChange();
  }

  // actions

  private startLoading() {
    this.state.update((state) => ({
      ...state,
      loading: true
    }));
  }

  private stopLoading() {
    this.state.update((state) => ({
      ...state,
      loading: false
    }));
  }

  private setSearchResults(response: PagedResponse<EventDto> | null) {
    this.state.update((state) => ({
      ...state,
      pagedEvents: response,
      events: [...state.events, ...response?.content || []],
      loading: false
    }));
  }

  private setAvailableEvents(events: AvailableEvents) {
    this.state.update((state) => ({
      ...state,
      availableEvents: events
    }));
  }

  private setFilterChanged(changed: boolean) {
    this.state.update((state) => ({
      ...state,
      filtersChanged: changed
    }));
  }

  private setInitialized(init: boolean) {
    this.state.update((state) => ({
      ...state,
      initialized: init
    }));
  }

  private setNextPage(page: number) {
    this.state.update((state) => ({
      ...state,
      nextPage: page
    }));
  }

  private setError(err: HttpErrorResponse) {
    this.state.update((state) => ({
      ...state,
      error: {
        message: this.getErrorMessage(err),
        status: err.status
      },
      loading: false
    }));
    return EMPTY;
  }

  resetState() {
    this.state.update((state) => ({
      ...state,
      pagedEvents: null,
      events: [],
      filtersChanged: false,
      nextPage: 0,
    }));
  }

  reset(): void {
    this.resetState();
    this.persistFilters.setFiltersToUrl({});
  }

  setFilterState(filters: SearchFilter) {
    this.state.update(state => ({
      ...state,
      filters: filters
    }))
  }

  setFilters() {
    const filters = this.getFilters();
    this.state.update(state => ({
      ...state,
      filters: filters
    }))
  }

  triggerSearch(): void {
    if (this.initialized()) {
      this.reset();
      this.setFilterState({})
    }
  }

  setCurrentMonthOfCalendar(month: DateTime): void {
    this.state.update((state) => ({
      ...state,
      currentCalenderMonth: month.startOf('month')
    }));
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
    if (!this.filtersChanged() && this.events().length > 0) {
      const pageInfo = this.eventsPaging();
      const itemsPerPage = defaultPaginatorOptions.pageSize;
      const total = pageInfo.totalElements ?? 0;
      const nextPage = this.nextPage() + 1;
      const hasItemsLeft = total - itemsPerPage * nextPage > 0;
      if (hasItemsLeft) {
        this.setNextPage(nextPage)
        const filters = this.getFilters();
        this.setFilterState(filters)
      }
    }
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

  

  // async
  private searchEventsOnFilterChange() {
    toObservable(this.filters)
      .pipe(
        tap(() => this.startLoading()),
        
        switchMap((filters) => this.api.search(filters, this.nextPage())),
        takeUntilDestroyed(),
        catchError((err) => {
          this.setFilterChanged(false)
          this.feedback.showFeedback(
            'error',
            this.translate.instant('errors.unkown')
          );
          return this.setError(err)
        })
      )
      .subscribe((response) => {
        this.setSearchResults(response);
        this.setInitialized(true);
        this.setFilterChanged(true);
      });
  }

  private featchAvailableEventsOnFilterChange() {
    toObservable(this.filters)
      .pipe(
        tap(() => this.loadAvailableEvents()),
        
        takeUntilDestroyed(),
        catchError(err => EMPTY)
      )
      .subscribe(() => {});
  }

  loadAvailableEvents(cb?: () => void): void {
    this.api
      .getDates(this.currentMonth(), this.getFilters())
      .pipe(take(1))
      .subscribe((dates) => {
        const entries = Object.entries(dates).reduce(
          (
            entries: { [key: string]: EventCalenderEntry },
            [date, count]: [string, number]
          ) => {
            const inDanPeriod = this.inDanPeriod(DateTime.fromISO(date));
            entries[date] = { count, inDanPeriod };
            return entries;
          },
          {}
        );
        this.setAvailableEvents(entries)
        if (cb) cb();
      });
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

  // helpers

  searchValuesChanged(query: string, location: string) {
    const existingFilters = this.getFilters();
    return (
      query !== existingFilters['query'] ||
      location !== existingFilters['location']
    );
  }

  getFilters(): DynamicFilters {
    return this.persistFilters.getFiltersFromUrl(['thematicFocus']);
  }

  private getErrorMessage(err: HttpErrorResponse): string {
    console.log(err);
    return '';
  }

  private inDanPeriod(date: DateTime): boolean {
    const feature = this.feature.getFeature('dan-range');

    if (!feature || !feature.start || !feature.end) return false;
    const featureStart = DateTime.fromISO(feature.start).startOf('day');
    const featureEnd = DateTime.fromISO(feature.end).startOf('day');
    const inDanPeriod = featureStart <= date && featureEnd >= date;
    return inDanPeriod;
  }
}
