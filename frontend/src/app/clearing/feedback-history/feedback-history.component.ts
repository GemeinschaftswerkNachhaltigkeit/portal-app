import { Component, Input } from '@angular/core';
import { Feedback } from '../models/feedback';

@Component({
  selector: 'app-feedback-history',
  templateUrl: './feedback-history.component.html',
  styleUrls: ['./feedback-history.component.scss']
})
export class FeedbackHistoryComponent {
  @Input() feedback: Feedback[] = [];
}
