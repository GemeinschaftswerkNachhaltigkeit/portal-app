/*  eslint-disable  @typescript-eslint/no-explicit-any */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserRole } from '../models/user-role';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appAuthenticatedExcludingRoles]'
})
export class AuthenticatedExcludingRolesDirective {
  @Input() set appAuthenticatedExcludingRoles(roles: string[]) {
    const user = this.authService.getUser();
    const userRoles = roles as UserRole[];
    const rolesDefined = !!userRoles.length;
    const userHasRoles = user && this.authService.hasAnyRole(user, userRoles);
    if (!user || (rolesDefined && userHasRoles)) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}
}
