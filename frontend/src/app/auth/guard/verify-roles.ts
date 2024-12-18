import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user-role';

@Injectable({ providedIn: 'root' })
export class VerifyRoles {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const user = this.authService.getUser();
    const routeRoles: UserRole[] = route.data['roles'];
    const notRouteRoles: UserRole[] = route.data['notRoles'];

    if (routeRoles && notRouteRoles) {
      throw new Error('Use only roles or notRoles, not both');
    }

    if (
      user &&
      !notRouteRoles &&
      this.authService.hasAnyRole(user, routeRoles)
    ) {
      return true;
    }
    if (
      user &&
      notRouteRoles &&
      !this.authService.hasAnyRole(user, notRouteRoles)
    ) {
      return true;
    }
    return this.router.parseUrl('/');
  }
}
