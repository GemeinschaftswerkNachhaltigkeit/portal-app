import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactInvite } from '../models/contact-invite';

const REQUEST_URL = environment.apiUrl + '/contact-invite/'; //'http://localhost:8081/api/v1/register-organisation/';

@Injectable({
  providedIn: 'root'
})
export class ContactInviteService {
  constructor(private http: HttpClient) {}

  async getInvite(inviteId: string): Promise<ContactInvite | undefined> {
    try {
      return await lastValueFrom(this.http.get(REQUEST_URL + inviteId));
    } catch (e) {
      console.error('acceptInviteError', e);
      return undefined;
    }
  }

  async acceptInvite(invietId: string) {
    try {
      const response = await lastValueFrom(
        this.http.put(REQUEST_URL + invietId + '?status=ALLOW', {})
      );
      return response;
    } catch (e) {
      console.error('acceptInviteError', e);
      return;
    }
  }

  async denyInvite(invietId: string) {
    try {
      const response = await lastValueFrom(
        this.http.put(REQUEST_URL + invietId + '?status=DENY', {})
      );
      return response;
    } catch (e) {
      console.error('denyInviteError', e);
      return;
    }
  }
}
