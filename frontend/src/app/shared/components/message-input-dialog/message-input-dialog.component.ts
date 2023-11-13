import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface MessageInput {
  message: string;
}

@Component({
  selector: 'app-message-input-dialog',
  templateUrl: './message-input-dialog.component.html',
  styleUrls: ['./message-input-dialog.component.scss']
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
