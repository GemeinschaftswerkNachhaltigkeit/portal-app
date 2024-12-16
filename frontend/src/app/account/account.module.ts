import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountContainerComponent } from './containers/account-container/account-container.component';
import { MatButtonModule } from '@angular/material/button';
import { AccountLayoutComponent } from './components/account-layout.component';
import { OrganisationSubscriptionsComponent } from './containers/organisation-subscriptions/organisation-subscriptions.component';
import { ActivitySubscriptionsComponent } from './containers/activity-subscriptions/activity-subscriptions.component';
import { MyDataComponent } from './containers/my-data/my-data.component';
import { MyDataFormComponent } from './components/my-data-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivitiesComponent } from './containers/activities/activities.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MyOrganisationComponent } from './containers/my-organisation/my-organisation.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthModule } from '../auth/auth.module';
import { NotifiacationSuccessComponent } from './components/notifiacation-success.component';
import { OrgaUserFormComponent } from './containers/my-organisation/orga-user-form/orga-user-form.component';
import { MatSelectModule } from '@angular/material/select';
import { OrgaUserListComponent } from './components/orga-user-list.component';
import { OrgaUserListEntryComponent } from './components/orga-user-list-entry.component';
import { OrgaUserListStatusComponent } from './components/orga-user-list-status.component';
import { OrgaUserListHeaderComponent } from './components/orga-user-list-header.component';
import { HomeComponent } from './containers/home/home.component';
import { DeveloperComponent } from './containers/developer/developer.component';
import { OffersComponent } from './containers/offers/offers.component';
import { BestPracticesComponent } from './containers/best-practices/best-practices.component';
import { MatMenuModule } from '@angular/material/menu';
import { DanActivitiesComponent } from './containers/dan-activities/dan-activities.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HeadingComponent } from '../shared/components/base/heading.component';
import { OutlinedIconComponent } from '../shared/components/base/outlined-icon.component';
import { ActionComponent } from '../shared/components/base/action.component';
import { AlertComponent } from '../shared/components/base/alert.component';
import { CardListComponent } from '../shared/components/cards/card-list.component';
import { BaseCardComponent } from '../shared/components/cards/base-card/base-card.component';
import { CharCountComponent } from '../shared/components/base/char-count.component';
import { NewBadgeComponent } from '../shared/components/base/badges/new-badge.component';
import { PageWithHeaderLayoutComponent } from '../shared/components/layout/page-with-header-layout.component';
import { ListWithHeadingLayoutComponent } from '../shared/components/layout/list-with-heading-layout.component';
import { PageMenuComponent } from '../shared/components/layout/page-menu/page-menu.component';
import { NotificationPageComponent } from '../shared/components/layout/notification-page/notification-page.component';
import { ContentWrapperComponent } from '../shared/components/layout/content-wrapper.component';
import { SpinnerComponent } from '../shared/components/base/spinner.component';
import { InfoCardComponent } from '../shared/components/cards/info-card.component';
import { FormFieldErrorComponent } from '../shared/components/form/form-field-error/form-field-error.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItemDirective } from '../shared/components/layout/page-menu/menu-item.directive';
import { MenuItemActiveDirective } from '../shared/components/layout/page-menu/menu-item-active.directive';
import { CardComponent } from '../marketplace/components/card.component';
import { BestPracticesFormComponent } from '../marketplace/containers/best-practices-form/best-practices-form.component';
import { NotificationComponent } from './containers/notifications.component';

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatMenuModule,
    MatDialogModule,
    HeadingComponent,
    OutlinedIconComponent,
    ActionComponent,
    AlertComponent,
    CardListComponent,
    BaseCardComponent,
    CharCountComponent,
    NewBadgeComponent,
    PageWithHeaderLayoutComponent,
    ListWithHeadingLayoutComponent,
    PageMenuComponent,
    NotificationPageComponent,
    ContentWrapperComponent,
    SpinnerComponent,
    InfoCardComponent,
    FormFieldErrorComponent,
    TranslateModule,
    MenuItemDirective,
    MenuItemActiveDirective,
    CardComponent,
    BestPracticesFormComponent,
    AccountLayoutComponent,
    MyDataFormComponent,
    NotifiacationSuccessComponent,
    OrgaUserListComponent,
    OrgaUserListEntryComponent,
    OrgaUserListHeaderComponent,
    OrgaUserListStatusComponent,
    AccountContainerComponent,
    ActivitiesComponent,
    ActivitySubscriptionsComponent,
    BestPracticesComponent,
    DanActivitiesComponent,
    DeveloperComponent,
    HomeComponent,
    MyDataComponent,
    MyOrganisationComponent,
    OffersComponent,
    OrgaUserFormComponent,
    OrganisationSubscriptionsComponent,
    NotificationComponent
  ]
})
export class AccountModule {}
