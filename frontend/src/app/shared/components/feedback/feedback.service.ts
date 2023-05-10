import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { FeedbackComponent } from './feedback/feedback.component';

export type FeedbackType = 'success' | 'error';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  durationInSeconds = 5;

  constructor(private snackBar: MatSnackBar) {}

  showFeedback(msg: string, type: FeedbackType = 'success') {
    this.snackBar.openFromComponent(FeedbackComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: type ? `feedback-${type}` : `feedback`,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: {
        msg,
        type
      }
    });
  }
}
