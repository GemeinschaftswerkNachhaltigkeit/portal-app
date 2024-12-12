import { Routes } from '@angular/router';
import { AuthGuardWithForcedLogin } from '../auth/guard/auth-guard-with-forced-login.service';
import { AuthGuardWithRoleCheck } from '../auth/guard/auth-guard-with-role-check.service';
import { UserPermission } from '../auth/models/user-role';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'organisations',
    pathMatch: 'full'
  },
  {
    path: 'organisations',
    loadChildren: () =>
      import('./organisations/organisations.routes').then(
        (r) => r.ORGANISATIONS_ROUTES
      ),
    canActivate: [AuthGuardWithForcedLogin, AuthGuardWithRoleCheck],
    data: {
      roles: [UserPermission.RNE_ADMIN]
    }
  }
];
