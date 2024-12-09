import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityProfileContainerComponent } from './containers/activity-profile-container/activity-profile-container.component';
import { ActivityProfileRoutingModule } from './activity-profile-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePagesModule } from '../profile-pages.module';
import { RouterModule } from '@angular/router';
import { EventBadgesComponent } from 'src/app/shared/components/base/badges/event-badges.component copy';
import {
  BreadcrumbsComponent,
  BreadcrumbComponent
} from 'src/app/shared/components/base/breadcrumb';
import { ActionComponent } from 'src/app/shared/components/base/action.component';
import { AlertComponent } from 'src/app/shared/components/base/alert.component';
import { ActivitySubscriptionActionComponent } from 'src/app/shared/components/subscription';
import { HtmlWrapperComponent } from 'src/app/shared/components/base/html-wrapper.component';
import { PageMenuComponent } from 'src/app/shared/components/layout/page-menu/page-menu.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { SdgIconComponent } from 'src/app/shared/components/base/sdg-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItemDirective } from 'src/app/shared/components/layout/page-menu/menu-item.directive';
import { MenuItemActiveDirective } from 'src/app/shared/components/layout/page-menu/menu-item-active.directive';

@NgModule({
  declarations: [ActivityProfileContainerComponent],
  imports: [
    CommonModule,
    RouterModule,
    ProfilePagesModule,
    ActivityProfileRoutingModule,
    MatButtonModule,
    MatIconModule,
    EventBadgesComponent,
    BreadcrumbsComponent,
    BreadcrumbComponent,
    ActionComponent,
    AlertComponent,
    ActivitySubscriptionActionComponent,
    HtmlWrapperComponent,
    PageMenuComponent,
    SpinnerComponent,
    SdgIconComponent,
    TranslateModule,
    MenuItemDirective,
    MenuItemActiveDirective
  ]
})
export class ActivityProfileModule {}
