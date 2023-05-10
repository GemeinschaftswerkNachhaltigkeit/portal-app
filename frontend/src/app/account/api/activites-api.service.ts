import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { User } from 'src/app/auth/models/user';
import { DynamicFilters } from 'src/app/map/map/models/search-filter';
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
    filters: DynamicFilters = {},
    paging: PageQuerParams = {}
  ): Observable<PagedResponse<Activity> | null> {
    const orgaIdOfUser = user?.orgId;
    let endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities`;
    if (!orgaIdOfUser) {
      return of(null);
    }
    if (filters['dan']) {
      endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/dans`;
    }
    return this.http.get<PagedResponse<Activity>>(endpoint, {
      params: { ...paging, ...filters }
    });
  }

  deleteActivity(
    user?: User,
    id?: number,
    dan = false
  ): Observable<object | null> {
    let orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      if (!dan || !id) {
        return of(null);
      } else {
        orgaIdOfUser = environment.danId;
      }
    }

    let endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities/${id}`;
    if (dan) {
      endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/dans/${id}`;
    }

    return this.http.delete(endpoint);
  }

  createActivity(user?: User, dan = false): Observable<ActivityIds | null> {
    let orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      if (!dan) {
        return of(null);
      } else {
        orgaIdOfUser = environment.danId;
      }
    }
    let endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities-wip`;
    if (dan) {
      endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/dan-wip`;
    }
    return this.http.post<ActivityWIP>(endpoint, {}).pipe(
      map((activityWIP: ActivityWIP) => ({
        activityId: activityWIP.randomUniqueId,
        orgaId: orgaIdOfUser
      }))
    );
  }

  updateActivity(
    user?: User,
    activityId?: number,
    dan = false
  ): Observable<ActivityIds | null> {
    let orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      if (!dan || !activityId) {
        return of(null);
      } else {
        orgaIdOfUser = environment.danId;
      }
    }
    let endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities/${activityId}`;
    if (dan) {
      endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/dans/${activityId}`;
    }
    return this.http.put<ActivityWIP>(endpoint, {}).pipe(
      map((activityWIP: ActivityWIP) => ({
        activityId: activityWIP.randomUniqueId,
        orgaId: orgaIdOfUser
      }))
    );
  }
}
