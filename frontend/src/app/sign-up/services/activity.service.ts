import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, ReplaySubject } from 'rxjs';
import { UserPermission, UserRole } from 'src/app/auth/models/user-role';
import { AuthService } from 'src/app/auth/services/auth.service';

import { environment } from 'src/environments/environment';
import { ActivityWIP } from '../../shared/models/activity-wip';
import { ImageType } from '../models/image-type';
import { StepState } from '../models/step-state';

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
    private router: Router
  ) {}

  async getActivity(orgId: string, randomUniqueId: string) {
    try {
      const response = await lastValueFrom(
        this.http.get<ActivityWIP>(
          `${REQUEST_BASE_URL}/${orgId}/activities-wip/${randomUniqueId}`
        )
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
    formStep?: string
  ) {
    try {
      this.activityUpdateStateSubject.next(null);
      const response = await lastValueFrom(
        this.http.put<ActivityWIP>(
          `${REQUEST_BASE_URL}/${orgId}/activities-wip/${randomUniqueId}`,
          data
        )
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

  async publishActivity(orgId: string, randomUniqueId: string) {
    try {
      const response = await lastValueFrom(
        this.http.post<ActivityWIP>(
          `${REQUEST_BASE_URL}/${orgId}/activities-wip/${randomUniqueId}/releases`,
          {}
        )
      );
      this.activityDataSubject.next(response);
      this.activityUpdateStateSubject.next(null);
      return response;
    } catch (e) {
      //   this.orgUpdateStateSubject.next({ type: 'loadError', error: true });
      console.error('createActivityError', e);
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

  async deleteImage(orgId: string, uuid: string, image: ImageType) {
    try {
      const response = await lastValueFrom(
        this.http.delete(
          `${REQUEST_BASE_URL}/${orgId}/activities-wip/${uuid}/${image}`,
          {}
        )
      );
      this.getActivity(orgId, uuid);
      return response;
    } catch (e) {
      console.error('createError', e);
      return;
    }
  }
}
