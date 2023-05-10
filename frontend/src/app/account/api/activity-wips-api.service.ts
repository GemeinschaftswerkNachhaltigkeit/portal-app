import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/auth/models/user';
import { DynamicFilters } from 'src/app/map/map/models/search-filter';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import PagedResponse from 'src/app/shared/models/paged-response';
import { PageQuerParams } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityWipsApiService {
  constructor(private http: HttpClient) {}

  activitiesWipsOfCurrentUser(
    user?: User,
    filters: DynamicFilters = {},
    paging: PageQuerParams = {}
  ): Observable<PagedResponse<ActivityWIP> | null> {
    let orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      if (!filters['dan']) {
        return of(null);
      } else {
        orgaIdOfUser = environment.danId;
      }
    }
    let endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities-wip`;
    if (filters['dan']) {
      endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/dan-wip`;
    }
    return this.http.get<PagedResponse<ActivityWIP>>(endpoint, {
      params: { ...paging, ...filters }
    });
  }

  deleteActivityWip(
    user?: User,
    uuid?: string,
    dan = false
  ): Observable<object | null> {
    let orgaIdOfUser = user?.orgId;

    if (!orgaIdOfUser) {
      if (!dan || !uuid) {
        return of(null);
      } else {
        orgaIdOfUser = environment.danId;
      }
    }

    let endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities-wip/${uuid}`;
    if (dan) {
      endpoint = `${environment.apiUrl}/organisations/${orgaIdOfUser}/dan-wip/${uuid}`;
    }

    return this.http.delete(endpoint);
  }
}
