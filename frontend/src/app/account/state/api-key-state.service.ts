import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiKey } from '../models/api-key-dto';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyStateService {
  private apiKey = new BehaviorSubject<ApiKey | null>(null);

  get apiKey$(): Observable<ApiKey | null> {
    return this.apiKey.asObservable();
  }

  setApiKey(apiKey: ApiKey | null): void {
    this.apiKey.next(apiKey);
  }
}
