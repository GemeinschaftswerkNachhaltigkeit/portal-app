import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, ReplaySubject } from 'rxjs';
import { User } from 'src/app/auth/models/user';
import { UserPermission } from 'src/app/auth/models/user-role';
import { AuthService } from 'src/app/auth/services/auth.service';
import { OrganisationStatus } from 'src/app/shared/models/organisation-status';
import { environment } from 'src/environments/environment';
import { OrganisationWIP } from '../../shared/models/organisation-wip';
import { ImageType } from '../../shared/models/image-type';

const ORGANISATION_BASE_URL = environment.apiUrl + '/organisations';
const REQUEST_URL = environment.apiUrl + '/register-organisation'; //'http://localhost:8081/api/v1/register-organisation/';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  orgDataSubject = new ReplaySubject<OrganisationWIP>();
  orgData$ = this.orgDataSubject.asObservable();

  orgUpdateStateSubject = new ReplaySubject<{
    type: string;
    error?: boolean;
    formStep?: string;
  } | null>();
  orgUpdateStateData$ = this.orgUpdateStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  async getOrganisation(orgUuid: string) {
    try {
      const user = this.authService.getUser();
      const noOrg = user
        ? !this.authService.hasAnyPermission(user, [
            UserPermission.RNE_ADMIN
          ]) &&
          !user.orgId &&
          !user.orgWipId
        : undefined;
      const response = await lastValueFrom(
        noOrg
          ? this.http.post<OrganisationWIP>(
              `${REQUEST_URL}/${orgUuid}/owner`,
              {}
            )
          : this.http.get<OrganisationWIP>(`${REQUEST_URL}/${orgUuid}`)
      );
      if (noOrg) {
        await this.authService.refreshToken();
      }
      this.orgDataSubject.next(response);
      this.orgUpdateStateSubject.next(null);
      return response;
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }

  async createOrganisation() {
    try {
      const response = await lastValueFrom(
        this.http.post<OrganisationWIP>(REQUEST_URL, {})
      );
      this.orgDataSubject.next(response);
      this.orgUpdateStateSubject.next(null);
      return response;
    } catch (e) {
      //   this.orgUpdateStateSubject.next({ type: 'loadError', error: true });
      console.error('createError', e);
      return;
    }
  }

  async updateOrganisation(
    orgId: string,
    orgData: OrganisationWIP,
    formStep?: string
  ) {
    try {
      this.orgUpdateStateSubject.next(null);
      const response = await lastValueFrom(
        this.http.put<OrganisationWIP>(REQUEST_URL + '/' + orgId, orgData)
      );
      this.orgUpdateStateSubject.next({
        type: 'updateSuccess',
        error: false,
        formStep: formStep
      });
      this.orgDataSubject.next(response);
      return response;
    } catch (e) {
      if (formStep) {
        this.orgUpdateStateSubject.next({
          type: 'updateError',
          error: true,
          formStep: formStep
        });
      } else {
        this.orgUpdateStateSubject.next({
          type: 'updateError',
          error: true
        });
      }
      console.error('updateError', e);
      return;
    }
  }

  async deleteImage(uuid: string, image: ImageType) {
    try {
      const response = await lastValueFrom(
        this.http.delete(`${REQUEST_URL}/${uuid}/${image}`, {})
      );
      this.getOrganisation(uuid);
      return response;
    } catch (e) {
      console.error('createError', e);
      return;
    }
  }

  async submitForApproval(
    orgId: string
    //  org?: OrganisationWIP
  ): Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.post(REQUEST_URL + '/' + orgId + '/releases', {})
      );
      return true;
    } catch (e) {
      console.error('submitForApproval (releases)', e);
      return false;
    }
  }

  isNotOrgModification(status?: OrganisationStatus): boolean {
    return status !== OrganisationStatus.AKTUALISIERUNG_ORGANISATION;
  }

  isRneAdmin(): boolean {
    const currentUser = this.authService.getUser();
    return currentUser
      ? this.authService.hasAnyPermission(currentUser, [
          UserPermission.RNE_ADMIN
        ])
      : false;
  }

  isAllowedToEditOrgWip(org?: OrganisationWIP | null): boolean {
    if (!org) {
      return false;
    }
    const currentUser = this.authService.getUser();
    if (currentUser) {
      if (this.isRneAdmin()) {
        return true;
      }
    }
    if (
      org.status === OrganisationStatus.NEW ||
      org.status === OrganisationStatus.RUECKFRAGE_CLEARING ||
      org.status === OrganisationStatus.AKTUALISIERUNG_ORGANISATION
    ) {
      if (currentUser) {
        return this.authService.hasAnyPermission(currentUser, [
          UserPermission.ORGANISATION_OWNER
        ]);
      }
      return true;
    } else {
      return false;
    }
  }

  isAllowedToCreateOrg(orgWipId?: number): boolean {
    const currentUser = this.authService.getUser();
    if (this.userBelongsToOrgInProgress(currentUser, orgWipId)) {
      return true;
    } else if (this.userDoesNotBelongToAnyOrg(currentUser)) {
      return true;
    }
    return false;
  }

  private userBelongsToOrgInProgress(
    currentUser?: User,
    orgWipId?: number
  ): boolean {
    return !!orgWipId && currentUser?.orgWipId === +orgWipId;
  }
  private userDoesNotBelongToAnyOrg(currentUser?: User): boolean {
    return !currentUser?.orgWipId && !currentUser?.orgId;
  }

  async createWipOrgForOrg(orgId: number) {
    try {
      const response = await lastValueFrom(
        this.http.put<OrganisationWIP>(`${ORGANISATION_BASE_URL}/${orgId}`, {})
      );
      this.orgDataSubject.next(response);
      this.orgUpdateStateSubject.next(null);
      return response;
    } catch (e) {
      console.error('createOrganisationWipError', e);
      return;
    }
  }

  async publishOrganisationUpdate(orgId: string): Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.post(REQUEST_URL + '/' + orgId + '/releases', {})
      );
      return true;
    } catch (e) {
      console.error('submitForApproval', e);
      return false;
    }
  }
}
