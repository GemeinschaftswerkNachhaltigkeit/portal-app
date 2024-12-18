import { Routes } from '@angular/router';
import { MyOrganisationComponent } from './containers/my-organisation/my-organisation.component';
import { AccountContainerComponent } from './containers/account-container/account-container.component';
import { ActivitiesComponent } from './containers/activities/activities.component';
import { ActivitySubscriptionsComponent } from './containers/activity-subscriptions/activity-subscriptions.component';
import { MyDataComponent } from './containers/my-data/my-data.component';
import { OrganisationSubscriptionsComponent } from './containers/organisation-subscriptions/organisation-subscriptions.component';
import { AuthGuardWithForcedLogin } from '../auth/guard/auth-guard-with-forced-login.service';
import { NotifiacationSuccessComponent } from './components/notifiacation-success.component';
import { VerifyRoles } from '../auth/guard/verify-roles';
import { UserPermission } from '../auth/models/user-role';
import { HomeComponent } from './containers/home/home.component';
import { DeveloperComponent } from './containers/developer/developer.component';
import { OffersComponent } from './containers/offers/offers.component';
import { BestPracticesComponent } from './containers/best-practices/best-practices.component';
import { AuthGuardWithOrga } from '../auth/guard/auth-guard-with-orga.service';
import { DanActivitiesComponent } from './containers/dan-activities/dan-activities.component';
import { AuthGuardWithoutOrga } from '../auth/guard/auth-guard-without-orga.service';
import { NotificationComponent } from './containers/notifications.component';

export const ACCOUNT_ROUTES: Routes = [
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
        canActivate: [AuthGuardWithForcedLogin, VerifyRoles],
        data: {
          notRoles: [UserPermission.RNE_ADMIN]
        }
      },
      {
        path: 'offers',
        component: OffersComponent,
        canActivate: [AuthGuardWithForcedLogin, VerifyRoles, AuthGuardWithOrga],
        data: {
          redirectUrl: ['/', 'account', 'my-organisation'],
          notRoles: [UserPermission.RNE_ADMIN]
        }
      },
      {
        path: 'best-practices',
        component: BestPracticesComponent,
        canActivate: [AuthGuardWithForcedLogin, VerifyRoles, AuthGuardWithOrga],
        data: {
          redirectUrl: ['/', 'account', 'my-organisation'],
          notRoles: [UserPermission.RNE_ADMIN]
        }
      },
      {
        path: 'activities',
        component: ActivitiesComponent,
        canActivate: [AuthGuardWithForcedLogin, VerifyRoles, AuthGuardWithOrga],
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
          VerifyRoles,
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
