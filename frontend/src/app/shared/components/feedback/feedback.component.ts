import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { FeedbackType } from './feedback.service';

import { MatIconModule } from '@angular/material/icon';

type SnackBarData = {
  msg: string;
  type: FeedbackType;
};

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="feedback">
      <div class="icon">
        @if (data.type === 'success') {
          <mat-icon>check</mat-icon>
        }
        @if (data.type === 'error') {
          <mat-icon>error</mat-icon>
        }
      </div>
      <p>{{ data.msg }}</p>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .feedback {
      display: flex;
      align-items: center;
      gap: $spacing-2;
      color: white;

      .icon {
        width: $spacing-10;
        display: flex;
        align-items: center;
      }

      p {
        margin: 0;
      }
    }
  `
})
export class FeedbackComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) {}
}
