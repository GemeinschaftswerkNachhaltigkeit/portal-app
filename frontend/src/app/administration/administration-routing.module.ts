import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardWithForcedLogin } from '../auth/guard/auth-guard-with-forced-login.service';
import { AuthGuardWithRoleCheck } from '../auth/guard/auth-guard-with-role-check.service';
import { UserPermission } from '../auth/models/user-role';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'organisations',
    pathMatch: 'full'
  },
  {
    path: 'organisations',
    loadChildren: () =>
      import('./organisations/organisations.module').then(
        (m) => m.OrganisationsModule
      ),
    canActivate: [AuthGuardWithForcedLogin, AuthGuardWithRoleCheck],
    data: {
      roles: [UserPermission.RNE_ADMIN]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {}
