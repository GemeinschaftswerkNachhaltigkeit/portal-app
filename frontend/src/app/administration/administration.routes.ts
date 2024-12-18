import { Routes } from '@angular/router';
import { AuthGuardWithForcedLogin } from '../auth/guard/auth-guard-with-forced-login.service';
import { VerifyRoles } from '../auth/guard/verify-roles';
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
    canActivate: [AuthGuardWithForcedLogin, VerifyRoles],
    data: {
      roles: [UserPermission.RNE_ADMIN]
    }
  }
];
