import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgaProfileRoutingModule } from './orga-profile-routing.module';
import { ProfilePagesModule } from '../profile-pages.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListItemComponent } from './components/list-item/list-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabButtonComponent } from './components/tabs/tab-button.component';
import { TabButtonsComponent } from './components/tabs/tab-buttons.component';
import { TabComponent } from './components/tabs/tab.component';
import { OrgaProfileContainerComponent } from './containers/orga-profile-container/orga-profile-container.component';
import { OrgaBadgesComponent } from 'src/app/shared/components/base/badges/orga-badges.component';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import {
  BreadcrumbComponent,
  BreadcrumbsComponent
} from 'src/app/shared/components/base/breadcrumb';
import { ExpiredBadgeComponent } from 'src/app/shared/components/base/badges/expired-badge.component';
import { AlertComponent } from 'src/app/shared/components/base/alert.component';
import { ActionComponent } from 'src/app/shared/components/base/action.component';
import {
  ActivitySubscriptionActionComponent,
  OrganisationSubscriptionActionComponent
} from 'src/app/shared/components/subscription';
import { CategoryComponent } from 'src/app/shared/components/base/category.component';
import { HtmlWrapperComponent } from 'src/app/shared/components/base/html-wrapper.component';
import { PageMenuComponent } from 'src/app/shared/components/layout/page-menu/page-menu.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { SdgIconComponent } from 'src/app/shared/components/base/sdg-icon.component';

@NgModule({
  declarations: [
    OrgaProfileContainerComponent,
    ListItemComponent,
    TabsComponent,
    TabButtonComponent,
    TabButtonsComponent,
    TabComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProfilePagesModule,
    OrgaProfileRoutingModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    OrgaBadgesComponent,
    HeadingComponent,
    BreadcrumbsComponent,
    BreadcrumbComponent,
    ExpiredBadgeComponent,
    AlertComponent,
    ActionComponent,
    ActivitySubscriptionActionComponent,
    OrganisationSubscriptionActionComponent,
    CategoryComponent,
    HtmlWrapperComponent,
    PageMenuComponent,
    SpinnerComponent,
    SdgIconComponent
  ]
})
export class OrgaProfileModule {}
