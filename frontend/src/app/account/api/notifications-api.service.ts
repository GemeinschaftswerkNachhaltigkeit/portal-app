import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Organisation from 'src/app/shared/models/organisation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsApiService {
  constructor(private http: HttpClient) {}

  updateNotificationStatus(
    uuid: string,
    email: string,
    emailOptOutOptions: string[]
  ): Observable<Organisation | null> {
    return this.http.post(`${environment.apiUrl}/email/opt-out/${uuid}`, {
      email,
      emailOptOutOptions
    });
  }
}
