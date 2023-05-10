import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import {
  ConfirmationModalComponent,
  ConfirmationModalData
} from '../confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  constructor(public dialog: MatDialog) {}

  open(
    data: ConfirmationModalData = {}
  ): MatDialogRef<ConfirmationModalComponent, boolean> {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '500px',
      data: data
    });

    return dialogRef;
  }
}
