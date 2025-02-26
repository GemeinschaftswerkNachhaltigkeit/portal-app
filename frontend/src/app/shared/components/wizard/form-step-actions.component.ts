/* "strictPropertyInitialization": false;*/

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { StepState } from '../../../sign-up/models/step-state';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { OutlinedIconComponent } from '../base/outlined-icon.component';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-form-step-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule,
    OutlinedIconComponent,
    MatStepperModule
  ],
  template: `
    <div class="actions-container">
      @if (!showPrevBtn) {
        <div class="placeholder"></div>
      }
      @if (showPrevBtn) {
        <button mat-flat-button matStepperPrevious id="prev-step">
          {{ 'btn.back' | translate }}
        </button>
      }
      <!--{{ errorMsg$ | async | json }}-->

      @if (
        (stepState$ | async)?.error === true &&
        (stepState$ | async)?.formStep === formStepKey
      ) {
        <div class="step-state-message mat-error">
          {{ 'error.unknown' | translate }}
        </div>
      }

      <div class="next-buttons">
        @if (
          (stepState$ | async)?.error === false &&
          (stepState$ | async)?.formStep === formStepKey
        ) {
          <div class="step-state-message">
            <app-outlined-icon>cloud_done</app-outlined-icon>
            {{ 'labels.saved' | translate }}
          </div>
        }
        @if (showNextBtn && nextBtnCallback === undefined) {
          <div>
            <button
              mat-flat-button
              color="accent"
              matStepperNext
              id="next-step"
            >
              {{ 'btn.next' | translate }}
            </button>
            @if (last && !modification) {
              <button
                mat-stroked-button
                color="accent"
                matStepperNext
                (click)="cancelHandler()"
                [disabled]="disableNextBtn"
                id="next-step"
              >
                {{ 'btn.saveCurrentState' | translate }}
              </button>
            }
          </div>
        }
        @if (showNextBtn && nextBtnCallback !== undefined) {
          <div>
            <button
              mat-flat-button
              color="accent"
              matStepperNext
              (click)="nextBtnCallback()"
              [disabled]="disableNextBtn"
              id="next-step"
            >
              <div>
                @if (!last) {
                  <span>{{ 'btn.next' | translate }}</span>
                }
                @if (last && !modification) {
                  @if (type === 'organisation') {
                    <span>{{ 'btn.finishOrgaWizard' | translate }}</span>
                  }
                  @if (type === 'activity') {
                    <span>{{ 'btn.finishActivityWizard' | translate }}</span>
                  }
                }
                @if (last && modification) {
                  @if (type === 'organisation') {
                    <span>{{ 'btn.updateOrga' | translate }}</span>
                  }
                  @if (type === 'activity') {
                    <span>{{ 'btn.updateActivity' | translate }}</span>
                  }
                }
              </div>
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .actions-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 2em;
    }

    #next-step,
    .step-state-message {
      display: flex;
      align-items: center;
      gap: 1em;
    }

    .next-buttons {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 2em;
    }

    @media screen and (min-width: 800px) {
      .actions-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      .next-buttons {
        flex-direction: row;
      }
    }
  `
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
