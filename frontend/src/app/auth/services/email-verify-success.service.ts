import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

const enableEmailVerifySuccessPage = true;

@Injectable({
  providedIn: 'root'
})
export class EmailVerifySuccessService {
  constructor(private http: HttpClient) {}

  getEmailVerifySuccessStateUrl(stateUrl: string, user?: User): string {
    if (enableEmailVerifySuccessPage) {
      if (user?.justRegistered) {
        console.debug('go to emailVerifySuccessPage');
        stateUrl = '/emailVerifySuccess?goTo=' + stateUrl.replace('?', '&');
      }
    }
    return stateUrl;
  }

  async verifySuccessPageVisited(): Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.post(environment.apiUrl + '/users/sign-up-successful', {})
      );
      return true;
    } catch (e) {
      console.error('verifySuccessPageVisited', e);
      return false;
    }
  }
}
