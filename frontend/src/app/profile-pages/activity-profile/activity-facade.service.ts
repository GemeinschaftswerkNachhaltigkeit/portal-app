import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import Activity from '../../shared/models/actvitiy';
import { ActivityApiService } from './api/activity-api.service';
import { ActivityStateService } from './state/activity-state.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityFacadeService {
  constructor(
    private activityApi: ActivityApiService,
    private activityState: ActivityStateService,
    private loading: LoadingService
  ) {}

  get activity$(): Observable<Activity | null> {
    return this.activityState.activity;
  }

  get activityData(): Activity | null {
    return this.activityState.activityData;
  }

  getById(id: number): void {
    this.activityState.setActivity(null);
    const loadingId = this.loading.start();
    this.activityApi
      .byId(id)
      .pipe(take(1))
      .subscribe({
        next: (activity: Activity) => {
          this.activityState.setActivity(activity);
          this.loading.stop(loadingId);
        },
        error: () => {
          this.loading.stop(loadingId);
        }
      });
  }
}
