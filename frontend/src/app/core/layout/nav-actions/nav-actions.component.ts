import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nav-actions',
  templateUrl: './nav-actions.component.html',
  styleUrls: ['./nav-actions.component.scss']
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
