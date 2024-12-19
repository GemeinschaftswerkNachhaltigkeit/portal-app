
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ContentWrapperComponent } from './content-wrapper.component';
import { MatButtonModule } from '@angular/material/button';
import { HtmlWrapperComponent } from '../base/html-wrapper.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [
    ContentWrapperComponent,
    MatButtonModule,
    HtmlWrapperComponent,
    TranslateModule
],
  template: `
    @if (!error) {
      <app-content-wrapper>
        <div class="error-content-wrapper">
          <div>
            <h1>{{ 'error.title' | translate }}</h1>
            @if (!error) {
              <p>{{ 'error.unknown' | translate }}</p>
            }
          </div>
          <div>
            <button mat-flat-button color="accent" (click)="goToLandingpage()">
              {{ 'btn.goToLandingpage' | translate }}
            </button>
          </div>
        </div>
      </app-content-wrapper>
    }
    
    @if (error) {
      <app-content-wrapper>
        <div class="error-content-wrapper">
          <app-html-wrapper
            [html]="'error.' + error | translate"
          ></app-html-wrapper>
          <div>
            <button mat-flat-button color="accent" (click)="goToLandingpage()">
              {{ 'btn.goToLandingpage' | translate }}
            </button>
          </div>
        </div>
      </app-content-wrapper>
    }
    `,
  styles: `
    .error-content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      gap: 2em;
      width: 60vw;
    }
  `
})
export class ErrorPageComponent {
  error: string | undefined;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.error = params['error'];
    });
  }

  goToLandingpage() {
    location.href = environment.landingPageUrl;
  }
}
