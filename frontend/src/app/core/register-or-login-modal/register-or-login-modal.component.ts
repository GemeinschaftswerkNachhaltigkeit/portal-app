import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AuthService } from 'src/app/auth/services/auth.service';

export interface AuthModalData {
  next?: string;
  title?: string;
  subtitle?: string;
}

@Component({
  selector: 'app-register-or-login-modal',
  templateUrl: './register-or-login-modal.component.html',
  styleUrls: ['./register-or-login-modal.component.scss']
})
export class RegisterOrLoginModalComponent {
  constructor(
    public dialogRef: MatDialogRef<RegisterOrLoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuthModalData,
    private auth: AuthService
  ) {}

  loginHandler() {
    this.auth.login(this.data.next);
  }

  registerHandler() {
    this.auth.register(this.data.next);
  }

  close() {
    this.dialogRef.close();
  }
}
