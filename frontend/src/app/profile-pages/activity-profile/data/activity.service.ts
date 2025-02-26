import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, Subject, switchMap, tap } from 'rxjs';
import Activity from '../../../shared/models/actvitiy';
import { ActivityApiService } from './activity-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ActivityProflieState {
  activity: Activity | null;
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private api = inject(ActivityApiService);

  // state
  private state = signal<ActivityProflieState>({
    activity: null,
    loading: false
  });

  // signals
  private fetchActivity$ = new Subject<number>();

  constructor() {
    this.fetchActivityById();
  }

  // selectors
  readonly activity = computed(() => this.state().activity);
  readonly loading = computed(() => this.state().loading);
  // actions

  setActivity(activity: Activity | null): void {
    this.state.update((state) => ({
      ...state,
      activity: activity
    }));
  }

  getActivityById(id: number) {
    this.fetchActivity$.next(id);
  }

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

  // async

  fetchActivityById() {
    this.fetchActivity$
      .pipe(
        tap(() => this.startLoading()),
        switchMap((id) => this.api.byId(id)),
        takeUntilDestroyed(),
        catchError((err) => {
          console.log(err);
          this.stopLoading();
          return EMPTY;
        })
      )
      .subscribe((activity) => {
        this.stopLoading();
        this.setActivity(activity);
      });
  }
}
