import { Component, Input } from '@angular/core';
import { Feedback } from '../models/feedback';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';

@Component({
  selector: 'app-feedback-history',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeadingComponent, DatePipe],
  template: `
    <div class="feedback-wrapper">
      <app-heading size="md" color="none">{{
        'clearing.titles.feedback' | translate
      }}</app-heading>
      <div class="feedback-list">
        @for (feedbackEntry of feedback; track feedbackEntry) {
          <div class="feedbackEntry">
            <strong>{{
              feedbackEntry.feedbackRequestSent | date: 'dd.MM.yyyy HH:mm'
            }}</strong>
            {{ feedbackEntry.feedbackRequest }}
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .feedback-wrapper {
      display: grid;
      gap: $spacing-6;
      .feedback-list {
        display: grid;
        gap: $spacing-2;
      }
    }
  `
})
export class FeedbackHistoryComponent {
  @Input() feedback: Feedback[] = [];
}
