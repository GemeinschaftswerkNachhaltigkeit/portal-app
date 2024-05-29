import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ConfirmationService } from '../core/services/confirmation.service';
import { DynamicFilters } from '../map/models/search-filter';
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
import { environment } from 'src/environments/environment';

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

  loadActivities(dan = false): void {
    this.loading.start('load-actis');
    this.loading.start('load-actis-wips');

    const filters: DynamicFilters = {};
    if (dan) {
      filters['dan'] = true;
    }
    this.loadActivitiesOfUser(filters);
    this.loadActivityWipsOfUser(filters);
  }

  async loadActivitiesOfUser(
    filters: DynamicFilters = {},
    paging: PageQuerParams = {
      size: defaultPaginatorOptions.pageSize,
      sort: 'period.end,desc'
    }
  ): Promise<void> {
    await this.auth.refreshToken();
    const user = this.auth.getUser();

    this.activitiesApi
      .activitiesOfCurrentUser(user, filters, paging)
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
      size: defaultPaginatorOptions.pageSize,
      sort: 'period.end,desc'
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

  createActivity(dan = false) {
    const user = this.auth.getUser();
    this.activitiesApi
      .createActivity(user, dan)
      .pipe(take(1))
      .subscribe({
        next: (ids) => this.openActivityWizard(ids, dan)
      });
  }

  updateActivity(id?: number, dan = false) {
    const user = this.auth.getUser();
    this.activitiesApi
      .updateActivity(user, id, dan)
      .pipe(take(1))
      .subscribe({
        next: (ids) => this.openActivityWizard(ids, dan, true)
      });
  }

  copyActivity(id?: number, dan = false) {
    const user = this.auth.getUser();
    this.activitiesApi
      .copyActivity(user, id, dan)
      .pipe(take(1))
      .subscribe({
        next: (ids) => this.openActivityWizard(ids, dan, true)
      });
  }

  deleteActivity(id?: number, dan = false): void {
    const ref = this.confirm.open({
      title: this.translate.instant(
        dan ? 'account.titles.deleteAction' : 'account.titles.deleteActivity'
      ),
      description: this.translate.instant(
        dan ? 'account.texts.deleteAction' : 'account.texts.deleteActivity'
      ),
      button: this.translate.instant('account.buttons.delete')
    });
    const user = this.auth.getUser();
    ref
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.activitiesApi
            .deleteActivity(user, id, dan)
            .pipe(take(1))
            .subscribe({
              next: () => this.loadActivities(dan)
            });
        }
      });
  }

  updateActivityWip(uuid?: string, dan = false) {
    const user = this.auth.getUser();
    let orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      orgaIdOfUser = environment.danId;
    }
    if (orgaIdOfUser !== undefined && orgaIdOfUser !== null && uuid) {
      this.openActivityWizard(
        {
          orgaId: orgaIdOfUser,
          activityId: uuid || ''
        },
        dan,
        true
      );
    }
  }

  deleteActivityWip(uuid?: string, dan = false): void {
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
            .deleteActivityWip(user, uuid, dan)
            .pipe(take(1))
            .subscribe({
              next: () => this.loadActivities(dan)
            });
        }
      });
  }

  changePage(page: number, size: number, dan = false): void {
    const filters: DynamicFilters = { page: page, size: size };
    if (dan) {
      filters['dan'] = true;
    }
    this.loadActivitiesOfUser(filters);
  }

  changeWipsPage(page: number, size: number): void {
    this.loadActivityWipsOfUser({ page: page, size: size });
  }

  private openActivityWizard(
    ids: ActivityIds | null,
    dan = false,
    edit = false
  ): void {
    const urlPrefix = dan ? '/dan/' : '/sign-up/activity/';
    if (
      ids &&
      ids.activityId &&
      ids.orgaId !== undefined &&
      ids.orgaId !== null
    ) {
      this.router.navigate([urlPrefix + ids?.orgaId + '/' + ids?.activityId], {
        queryParams: { edit }
      });
    }
  }
}
