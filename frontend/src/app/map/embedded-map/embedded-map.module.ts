import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMapModule } from '../shared-map.module';
import { EmbeddedMapRoutingModule } from './embedded-map-routing.module';
import { EmbeddedMapContainerComponent } from './containers/embedded-map-container/embedded-map-container.component';
import { EmbeddedMapLayoutComponent } from './components/map/embedded-map-layout/embedded-map-layout.component';
import { EmbeddedDetailsCardComponent } from './containers/embedded-details-card/embedded-details-card.component';
import { EmbeddedMapComponent } from './components/map/embedded-map.component';
import { OrgaBadgesComponent } from 'src/app/shared/standalone/base/badges/orga-badges.component';
import { MatButtonModule } from '@angular/material/button';
import { ExpiredBadgeComponent } from 'src/app/shared/standalone/base/badges/expired-badge.component';
import { CardLabelComponent } from 'src/app/shared/standalone/cards/card-label.component';
import { ContentRowComponent } from 'src/app/shared/standalone/base/content-row.component';
import { CardLogoComponent } from 'src/app/shared/standalone/cards/card-logo.component';

@NgModule({
  declarations: [
    EmbeddedMapContainerComponent,
    EmbeddedMapLayoutComponent,
    EmbeddedDetailsCardComponent,
    EmbeddedMapComponent
  ],
  imports: [
    EmbeddedMapRoutingModule,
    SharedMapModule,
    CommonModule,
    OrgaBadgesComponent,
    MatButtonModule,
    ExpiredBadgeComponent,
    CardLabelComponent,
    ContentRowComponent,
    CardLogoComponent
  ]
})
export class EmbeddedMapModule {}
