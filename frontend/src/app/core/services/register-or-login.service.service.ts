import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  AuthModalData,
  RegisterOrLoginModalComponent
} from '../register-or-login-modal/register-or-login-modal.component';

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
