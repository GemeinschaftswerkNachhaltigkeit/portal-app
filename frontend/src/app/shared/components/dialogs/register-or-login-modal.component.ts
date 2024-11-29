import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/services/auth.service';

export interface AuthModalData {
  next?: string;
  title?: string;
  subtitle?: string;
}

@Component({
  selector: 'app-register-or-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <div mat-dialog-content class="auth-modal">
      <header class="header">
        <div class="close">
          <button mat-icon-button (click)="close()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <h1 class="title">{{ data.title || 'authModal.title' | translate }}</h1>
        <p class="subtitle">{{ data.subtitle }}</p>
      </header>
      <div class="content">
        <button
          mat-flat-button
          color="accent"
          class="login-btn"
          (click)="loginHandler()"
        >
          {{ 'authModal.login' | translate }}
        </button>
        <div class="spacer">
          <div class="text">{{ 'authModal.or' | translate }}</div>
        </div>
        <button
          mat-flat-button
          class="register-btn"
          (click)="registerHandler()"
        >
          {{ 'authModal.register' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .auth-modal {
      .header {
        background-color: $blue-light;
        padding: 2.4rem 4rem;
        display: grid;
        gap: $spacing-2;
        position: relative;
        margin-inline: -24px;
        margin-top: -20px;
        color: $blue-navy;
        .close {
          position: absolute;
          right: 0;
          top: 0;
        }
        .title {
          font-size: 2rem;
          margin: 0;
        }
      }
      .content {
        width: 100%;
        display: grid;
        gap: $spacing-2;
        padding: $spacing-8 $spacing-10;
        .login-btn {
          width: 100%;
        }
        .register-btn {
          background-color: $yellow;
          color: $magenta;
          width: 100%;
        }
        .spacer {
          height: 4rem;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          position: relative;
          .text {
            padding: $spacing-2;
            background-color: white;
            z-index: 2;
            text-transform: uppercase;
            position: absolute;
          }
          &::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            height: 1px;
            background: $blue-navy;
            z-index: 0;
          }
        }
      }
    }
  `
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
