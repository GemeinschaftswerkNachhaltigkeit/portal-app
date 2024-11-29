import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FeedbackService } from '../components/feedback/feedback.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(
    private feedback: FeedbackService,
    private translate: TranslateService
  ) {}

  handleErrors(
    errorResp: HttpErrorResponse,
    errors: { status: number; msg?: string; feedbackKey: string }[]
  ): void {
    errors.forEach((error) => {
      if (errorResp.status === error.status) {
        let hasMessage = true;
        if (error.msg) {
          const errorMessages = errorResp.error.errorMessages || [];
          hasMessage = errorMessages.find(
            (m: { field: string | null; message: string }) =>
              m.message === error.msg
          );
        }
        if (hasMessage) {
          this.feedback.showFeedback(
            this.translate.instant(error.feedbackKey),
            'error'
          );
        }
      }
    });
  }
}
