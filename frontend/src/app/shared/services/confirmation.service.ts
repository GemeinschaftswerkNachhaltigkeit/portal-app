import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ConfirmationModalComponent,
  ConfirmationModalData
} from '../components/dialogs/confirmation-modal.component';

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
