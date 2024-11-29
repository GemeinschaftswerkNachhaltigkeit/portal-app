import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OrgaUserDto } from 'src/app/shared/models/organisation-user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserSelectApiService {
  constructor(private http: HttpClient) {}

  getUsers(orgId: number): Observable<OrgaUserDto[]> {
    return this.http
      .get<{
        members: OrgaUserDto[];
      }>(`${environment.apiUrl}/organisations/${orgId}/member`)
      .pipe(
        map((response: { members: OrgaUserDto[] }) => {
          return response.members || [];
        })
      );
  }
}
