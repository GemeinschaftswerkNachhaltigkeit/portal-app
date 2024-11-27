import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityProfileContainerComponent } from './containers/activity-profile-container/activity-profile-container.component';
import { ActivityProfileRoutingModule } from './activity-profile-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfilePagesModule } from '../profile-pages.module';
import { RouterModule } from '@angular/router';
import { EventBadgesComponent } from 'src/app/shared/standalone/base/badges/event-badges.component copy';
import {
  BreadcrumbsComponent,
  BreadcrumbComponent
} from 'src/app/shared/standalone/base/breadcrumb';
import { ActionComponent } from 'src/app/shared/standalone/base/action.component';
import { AlertComponent } from 'src/app/shared/standalone/base/alert.component';

@NgModule({
  declarations: [ActivityProfileContainerComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ProfilePagesModule,
    ActivityProfileRoutingModule,
    MatButtonModule,
    MatIconModule,
    EventBadgesComponent,
    BreadcrumbsComponent,
    BreadcrumbComponent,
    ActionComponent,
    AlertComponent
  ]
})
export class ActivityProfileModule {}
