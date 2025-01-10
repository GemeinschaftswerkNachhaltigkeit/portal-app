import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LangToggleComponent } from './lang-toggle.component';

@Component({
  selector: 'app-nav-actions',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    LangToggleComponent
  ],
  template: `
    <div class="buttons" [class.mobile]="mobile">
      <div class="menu highlighted-links font-2">
        <a
          *ngIf="!isLoggedIn()"
          class="menu-entry"
          color="primary"
          (click)="login()"
        >
          {{ 'btn.login' | translate }}
        </a>
        <a
          *ngIf="isLoggedIn()"
          class="menu-entry"
          color="primary"
          (click)="logout()"
        >
          {{ 'btn.logout' | translate }}
        </a>
      </div>

      <button
        class="registration-btn"
        mat-flat-button
        color="accent"
        (click)="registerUser()"
        *ngIf="!isLoggedIn()"
      >
        {{ 'btn.registration' | translate }}
      </button>
    </div>

    <div class="toggle" [class.mobile]="mobile">
      <app-lang-toggle></app-lang-toggle>
    </div>
  `,
  styles: `
    @use 'theme' as *;

    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      .buttons {
        display: flex;
        gap: 1rem;
        align-items: center;
        &.mobile {
          width: 100%;
          display: flex;
          gap: 1rem;

          button {
            flex-grow: 1;
          }

          .registration-btn {
            flex-grow: 0;
          }
        }
        .highlighted-links {
          height: 100%;
          display: flex;
          align-items: center;
          a {
            text-transform: uppercase;
            font-weight: 600;
            height: 2rem;
            margin: $spacing-2;
            margin-left: 0;
            line-height: 2rem;
          }
        }
      }

      .toggle {
        &.mobile {
          order: -1;
        }
      }

      @media screen and (min-width: 1280px) {
        .buttons {
          .highlighted-links {
            a {
              margin-left: $spacing-2;
            }
          }
        }
      }
    }
  `
})
export class NavActionsComponent {
  @Input() mobile = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  registerUser() {
    /**
     * redirectUri must use AuthGuard, see openUri in app-auth.config.ts
     */
    this.router.navigate(['/account'], {
      queryParams: {
        forceRegistration: ''
      }
    });
  }
}
