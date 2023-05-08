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
    RouterModule
  ]
})
export class OrgaProfileModule {}
