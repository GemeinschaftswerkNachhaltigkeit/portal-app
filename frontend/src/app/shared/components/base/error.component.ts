import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingComponent } from './heading.component';
import { TranslateModule } from '@ngx-translate/core';

export interface BaseError {
  status: number;
  message: string;
}

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, HeadingComponent, TranslateModule],
  template: `
    <div class="error">
      <app-heading type="h1" size="lg" color="none">
        @if (error()?.status === 404) {
          {{ 'error.title404' | translate }}
        } @else {
          {{ 'error.title' | translate }}
        }
      </app-heading>
      <p>
        @if (error()?.status === 404) {
          {{ 'error.message404' | translate }}
        } @else {
          {{ 'error.unknown' | translate }}
        }
      </p>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .error {
      display: flex;
      flex-direction: column;
      gap: $spacing-2;
      align-items: center;
      justify-content: center;
    }
  `
})
export class ErrorComponent {
  error = input<BaseError>();
}
