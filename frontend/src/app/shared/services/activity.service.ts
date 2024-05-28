import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, ReplaySubject } from 'rxjs';
import { UserPermission, UserRole } from 'src/app/auth/models/user-role';
import { AuthService } from 'src/app/auth/services/auth.service';

import { environment } from 'src/environments/environment';
import { ActivityWIP } from '../models/activity-wip';
import { ImageType } from '../models/image-type';
import { StepState } from '../../sign-up/models/step-state';
import { FeedbackService } from '../components/feedback/feedback.service';
import { TranslateService } from '@ngx-translate/core';
import { FeatureService } from '../components/feature/feature.service';
import { DateTime } from 'luxon';

const REQUEST_BASE_URL = environment.apiUrl + '/organisations';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  activityDataSubject = new ReplaySubject<ActivityWIP | null>();
  activityData$ = this.activityDataSubject.asObservable();

  activityUpdateStateSubject = new ReplaySubject<StepState | null>();
  activityUpdateStateData$ = this.activityUpdateStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private feedback: FeedbackService,
    private translate: TranslateService,
    private featureService: FeatureService
  ) {}

  async getActivity(orgId: string, randomUniqueId: string, dan = false) {
    try {
      let endpoint = `${REQUEST_BASE_URL}/${orgId}/activities-wip/${randomUniqueId}`;
      if (dan) {
        endpoint = `${REQUEST_BASE_URL}/${orgId}/dan-wip/${randomUniqueId}`;
      }
      const response = await lastValueFrom(
        this.http.get<ActivityWIP>(endpoint)
      );
      this.activityDataSubject.next(response);
      this.activityUpdateStateSubject.next(null);
      return response;
    } catch (e) {
      console.error('loadError', e);
      this.router.navigate(['/', 'account', 'activities']);
      return;
    }
  }

  async updateActivity(
    orgId: string,
    randomUniqueId: string,
    data: ActivityWIP,
    formStep?: string,
    dan = false
  ) {
    try {
      this.activityUpdateStateSubject.next(null);

      let endpoint = `${REQUEST_BASE_URL}/${orgId}/activities-wip/${randomUniqueId}`;
      if (dan) {
        endpoint = `${REQUEST_BASE_URL}/${orgId}/dan-wip/${randomUniqueId}`;
      }

      const response = await lastValueFrom(
        this.http.put<ActivityWIP>(endpoint, data)
      );
      this.activityUpdateStateSubject.next({
        type: 'updateSuccess',
        error: false,
        formStep: formStep
      });
      this.activityDataSubject.next(response);
      return response;
    } catch (e) {
      if (formStep) {
        this.activityUpdateStateSubject.next({
          type: 'updateError',
          error: true,
          formStep: formStep
        });
      } else {
        this.activityUpdateStateSubject.next({
          type: 'updateError',
          error: true
        });
      }
      console.error('updateError', e);
      return;
    }
  }

  async createWipActivityForActivity(orgId: number, activityId: number) {
    try {
      const response = await lastValueFrom(
        this.http.put<ActivityWIP>(
          `${REQUEST_BASE_URL}/${orgId}/activities/${activityId}`,
          {}
        )
      );
      this.activityDataSubject.next(response);
      this.activityUpdateStateSubject.next(null);
      return response;
    } catch (e) {
      console.error('createActivityWipError', e);
      return;
    }
  }

  async createActivity(orgId: string) {
    try {
      const response = await lastValueFrom(
        this.http.post<ActivityWIP>(
          `${REQUEST_BASE_URL}/${orgId}/activities-wip`,
          {}
        )
      );
      this.activityDataSubject.next(response);
      this.activityUpdateStateSubject.next(null);
      return response;
    } catch (e) {
      console.error('createActivityError', e);
      return;
    }
  }

  async publishActivity(orgId: string, randomUniqueId: string, dan = false) {
    try {
      let endpoint = `${REQUEST_BASE_URL}/${orgId}/activities-wip/${randomUniqueId}/releases`;
      if (dan) {
        endpoint = `${REQUEST_BASE_URL}/${orgId}/dan-wip/${randomUniqueId}/releases`;
      }
      const response = await lastValueFrom(
        this.http.post<ActivityWIP>(endpoint, {})
      );
      this.activityDataSubject.next(response);
      this.activityUpdateStateSubject.next(null);
      return response;
    } catch (e) {
      const error = e as HttpErrorResponse;
      if (error.status === 409) {
        this.feedback.showFeedback(
          this.translate.instant('error.itemLimit'),
          'error'
        );
        if (dan) {
          this.router.navigate(['/account/dan-activities']);
        }
      } else {
        this.feedback.showFeedback(
          this.translate.instant('error.unknown'),
          'error'
        );
      }
      return;
    }
  }

  isAllowedToCreateActivity() {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      return this.authService.hasAnyRole(currentUser, [
        UserRole.ACTIVITY_CHANGE
      ]);
    }
    return false;
  }

  isAllowedToEditActivityWip(): boolean {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      return !this.authService.hasAnyPermission(currentUser, [
        UserPermission.RNE_ADMIN
      ]);
    }
    return true;
  }

  async deleteActivity(orgId: number, activityId: number) {
    try {
      const response = await lastValueFrom(
        this.http.delete<ActivityWIP>(
          `${REQUEST_BASE_URL}/${orgId}/activities/${activityId}`,
          {}
        )
      );
      this.activityDataSubject.next(null);
      this.activityUpdateStateSubject.next(null);
      return response;
    } catch (e) {
      console.error('deleteActivityError', e);
      return;
    }
  }

  async deleteImage(
    orgId: string,
    uuid: string,
    image: ImageType,
    dan = false
  ) {
    try {
      const endpoint = `${REQUEST_BASE_URL}/${orgId}/activities-wip/${uuid}/${image}`;
      const response = await lastValueFrom(this.http.delete(endpoint, {}));
      this.getActivity(orgId, uuid, dan);
      return response;
    } catch (e) {
      console.error('createError', e);
      return;
    }
  }

  isInDanPeriod(start: string | null, end: string | null): boolean {
    if (!start || !end) return false;

    const endDateValue = DateTime.fromISO(end);
    const startDateValue = DateTime.fromISO(start);

    const feature = this.featureService.getFeature('dan-range');

    if (!feature || !feature.start || !feature.end) return false;
    const featureStart = DateTime.fromISO(feature.start);
    const featureEnd = DateTime.fromISO(feature.end);
    const inDanPeriod =
      featureStart <= endDateValue && featureEnd >= startDateValue;

    return inDanPeriod;
  }
}
