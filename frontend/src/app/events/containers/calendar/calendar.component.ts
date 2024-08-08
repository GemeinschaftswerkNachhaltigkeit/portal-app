import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { EventsService } from '../../data/events.service';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AdditionalFiltersData,
  AdditionalFiltersModalComponent
} from 'src/app/shared/components/form/filters/additional-filters-modal/additional-filters-modal.component';
import { SecondaryFilters } from 'src/app/shared/components/form/filters/secondary-filters/secondary-filters.component';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateTime } from 'luxon';
import { environment } from 'src/environments/environment';
import { FeaturesService } from 'src/app/shared/components/feature/features.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('marker') marker: ElementRef;
  unsubscribe$ = new Subject();

  events$ = this.eventsService.events$;
  groups$ = this.eventsService.groupedEvents$;
  availableEvents$ = this.eventsService.availableEvents$;
  paging$ = this.eventsService.eventsPaging$;
  loading$ = this.loader.isLoading$();

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
        this.eventsService.loadAvailableEvents(this.selected);
        this.triggerSearchOnQueryParamsChange();
      }
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
    this.eventsService.loadAvailableEvents(today, () => {
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
      use: this.includedFilters,
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
