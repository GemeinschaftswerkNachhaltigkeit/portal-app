import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { User } from 'src/app/auth/models/user';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import Activity from 'src/app/shared/models/actvitiy';
import PagedResponse from 'src/app/shared/models/paged-response';
import { PageQuerParams } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import ActivityIds from '../models/activity-ids';

@Injectable({
  providedIn: 'root'
})
export class ActivitesApiService {
  constructor(private http: HttpClient) {}

  activitiesOfCurrentUser(
    user?: User,
    paging?: PageQuerParams
  ): Observable<PagedResponse<Activity> | null> {
    const orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      return of(null);
    }
    return this.http.get<PagedResponse<Activity>>(
      `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities`,
      {
        params: paging
      }
    );
  }

  deleteActivity(user?: User, id?: number): Observable<object | null> {
    const orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser || !id) {
      return of(null);
    }
    return this.http.delete(
      `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities/${id}`
    );
  }

  createActivity(user?: User): Observable<ActivityIds | null> {
    const orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      return of(null);
    }
    return this.http
      .post<ActivityWIP>(
        `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities-wip`,
        {}
      )
      .pipe(
        map((activityWIP: ActivityWIP) => ({
          activityId: activityWIP.randomUniqueId,
          orgaId: orgaIdOfUser
        }))
      );
  }

  updateActivity(
    user?: User,
    activityId?: number
  ): Observable<ActivityIds | null> {
    const orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser || !activityId) {
      return of(null);
    }
    return this.http
      .put<ActivityWIP>(
        `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities/${activityId}`,
        {}
      )
      .pipe(
        map((activityWIP: ActivityWIP) => ({
          activityId: activityWIP.randomUniqueId,
          orgaId: orgaIdOfUser
        }))
      );
  }
}
