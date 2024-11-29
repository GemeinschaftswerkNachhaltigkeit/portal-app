import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountContainerComponent } from './containers/account-container/account-container.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { AccountLayoutComponent } from './components/account-layout/account-layout.component';
import { OrganisationSubscriptionsComponent } from './containers/organisation-subscriptions/organisation-subscriptions.component';
import { ActivitySubscriptionsComponent } from './containers/activity-subscriptions/activity-subscriptions.component';
import { MyDataComponent } from './containers/my-data/my-data.component';
import { MyDataFormComponent } from './components/my-data-form/my-data-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivitiesComponent } from './containers/activities/activities.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MyOrganisationComponent } from './containers/my-organisation/my-organisation.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthModule } from '../auth/auth.module';
import { NotificationComponent } from './containers/notifications/notifications.component';
import { NotifiacationSuccessComponent } from './components/notifiacation-success/notifiacation-success.component';
import { OrgaUserFormComponent } from './containers/my-organisation/orga-user-form/orga-user-form.component';
import { MatSelectModule } from '@angular/material/select';
import { OrgaUserListComponent } from './components/orga-user-list/orga-user-list.component';
import { OrgaUserListEntryComponent } from './components/orga-user-list-entry/orga-user-list-entry.component';
import { OrgaUserListStatusComponent } from './components/orga-user-list-status/orga-user-list-status.component';
import { OrgaUserListHeaderComponent } from './components/orga-user-list-header/orga-user-list-header.component';
import { HomeComponent } from './containers/home/home.component';
import { DeveloperComponent } from './containers/developer/developer.component';
import { ApiKeyComponent } from './containers/developer/api-key/api-key.component';
import { ApiKeyContentComponent } from './containers/developer/api-key-content/api-key-content.component';
import { ApiKeyDocLinkComponent } from './containers/developer/api-key-doc-link/api-key-doc-link.component';
import { ApiKeyDocLinksComponent } from './containers/developer/api-key-doc-links/api-key-doc-links.component';
import { OffersComponent } from './containers/offers/offers.component';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { BestPracticesComponent } from './containers/best-practices/best-practices.component';
import { MatMenuModule } from '@angular/material/menu';
import { DanActivitiesComponent } from './containers/dan-activities/dan-activities.component';
import { DanHelpModalComponent } from './containers/dan-activities/dan-help-modal/dan-help-modal.component';
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

@NgModule({
  declarations: [
    AccountContainerComponent,
    AccountLayoutComponent,
    OrganisationSubscriptionsComponent,
    ActivitySubscriptionsComponent,
    MyDataComponent,
    MyDataFormComponent,
    ActivitiesComponent,
    MyOrganisationComponent,
    NotificationComponent,
    NotifiacationSuccessComponent,
    OrgaUserFormComponent,
    OrgaUserListComponent,
    OrgaUserListEntryComponent,
    OrgaUserListStatusComponent,
    OrgaUserListHeaderComponent,
    HomeComponent,
    DeveloperComponent,
    ApiKeyComponent,
    ApiKeyContentComponent,
    ApiKeyDocLinksComponent,
    ApiKeyDocLinkComponent,
    OffersComponent,
    BestPracticesComponent,
    DanActivitiesComponent,
    DanHelpModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MarketplaceModule,
    AuthModule,
    AccountRoutingModule,
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
    FormFieldErrorComponent
  ]
})
export class AccountModule {}
