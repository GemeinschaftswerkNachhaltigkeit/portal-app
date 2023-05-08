/*  eslint-disable  @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { OrganisationStatus } from 'src/app/shared/models/organisation-status';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { environment } from 'src/environments/environment';

const REQUEST_URL = environment.apiUrl + '/register-organisation/'; //'http://localhost:8081/api/v1/register-organisation/';

@Injectable({
  providedIn: 'root'
})
export class ImportDescisionService {
  constructor(private http: HttpClient) {}

  async acceptPrivacyPolicy(orgId: number): Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.post<any>(REQUEST_URL + orgId + '/accept-privacy-policy', {})
      );
      return true;
    } catch (e) {
      console.error('acceptPrivacyPolicy', e);
      return false;
    }
  }

  async denyPrivacyPolicy(orgId: number) {
    try {
      await lastValueFrom(
        this.http.post<any>(REQUEST_URL + orgId + '/deny-privacy-policy', {})
      );
      return true;
    } catch (e) {
      console.error('denyPrivacyPolicy', e);
      return false;
    }
  }

  isRequiredToAcceptOrDecline(org: OrganisationWIP) {
    return org.status === OrganisationStatus.PRIVACY_CONSENT_REQUIRED;
  }
}
