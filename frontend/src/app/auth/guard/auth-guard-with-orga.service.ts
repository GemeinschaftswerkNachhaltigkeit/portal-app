/*  eslint-disable  @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardWithOrga implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const redirectUrl = route.data['redirectUrl'];

    const hasOrga = this.authService.userHasOrga();
    if (hasOrga) {
      return true;
    }
    if (redirectUrl) {
      this.router.navigate(redirectUrl);
      return false;
    } else {
      return false;
    }
  }
}
