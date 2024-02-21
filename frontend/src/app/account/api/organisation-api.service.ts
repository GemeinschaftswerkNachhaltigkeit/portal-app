import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { User } from 'src/app/auth/models/user';
import Organisation from 'src/app/shared/models/organisation';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { environment } from 'src/environments/environment';
import UserDto from '../models/user-dto';
import UserListDto from '../models/user-list-dto';

@Injectable({
  providedIn: 'root'
})
export class OrganisationApiService {
  constructor(private http: HttpClient) {}

  organisationOfCurrentUser(user?: User): Observable<Organisation | null> {
    const orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      return of(null);
    }
    return this.http.get<Organisation>(
      `${environment.apiUrl}/organisations/${orgaIdOfUser}`
    );
  }

  createOrganisation(): Observable<string | null> {
    return this.http
      .post<OrganisationWIP>(`${environment.apiUrl}/register-organisation`, {
        name: 'Neue Orga'
      })
      .pipe(map((orgaWIP: OrganisationWIP) => orgaWIP.randomUniqueId || ''));
  }

  organisationWipOfCurrentUser(): Observable<OrganisationWIP> {
    return this.http.get<OrganisationWIP>(
      `${environment.apiUrl}/register-organisation`,
      {}
    );
  }

  deleteOrganisation(user?: User): Observable<object | null> {
    const orgaIdOfUser = user?.orgId;
    const orgaWipIdOfUser = user?.orgWipId;

    if (orgaIdOfUser) {
      return this.http.delete(
        `${environment.apiUrl}/organisations/${orgaIdOfUser}`
      );
    }
    if (orgaWipIdOfUser) {
      return this.http.delete(
        `${environment.apiUrl}/register-organisation/${orgaWipIdOfUser}`
      );
    }
    return of(null);
  }

  updateOrganisation(user?: User): Observable<string | null> {
    const orgaIdOfUser = user?.orgId;
    if (!orgaIdOfUser) {
      return of(null);
    }
    return this.http
      .put<OrganisationWIP>(
        `${environment.apiUrl}/organisations/${orgaIdOfUser}`,
        {}
      )
      .pipe(map((orgaWip: OrganisationWIP) => orgaWip.randomUniqueId || ''));
  }

  leaveOrganisation(): Observable<object> {
    return this.http.delete(`${environment.apiUrl}/organisation-membership`);
  }

  addUser(userDto: UserDto, orgId: number): Observable<object> {
    return this.http.post(
      `${environment.apiUrl}/organisations/${orgId}/member`,
      userDto
    );
  }

  deleteUser(userListDto: UserListDto, orgId: number): Observable<object> {
    return this.http.delete(
      `${environment.apiUrl}/organisations/${orgId}/member`,
      {
        body: userListDto
      }
    );
  }

  getUsers(orgId: number): Observable<UserListDto[]> {
    return this.http
      .get<{
        members: UserListDto[];
      }>(`${environment.apiUrl}/organisations/${orgId}/member`)
      .pipe(
        map((response: { members: UserListDto[] }) => {
          return response.members || [];
        })
      );
  }
}
