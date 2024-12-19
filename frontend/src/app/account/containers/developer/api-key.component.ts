import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DeveloperFacadeService } from 'src/app/account/developer-facade.service';
import { ApiKeyContentComponent } from './api-key-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-api-key',
  standalone: true,
  imports: [
    CommonModule,
    ApiKeyContentComponent,
    TranslateModule,
    MatButtonModule
  ],
  template: `
    <div class="api-key-container">
      <div class="label">API-KEY</div>
      @if (apiKey$ | async; as apiKey) {
        <app-api-key-content [apiKey]="apiKey.apiKey"></app-api-key-content>
      } @else {
        <app-api-key-content></app-api-key-content
          >
        }
      </div>
      <div class="actions">
        <button mat-flat-button color="primary" (click)="createHandler()">
          @if (apiKey$ | async; as apiKey) {
            {{
            'account.buttons.refreshApiKey' | translate
            }}
          } @else {
            {{
            'account.buttons.createApiKey' | translate
            }}
          }
        </button>
    
        <button mat-flat-button color="warn" (click)="deleteHandler()">
          {{ 'account.buttons.deleteApiKey' | translate }}
        </button>
      </div>
    `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .api-key-container {
      border: 2px solid $blue-navy;
      padding: $spacing-6;
      position: relative;

      .label {
        position: absolute;
        font-weight: bold;
        font-size: 1rem;
        line-height: 1rem;
        left: $spacing-1;
        top: $spacing-1;
      }
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-1;
      margin-top: $spacing-1;
    }
  `
})
export class ApiKeyComponent implements OnInit {
  apiKey$ = this.developerFacade.apiKey$;

  constructor(private developerFacade: DeveloperFacadeService) {}

  createHandler(): void {
    this.developerFacade.createApiKey();
  }

  deleteHandler(): void {
    this.developerFacade.deleteApiKey();
  }

  ngOnInit(): void {
    this.developerFacade.loadApiKey();
  }
}
