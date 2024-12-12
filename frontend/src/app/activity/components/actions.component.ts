import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { SavedIndicatorComponent } from 'src/app/shared/components/wizard/saved-indicator.component';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule,
    SavedIndicatorComponent,
    MatStepperModule
  ],
  template: `
    <div class="actions-container">
      <div>
        <button
          mat-flat-button
          matStepperPrevious
          *ngIf="showPrevBtn"
          id="prev-step"
        >
          {{ 'btn.back' | translate }}
        </button>
      </div>
      <div class="actions">
        <ng-content></ng-content>
        <app-saved-indicator></app-saved-indicator>
        <button
          mat-flat-button
          color="accent"
          matStepperNext
          *ngIf="showNextBtn && !finalStep"
          id="next-step"
        >
          {{ 'btn.next' | translate }}
        </button>
        <button
          mat-stroked-button
          color="accent"
          matStepperNext
          *ngIf="finalStep && !modification"
          (click)="cancelHandler()"
          id="next-step"
        >
          {{ 'btn.saveCurrentState' | translate }}
        </button>
        <button
          mat-flat-button
          color="accent"
          matStepperNext
          *ngIf="showNextBtn && finalStep"
          (click)="completedHandler()"
          id="next-step"
        >
          <span *ngIf="!modification">{{ completedButtonText }}</span>
          <span *ngIf="modification">{{ updateButtonText }}</span>
        </button>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .actions-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 2em;

      .actions {
        display: flex;
        gap: $spacing-2;
        flex-wrap: wrap;
      }
    }

    @media screen and (min-width: 800px) {
      .actions-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  `
})
export class ActionsComponent {
  @Input() showPrevBtn = true;
  @Input() showNextBtn = true;
  @Input() last = false;
  @Input() finalStep = false;
  @Input() completedButtonText = '';
  @Input() updateButtonText = '';
  @Input() modification = false;

  @Output() completed = new EventEmitter();
  @Output() canceled = new EventEmitter();

  cancelHandler(): void {
    this.canceled.emit();
  }

  completedHandler(): void {
    this.completed.emit();
  }
}
