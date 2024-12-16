import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardWithForcedLogin } from './auth/guard/auth-guard-with-forced-login.service';
import { AuthGuardWithRoleCheck } from './auth/guard/auth-guard-with-role-check.service';
import { UserPermission } from './auth/models/user-role';
import { AuthGuardWithLoginCheck } from './auth/guard/auth-guard-login-check.service';
import { EmailVerifySuccessPageComponent } from './auth/email-verify-success-page/email-verify-success-page.component';
import { ErrorPageComponent } from './shared/components/layout/error-page.component';
import { NotFoundPageComponent } from './shared/components/layout/not-found-page/not-found-page.component';
import { AuthGuardWithoutOrga } from './auth/guard/auth-guard-without-orga.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.routes').then((r) => r.SEARCH_ROUTES)
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.routes').then((r) => r.ACCOUNT_ROUTES)
  },
  {
    path: 'administration',
    loadChildren: () =>
      import('./administration/administration.routes').then(
        (r) => r.ADMIN_ROUTES
      )
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map/map.routes').then((r) => r.MAP_ROUTES)
  },
  {
    path: 'embeddedmap',
    loadChildren: () =>
      import('./map/embedded-map/embedded-map.routes').then(
        (r) => r.EMBEDDED_MAP_ROUTES
      )
  },
  {
    path: 'marketplace',
    pathMatch: 'full',
    redirectTo: '/marketplace/search'
  },
  {
    path: 'marketplace',
    loadChildren: () =>
      import('./marketplace/marketplace.routes').then(
        (r) => r.MARKETPLACE_ROUTES
      )
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.routes').then((r) => r.EVENT_ROUTES)
  },
  {
    path: 'activity',
    loadChildren: () =>
      import('./activity/activity.routes').then((r) => r.ACTIVITY_ROUTES),
    canActivate: [AuthGuardWithLoginCheck]
  },
  {
    path: 'organisations/:orgaId',
    loadChildren: () =>
      import('./profile-pages/orga-profile/orga-profile.routes').then(
        (r) => r.ORGA_PROFILE_ROUTES
      )
  },
  {
    path: 'organisations/:orgaId/:activityId',
    loadChildren: () =>
      import('./profile-pages/activity-profile/activity-profile.routes').then(
        (r) => r.ACTIVITY_PROFILE_ROUTES
      )
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./sign-up/sign-up.routes').then((r) => r.SIGN_UP_ROUTES),
    canActivate: [AuthGuardWithLoginCheck]
  },
  {
    path: 'dan',
    loadChildren: () => import('./dan/dan.routes').then((r) => r.DAN_ROUTES),
    canActivate: [AuthGuardWithLoginCheck, AuthGuardWithoutOrga]
  },
  {
    path: 'clearing',
    loadChildren: () =>
      import('./clearing/clearing.routes').then((r) => r.CLEARING_ROUTES),
    canActivate: [AuthGuardWithForcedLogin, AuthGuardWithRoleCheck],
    data: {
      roles: [UserPermission.RNE_ADMIN]
    }
  },
  {
    path: 'emailVerifySuccess',
    component: EmailVerifySuccessPageComponent
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      bindToComponentInputs: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
