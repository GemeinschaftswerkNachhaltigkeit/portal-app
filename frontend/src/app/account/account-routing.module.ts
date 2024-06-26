import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyOrganisationComponent } from './containers/my-organisation/my-organisation.component';
import { AccountContainerComponent } from './containers/account-container/account-container.component';
import { ActivitiesComponent } from './containers/activities/activities.component';
import { ActivitySubscriptionsComponent } from './containers/activity-subscriptions/activity-subscriptions.component';
import { MyDataComponent } from './containers/my-data/my-data.component';
import { OrganisationSubscriptionsComponent } from './containers/organisation-subscriptions/organisation-subscriptions.component';
import { NotificationComponent } from './containers/notifications/notifications.component';
import { AuthGuardWithForcedLogin } from '../auth/guard/auth-guard-with-forced-login.service';
import { NotifiacationSuccessComponent } from './components/notifiacation-success/notifiacation-success.component';
import { AuthGuardWithRoleCheck } from '../auth/guard/auth-guard-with-role-check.service';
import { UserPermission } from '../auth/models/user-role';
import { HomeComponent } from './containers/home/home.component';
import { DeveloperComponent } from './containers/developer/developer.component';
import { OffersComponent } from './containers/offers/offers.component';
import { BestPracticesComponent } from './containers/best-practices/best-practices.component';
import { AuthGuardWithOrga } from '../auth/guard/auth-guard-with-orga.service';
import { DanActivitiesComponent } from './containers/dan-activities/dan-activities.component';
import { AuthGuardWithoutOrga } from '../auth/guard/auth-guard-without-orga.service';

const routes: Routes = [
  {
    path: '',
    component: AccountContainerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        canActivate: [AuthGuardWithForcedLogin]
      },
      {
        path: 'my-data',
        component: MyDataComponent,
        canActivate: [AuthGuardWithForcedLogin]
      },
      {
        path: 'developer',
        component: DeveloperComponent,
        canActivate: [AuthGuardWithForcedLogin]
      },
      {
        path: 'my-organisation',
        component: MyOrganisationComponent,
        canActivate: [AuthGuardWithForcedLogin, AuthGuardWithRoleCheck],
        data: {
          notRoles: [UserPermission.RNE_ADMIN]
        }
      },
      {
        path: 'offers',
        component: OffersComponent,
        canActivate: [
          AuthGuardWithForcedLogin,
          AuthGuardWithRoleCheck,
          AuthGuardWithOrga
        ],
        data: {
          redirectUrl: ['/', 'account', 'my-organisation'],
          notRoles: [UserPermission.RNE_ADMIN]
        }
      },
      {
        path: 'best-practices',
        component: BestPracticesComponent,
        canActivate: [
          AuthGuardWithForcedLogin,
          AuthGuardWithRoleCheck,
          AuthGuardWithOrga
        ],
        data: {
          redirectUrl: ['/', 'account', 'my-organisation'],
          notRoles: [UserPermission.RNE_ADMIN]
        }
      },
      {
        path: 'activities',
        component: ActivitiesComponent,
        canActivate: [
          AuthGuardWithForcedLogin,
          AuthGuardWithRoleCheck,
          AuthGuardWithOrga
        ],
        data: {
          redirectUrl: ['/', 'account', 'my-organisation'],
          notRoles: [UserPermission.RNE_ADMIN]
        }
      },
      {
        path: 'dan-activities',
        component: DanActivitiesComponent,
        canActivate: [
          AuthGuardWithForcedLogin,
          AuthGuardWithRoleCheck,
          AuthGuardWithoutOrga
        ],
        data: {
          redirectUrl: ['/', 'account', 'activities'],
          notRoles: [UserPermission.RNE_ADMIN]
        }
      },
      {
        path: 'organisation-subscriptions',
        component: OrganisationSubscriptionsComponent,
        canActivate: [AuthGuardWithForcedLogin]
      },
      {
        path: 'activity-subscriptions',
        component: ActivitySubscriptionsComponent,
        canActivate: [AuthGuardWithForcedLogin]
      },
      {
        path: 'notifications',
        redirectTo: 'my-data',
        pathMatch: 'full'
      },
      {
        path: 'notifications/completed',
        component: NotifiacationSuccessComponent
      },
      {
        path: 'notifications/:uuid',
        component: NotificationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
