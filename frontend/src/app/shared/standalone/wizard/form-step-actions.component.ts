/* "strictPropertyInitialization": false;*/

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { StepState } from '../../../sign-up/models/step-state';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { OutlinedIconComponent } from '../base/outlined-icon.component';

@Component({
  selector: 'app-form-step-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule,
    OutlinedIconComponent
  ],
  template: `
    <div class="actions-container">
      <div *ngIf="!showPrevBtn" class="placeholder"></div>
      <button
        mat-flat-button
        matStepperPrevious
        *ngIf="showPrevBtn"
        id="prev-step"
      >
        {{ 'btn.back' | translate }}
      </button>
      <!--{{ errorMsg$ | async | json }}-->

      <div
        class="step-state-message mat-error"
        *ngIf="
          (stepState$ | async)?.error === true &&
          (stepState$ | async)?.formStep === formStepKey
        "
      >
        {{ 'error.unknown' | translate }}
      </div>

      <div class="next-buttons">
        <div
          *ngIf="
            (stepState$ | async)?.error === false &&
            (stepState$ | async)?.formStep === formStepKey
          "
          class="step-state-message"
        >
          <app-outlined-icon>cloud_done</app-outlined-icon>
          {{ 'labels.saved' | translate }}
        </div>
        <div *ngIf="showNextBtn && nextBtnCallback === undefined">
          <button mat-flat-button color="accent" matStepperNext id="next-step">
            {{ 'btn.next' | translate }}
          </button>
          <button
            mat-stroked-button
            color="accent"
            matStepperNext
            *ngIf="last && !modification"
            (click)="cancelHandler()"
            [disabled]="disableNextBtn"
            id="next-step"
          >
            {{ 'btn.saveCurrentState' | translate }}
          </button>
        </div>
        <div *ngIf="showNextBtn && nextBtnCallback !== undefined">
          <button
            mat-flat-button
            color="accent"
            matStepperNext
            (click)="nextBtnCallback()"
            [disabled]="disableNextBtn"
            id="next-step"
          >
            <div>
              <span *ngIf="!last">{{ 'btn.next' | translate }}</span>
              <ng-container *ngIf="last && !modification">
                <span *ngIf="type === 'organisation'">{{
                  'btn.finishOrgaWizard' | translate
                }}</span>
                <span *ngIf="type === 'activity'">{{
                  'btn.finishActivityWizard' | translate
                }}</span>
              </ng-container>

              <ng-container *ngIf="last && modification"
                ><span *ngIf="type === 'organisation'">{{
                  'btn.updateOrga' | translate
                }}</span
                ><span *ngIf="type === 'activity'">{{
                  'btn.updateActivity' | translate
                }}</span></ng-container
              >
            </div>
          </button>
        </div>
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
