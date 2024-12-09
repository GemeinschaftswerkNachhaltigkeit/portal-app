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
      import('./account/account.module').then((m) => m.AccountModule)
  },
  {
    path: 'administration',
    loadChildren: () =>
      import('./administration/administration.module').then(
        (m) => m.AdministrationModule
      )
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map/map.module').then((m) => m.MapModule)
  },
  {
    path: 'embeddedmap',
    loadChildren: () =>
      import('./map/embedded-map/embedded-map.module').then(
        (m) => m.EmbeddedMapModule
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
      import('./marketplace/marketplace.module').then(
        (m) => m.MarketplaceModule
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
      import('./activity/activity.module').then((m) => m.ActivityModule),
    canActivate: [AuthGuardWithLoginCheck]
  },
  {
    path: 'organisations/:orgaId',
    loadChildren: () =>
      import('./profile-pages/orga-profile/orga-profile.module').then(
        (m) => m.OrgaProfileModule
      )
  },
  {
    path: 'organisations/:orgaId/:activityId',
    loadChildren: () =>
      import('./profile-pages/activity-profile/activity-profile.module').then(
        (m) => m.ActivityProfileModule
      )
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpModule),
    canActivate: [AuthGuardWithLoginCheck]
  },
  {
    path: 'dan',
    loadChildren: () => import('./dan/dan.module').then((m) => m.DanModule),
    canActivate: [AuthGuardWithLoginCheck, AuthGuardWithoutOrga]
  },
  {
    path: 'clearing',
    loadChildren: () =>
      import('./clearing/clearing.module').then((m) => m.ClearingModule),
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
