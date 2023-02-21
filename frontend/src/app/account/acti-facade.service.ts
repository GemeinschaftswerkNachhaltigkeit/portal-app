import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ConfirmationService } from '../core/services/confirmation.service';
import { ActivityWIP } from '../shared/models/activity-wip';
import Activity from '../shared/models/actvitiy';
import Paging, {
  defaultPaginatorOptions,
  PageQuerParams
} from '../shared/models/paging';
import { LoadingService } from '../shared/services/loading.service';
import { ActivitesApiService } from './api/activites-api.service';
import { ActivityWipsApiService } from './api/activity-wips-api.service';
import ActivityIds from './models/activity-ids';
import { ActivitesStateService } from './state/activites-state.service';
import { ActivityWipStateService } from './state/activity-wip-state.service';

@Injectable({
  providedIn: 'root'
})
export class ActiFacadeService {
  constructor(
    private auth: AuthService,
    private loading: LoadingService,
    private activitiesApi: ActivitesApiService,
    private activityWipsApi: ActivityWipsApiService,
    private activitiesState: ActivitesStateService,
    private activityWipsState: ActivityWipStateService,
    private confirm: ConfirmationService,
    private translate: TranslateService,
    private router: Router
  ) {}

  // Activities

  get activities$(): Observable<Activity[]> {
    return this.activitiesState.activities$;
  }

  get activitiesPaging$(): Observable<Paging> {
    return this.activitiesState.activitiesPaging$;
  }

  get activityWips$(): Observable<ActivityWIP[]> {
    return this.activityWipsState.activitiyWips$;
  }

  get activityWipsPaging$(): Observable<Paging> {
    return this.activityWipsState.activityWipsPaging$;
  }

  openActivity(activity: Activity): void {
    this.router.navigate([
      '/',
      'organisations',
      activity.organisation?.id,
      activity.id
    ]);
  }

  hasFinishedOrga(): boolean {
    const user = this.auth.getUser();
    return !!user?.orgId;
  }

  loadActivities(): void {
    this.loading.start('load-actis');
    this.loading.start('load-actis-wips');
    this.loadActivitiesOfUser();
    this.loadActivityWipsOfUser();
  }

  async loadActivitiesOfUser(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize
    }
  ): Promise<void> {
    await this.auth.refreshToken();
    const user = this.auth.getUser();

    this.activitiesApi
      .activitiesOfCurrentUser(user, paging)
      .pipe(take(1))
      .subscribe({
        next: (pagedActivites) => {
          this.activitiesState.setActivitiesResponse(pagedActivites);
          this.loading.stop('load-actis');
        },
        error: () => {
          this.loading.stop('load-actis');
        }
      });
  }

  loadActivityWipsOfUser(
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize
    }
  ): void {
    const user = this.auth.getUser();
    this.activityWipsApi
      .activitiesWipsOfCurrentUser(user, paging)
      .pipe(take(1))
      .subscribe({
        next: (pagedActivityWips) => {
          this.activityWipsState.setActivityWipsResponse(pagedActivityWips);
          this.loading.stop('load-actis-wips');
        },
        error: () => {
          this.loading.stop('load-actis-wips');
        }
      });
  }

  createActivity() {
    const user = this.auth.getUser();
    this.activitiesApi
      .createActivity(user)
      .pipe(take(1))
      .subscribe({
        next: (ids) => this.openActivityWizard(ids)
      });
  }

  updateActivity(id?: number) {
    const user = this.auth.getUser();
    this.activitiesApi
      .updateActivity(user, id)
      .pipe(take(1))
      .subscribe({
        next: (ids) => this.openActivityWizard(ids)
      });
  }

  deleteActivity(id?: number): void {
    const ref = this.confirm.open({
      title: this.translate.instant('account.titles.deleteActivity'),
      description: this.translate.instant('account.texts.deleteActivity'),
      button: this.translate.instant('account.buttons.delete')
    });
    const user = this.auth.getUser();
    ref
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.activitiesApi
            .deleteActivity(user, id)
            .pipe(take(1))
            .subscribe({
              next: () => this.loadActivitiesOfUser()
            });
        }
      });
  }

  updateActivityWip(uuid?: string) {
    const user = this.auth.getUser();
    const orgaIdOfUser = user?.orgId;
    if (orgaIdOfUser && uuid) {
      this.openActivityWizard({
        orgaId: orgaIdOfUser,
        activityId: uuid || ''
      });
    }
  }

  deleteActivityWip(uuid?: string): void {
    const ref = this.confirm.open({
      title: this.translate.instant('account.titles.deleteActivity'),
      description: this.translate.instant('account.texts.deleteActivity'),
      button: this.translate.instant('account.buttons.delete')
    });
    const user = this.auth.getUser();
    ref
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.activityWipsApi
            .deleteActivityWip(user, uuid)
            .pipe(take(1))
            .subscribe({
              next: () => this.loadActivityWipsOfUser()
            });
        }
      });
  }

  changePage(page: number, size: number): void {
    this.loadActivitiesOfUser({ page: page, size: size });
  }

  changeWipsPage(page: number, size: number): void {
    this.loadActivityWipsOfUser({ page: page, size: size });
  }

  private openActivityWizard(ids: ActivityIds | null): void {
    if (ids && ids.activityId && ids.orgaId) {
      this.router.navigate([
        '/sign-up/activity/' + ids?.orgaId + '/' + ids?.activityId
      ]);
    }
  }
}
