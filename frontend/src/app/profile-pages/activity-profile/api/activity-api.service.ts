import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Activity from '../../../shared/models/actvitiy';

@Injectable({
  providedIn: 'root'
})
export class ActivityApiService {
  constructor(private http: HttpClient) {}

  byId(id: number): Observable<Activity> {
    return this.http
      .get<Activity>(`${environment.apiUrl}/activities/${id}`, {})
      .pipe(
        map((result: Activity) => {
          return result;
        })
      );
  }
}
