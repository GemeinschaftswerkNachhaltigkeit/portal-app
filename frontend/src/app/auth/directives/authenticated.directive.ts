/*  eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user-role';

@Directive({
  selector: '[appAuthenticated]'
})
export class AuthenticatedDirective implements OnInit {
  @Input() set appAuthenticated(roles: string[] | string | null) {
    this.userRoles = (roles || []) as UserRole[];
  }

  userRoles: UserRole[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    const rolesDefined = !!this.userRoles.length;
    if (user) {
      if (rolesDefined) {
        if (this.authService.hasAnyRole(user, this.userRoles)) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      } else {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
    }
  }
}
