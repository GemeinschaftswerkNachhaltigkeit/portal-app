/* "strictPropertyInitialization": false;*/

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { StepState } from '../../../../sign-up/models/step-state';

@Component({
  selector: 'app-form-step-actions',
  templateUrl: './form-step-actions.component.html',
  styleUrls: ['./form-step-actions.component.scss']
})
export class FormStepActionsComponent {
  @Input() showPrevBtn = true;
  @Input() type: 'organisation' | 'activity' = 'organisation';
  @Input() showNextBtn = true;
  @Input() disableNextBtn = false;
  @Input() last = false;
  @Input() modification = false;
  @Input() nextBtnCallback: (() => void) | undefined;

  @Input() formStepKey:
    | 'ACTIVITY'
    | 'ORGANISATION'
    | 'user'
    | 'externalLinks'
    | 'topics'
    | null = null;

  @Input() stepState$: Observable<StepState | null> | undefined;

  @Output() canceled = new EventEmitter();

  cancelHandler(): void {
    this.canceled.emit();
  }
}
