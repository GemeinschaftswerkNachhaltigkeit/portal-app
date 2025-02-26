import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { HeadingComponent } from '../base/heading.component';
import { TranslateModule } from '@ngx-translate/core';

export interface ConfirmationModalData {
  title?: string;
  description?: string;
  button?: string;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    HeadingComponent,
    TranslateModule
  ],
  template: `
    <div mat-dialog-content class="confrimation-modal">
      <header class="header">
        <app-heading type="h4" color="none">{{
          data.title || ('confirmationModal.title' | translate)
        }}</app-heading>
        <p>
          {{
            data.description || ('confirmationModal.description' | translate)
          }}
        </p>
      </header>
      <div mat-dialog-actions class="actions">
        <button mat-button class="login-btn" (click)="cancel()">
          {{ 'confirmationModal.cancel' | translate }}
        </button>

        <button
          mat-flat-button
          color="accent"
          class="register-btn"
          (click)="confirm()"
        >
          {{ data.button || ('confirmationModal.confirm' | translate) }}
        </button>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .confrimation-modal {
      .header {
        display: grid;
        gap: $spacing-2;
        margin-bottom: $spacing-8;
        padding: $spacing-6;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: $spacing-2;
        width: 100%;
        padding: $spacing-6;
      }
    }
  `
})
export class ConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationModalData
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }
  cancel() {
    this.dialogRef.close(false);
  }
}
