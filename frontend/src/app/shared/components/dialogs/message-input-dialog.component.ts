
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldErrorComponent } from '../form/form-field-error/form-field-error.component';

export interface MessageInput {
  message: string;
}

@Component({
  selector: 'app-message-input-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormFieldErrorComponent
],
  template: `
    <div mat-dialog-title>
      <h3 class="title">
        {{ data.translationKeys.title! | translate: data.titleParams }}
      </h3>
    </div>
    <div mat-dialog-content>
      <form [formGroup]="msgForm">
        <mat-form-field appearance="outline">
          <mat-label>
            {{ data.translationKeys.messageFieldLabel! | translate }}
          </mat-label>
          <textarea matInput formControlName="message"></textarea>
          <mat-error>
            <app-form-field-error
              [field]="msgForm.get('message')"
            ></app-form-field-error>
          </mat-error>
        </mat-form-field>
      </form>
    </div>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>
        {{ 'btn.cancel' | translate }}
      </button>
      <button
        mat-flat-button
        [color]="'primary'"
        (click)="confirm()"
        [disabled]="!msgForm.valid"
      >
        {{ data.translationKeys.confirmBtn! | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    .title {
      color: $blue-navy;
    }

    form {
      padding: $spacing-6;
    }
  `
})
export class MessageInputDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MessageInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titleParams?: object;
      translationKeys: {
        messageFieldLabel: string;
        confirmBtn: string;
        title?: string;
      };
    }
  ) {}

  msgForm = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  confirm(): void {
    this.dialogRef.close(this.msgForm.getRawValue());
  }
}
