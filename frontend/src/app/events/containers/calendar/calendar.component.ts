import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { EventsService } from '../../data/events.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AdditionalFiltersData,
  AdditionalFiltersModalComponent
} from 'src/app/shared/components/form/filters/additional-filters-modal.component';
import {
  SecondaryFilters,
  SecondaryFiltersComponent
} from 'src/app/shared/components/form/filters/secondary-filters.component';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateTime } from 'luxon';
import { environment } from 'src/environments/environment';
import { FeaturesService } from 'src/app/shared/components/feature/features.service';
import { CommonModule } from '@angular/common';
import { CalendarLayoutComponent } from '../../components/calendar-layout.component';
import { FilterModalButtonComponent } from 'src/app/shared/components/form/filters/filter-modal-button.component';
import { SearchControlsComponent } from '../../components/search-controls.component';
import { EventListComponent } from '../../components/event-list.component';
import { EventComponent } from '../../components/event.component';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { AlertComponent } from 'src/app/shared/components/base/alert.component';
import { FilterSidebarComponent } from '../../components/filter-sidebar.component';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { MatButtonModule } from '@angular/material/button';
import { DateSelectComponent } from '../../components/date-select.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarLayoutComponent,
    TranslateModule,
    FilterModalButtonComponent,
    SearchControlsComponent,
    EventListComponent,
    EventComponent,
    LoadingIndicatorComponent,
    AlertComponent,
    FilterSidebarComponent,
    HeadingComponent,
    SecondaryFiltersComponent,
    MatButtonModule,
    DateSelectComponent,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('marker') marker: ElementRef;
  unsubscribe$ = new Subject();

  events = this.eventsService.events;
  groups = this.eventsService.groupedEvents;
  availableEvents = this.eventsService.availableEvents;
  paging = this.eventsService.eventsPaging;
  loading = this.eventsService.loading;

  selected: DateTime = DateTime.now();
  dateControl = new FormControl('');
  searchControl = new FormControl({ query: '', location: '' });
  onlyOnlineControl = new FormControl(false);
  includedFilters: SecondaryFilters[] = [
    SecondaryFilters.ONLINE,
    SecondaryFilters.ONLY_DAN,
    SecondaryFilters.THEMATIC_FOCUS
  ];
  featureState = this.features.featuresState;

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
    private route: ActivatedRoute,
    public translate: TranslateService,
    public dialog: MatDialog,
    private _adapter: DateAdapter<LuxonDateAdapter>,
    private features: FeaturesService,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this.handleOnlyOnlineChange();
    this.translate.onLangChange.subscribe((event) => {
      this.changeDatePickerLang(event.lang);
    });

    effect(() => {
      if (this.featureState() !== 'PENDING') {
        const filters = this.eventsService.getFilters();
        this.searchControl.setValue({
          query: (filters['query'] || '') as string,
          location: (filters['location'] || '') as string
        });
        const start = (filters['startDate'] as string) || '';
        this.selected = start ? DateTime.fromISO(start) : DateTime.now();
        this.eventsService.setCurrentMonthOfCalendar(this.selected);
        this.triggerSearchOnQueryParamsChange();
      }
    }, {
      allowSignalWrites: true
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
  handleToday(): void {
    const today = DateTime.now().startOf('day');
    const month = DateTime.now().startOf('month');
    this.eventsService.setCurrentMonthOfCalendar(month);
    this.eventsService.loadAvailableEvents(() => {
      this.selected = today;
      this.eventsService.search({ startDate: this.selected.toISO() || '' });
    });
  }

  handleSearch(): void {
    const vals = this.searchControl.value;
    const query = vals?.query || '';
    const location = vals?.location || '';
    if (this.eventsService.searchValuesChanged(query, location)) {
      this.eventsService.search({
        query,
        location
      });
    }
  }

  handlePermanentFilter(isPermanent: boolean): void {
    this.eventsService.search({
      permanent: isPermanent,
      onlyDan: false
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
    if (orgaId !== undefined && orgaId !== null && actiId) {
      window.open(
        environment.contextPath + `organisations/${orgaId}/${actiId}`,
        '_blank'
      );
    }
  }

  handleAddNewEvent(): void {
    this.eventsService.addNewEvent();
  }

  handleNewActionDay(): void {
    this.eventsService.addNewAction();
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
      use: this.includedFilters.filter((f) => {
        if (this.isPermanent() && f === SecondaryFilters.ONLY_DAN) {
          return false;
        }
        return true;
      }),
      selectedThematicFocusValues: filters['thematicFocus'],
      online: filters['online'],
      onlyDan: filters['onlyDan']
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
    this.searchControl.setValue({ query: '', location: '' });
    this.selected = DateTime.now();
    this.eventsService.setCurrentMonthOfCalendar(this.selected);
    this.eventsService.triggerSearch();
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

  private triggerSearchOnQueryParamsChange(): void {
    this.route.queryParamMap.subscribe(() => {
      this.eventsService.setFilters();
    });
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.marker.nativeElement);
  }

  ngOnDestroy(): void {
    this.eventsService.resetState();
    this.observer.unobserve(this.marker.nativeElement);
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
