import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
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
import {
  AdditionalFiltersData,
  AdditionalFiltersModalComponent
} from 'src/app/shared/components/form/filters/additional-filters-modal/additional-filters-modal.component';
import { SecondaryFilters } from 'src/app/shared/components/form/filters/secondary-filters/secondary-filters.component';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import { Subject, takeUntil } from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateTime } from 'luxon';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('marker') marker: ElementRef;
  unsubscribe$ = new Subject();

  events$ = this.eventsService.events$;
  availableEvents$ = this.eventsService.availableEvents$;
  paging$ = this.eventsService.eventsPaging$;
  loading$ = this.loader.isLoading$();

  selected: DateTime = DateTime.now();
  dateControl = new FormControl('');
  searchControl = new FormControl({ query: '', location: '' });
  onlyOnlineControl = new FormControl(false);
  includedFilters: SecondaryFilters[] = [
    SecondaryFilters.ONLINE,
    SecondaryFilters.THEMATIC_FOCUS
  ];

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
    private lp: LandingpageService,
    public translate: TranslateService,
    public dialog: MatDialog,
    private _adapter: DateAdapter<LuxonDateAdapter>,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this.handleOnlyOnlineChange();
    this.translate.onLangChange.subscribe((event) => {
      this.changeDatePickerLang(event.lang);
    });
  }

  changeDatePickerLang(locale: string) {
    this._locale = locale;
    this._adapter.setLocale(this._locale);
  }

  handleDateChange(date: DateTime): void {
    this.selected = date;
    this.eventsService.search({ startDate: date.toISO() || '' });
  }

  handleSearch(): void {
    const vals = this.searchControl.value;
    this.eventsService.search({
      query: vals?.query || '',
      location: vals?.location || ''
    });
  }

  handlePermanentFilter(isPermanent: boolean): void {
    this.eventsService.search({
      permanent: isPermanent
    });
  }

  handleLoadMore(): void {
    this.eventsService.loadMore();
  }

  handleOnlyOnlineChange(): void {
    this.onlyOnlineControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: boolean | null) => {
        this.eventsService.search({
          online: !!value
        });
      });
  }

  handleOpen({ orgaId, actiId }: { orgaId: number; actiId: number }): void {
    this.router.navigate(['/', 'organisations', orgaId, actiId]);
  }

  handleAddNewEvent(): void {
    this.eventsService.addNewEvent();
  }

  getActionDaysUrl(): string {
    return this.lp.getDanUrl();
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

  isPermanent(): boolean {
    return !!this.eventsService.getFilters()['permanent'];
  }

  handleFiltersChanged(filters: AdditionalFilters): void {
    this.eventsService.search(filters);
  }

  getFilterData(): AdditionalFiltersData {
    const filters: AdditionalFilters = this.eventsService.getFilters();

    return {
      use: this.includedFilters,
      selectedThematicFocusValues: filters['thematicFocus'],
      online: filters['online']
    };
  }

  countFilters(): number {
    const filters: AdditionalFilters = this.eventsService.getFilters();

    let count = 0;
    const tf = filters['thematicFocus'] || [];
    count = count + (tf ? tf.length + count : 0);
    count = filters['online'] ? count + 1 : count;
    return count;
  }

  clearAll(): void {
    this.eventsService.reset();
  }

  openFilters(): void {
    const dialogRef = this.dialog.open(AdditionalFiltersModalComponent, {
      width: '800px',
      data: this.getFilterData()
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventsService.search(result);
      }
    });
  }

  ngOnInit(): void {
    this.eventsService.triggerSearch();
    const filters = this.eventsService.getFilters();
    this.searchControl.setValue({
      query: (filters['query'] || '') as string,
      location: (filters['location'] || '') as string
    });

    const start = (filters['startDate'] as string) || '';
    if (start) {
      this.selected = DateTime.fromISO(start);
    }
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.marker.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.marker.nativeElement);
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
