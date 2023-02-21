import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';
import { ApiKeyApiService } from './api/api-key-api.service';
import { ApiKey } from './models/api-key-dto';
import { ApiKeyStateService } from './state/api-key-state.service';

@Injectable({
  providedIn: 'root'
})
export class DeveloperFacadeService {
  constructor(
    private apiKeyState: ApiKeyStateService,
    private apiKeyApi: ApiKeyApiService,
    private translate: TranslateService
  ) {}

  get apiKey$(): Observable<ApiKey | null> {
    return this.apiKeyState.apiKey$;
  }

  loadApiKey(): void {
    this.apiKeyApi
      .getApiKey()
      .pipe(take(1))
      .subscribe((apiKey: ApiKey) => {
        this.apiKeyState.setApiKey(apiKey);
      });
  }

  createApiKey(): void {
    this.apiKeyApi
      .createApiKey()
      .pipe(take(1))
      .subscribe((apiKey: ApiKey) => {
        this.apiKeyState.setApiKey(apiKey);
      });
  }

  deleteApiKey(): void {
    this.apiKeyApi
      .deleteApiKey()
      .pipe(take(1))
      .subscribe(() => {
        this.apiKeyState.setApiKey(null);
      });
  }
}
