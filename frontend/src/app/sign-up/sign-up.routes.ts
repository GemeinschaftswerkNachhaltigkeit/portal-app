import { Routes } from '@angular/router';
import { AuthGuardWithForcedLogin } from '../auth/guard/auth-guard-with-forced-login.service';
import { AuthGuardWithRoleCheck } from '../auth/guard/auth-guard-with-role-check.service';
import { ImportComponent } from './containers/import/import.component';
import { OrgaMembershipComponent } from './containers/orga-membership/orga-membership.component';
import { OrganisationSuccessPageComponent } from './containers/organisation-success-page/organisation-success-page.component';
import { OrganisationComponent } from './containers/organisation/organisation.component';
import { ContactInviteComponent } from './containers/contact-invite/contact-invite.component';

export const SIGN_UP_ROUTES: Routes = [
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
