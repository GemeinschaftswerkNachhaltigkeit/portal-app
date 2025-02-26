import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AuthModalData,
  RegisterOrLoginModalComponent
} from '../components/dialogs/register-or-login-modal.component';

@Injectable({
  providedIn: 'root'
})
export class RegisterOrLoginService {
  constructor(public dialog: MatDialog) {}

  open(data: AuthModalData): void {
    this.dialog.open(RegisterOrLoginModalComponent, {
      width: '500px',
      data: data
    });
  }
}
