import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import UserData from '../models/user-data';

@Injectable({
  providedIn: 'root'
})
export class MyDataApiService {
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  changeMyData(data: UserData): Observable<object> {
    const accessToken = this.auth.getAccessToken();
    const accessTokenHeaderValue = `Bearer ${accessToken}`;
    return this.http.post(`${environment.keycloak.issuer}/account`, data, {
      headers: {
        Authorization: accessTokenHeaderValue
      }
    });
  }
}
