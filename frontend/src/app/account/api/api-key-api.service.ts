import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { ApiKey } from '../models/api-key-dto';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  createApiKey(): Observable<ApiKey> {
    return this.http.post<ApiKey>(`${environment.apiUrl}/api-keys/`, {});
  }

  getApiKey(): Observable<ApiKey> {
    return this.http.get<ApiKey>(`${environment.apiUrl}/api-keys/`);
  }

  deleteApiKey(): Observable<object> {
    return this.http.delete(`${environment.apiUrl}/api-keys/`);
  }
}
