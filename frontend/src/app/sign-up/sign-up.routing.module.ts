import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardWithForcedLogin } from '../auth/guard/auth-guard-with-forced-login.service';
import { AuthGuardWithRoleCheck } from '../auth/guard/auth-guard-with-role-check.service';
import { ContactInviteComponent } from './contact-invite/contact-invite.component';
import { ImportComponent } from './import/import.component';
import { OrgaMembershipComponent } from './orga-membership/orga-membership.component';
import { OrganisationSuccessPageComponent } from './organisation-success-page/organisation-success-page.component';
import { OrganisationComponent } from './organisation/organisation.component';

const routes: Routes = [
  {
    path: 'organisation/:organisationId',
    component: OrganisationComponent,
    canActivate: [AuthGuardWithForcedLogin, AuthGuardWithRoleCheck]
  },
  {
    path: 'organisation/:organisationId/success',
    component: OrganisationSuccessPageComponent,
    canActivate: [AuthGuardWithForcedLogin, AuthGuardWithRoleCheck]
  },
  {
    path: 'import/:organisationId',
    component: ImportComponent
  },
  {
    path: 'contact-invite/:inviteId',
    component: ContactInviteComponent
  },
  {
    path: 'organisation-membership/:uuid',
    component: OrgaMembershipComponent,
    canActivate: [AuthGuardWithForcedLogin]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule {}
