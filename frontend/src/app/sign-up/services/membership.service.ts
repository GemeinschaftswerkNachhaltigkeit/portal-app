import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  constructor(private http: HttpClient) {}

  finishMembership(uuid: string): Observable<object> {
    return this.http.put(
      `${environment.apiUrl}/organisation-membership/${uuid}`,
      {}
    );
  }
}
