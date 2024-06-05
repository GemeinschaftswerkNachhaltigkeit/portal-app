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
    EventBadgesComponent
  ]
})
export class ActivityProfileModule {}
