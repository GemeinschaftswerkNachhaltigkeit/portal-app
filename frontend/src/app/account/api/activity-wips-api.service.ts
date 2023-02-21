import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/auth/models/user';
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
    paging?: PageQuerParams
  ): Observable<PagedResponse<ActivityWIP> | null> {
    const orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      return of(null);
    }
    return this.http.get<PagedResponse<ActivityWIP>>(
      `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities-wip`,
      {
        params: paging
      }
    );
  }

  deleteActivityWip(user?: User, uuid?: string): Observable<object | null> {
    const orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser || !uuid) {
      return of(null);
    }
    return this.http.delete(
      `${environment.apiUrl}/organisations/${orgaIdOfUser}/activities-wip/${uuid}`
    );
  }
}
