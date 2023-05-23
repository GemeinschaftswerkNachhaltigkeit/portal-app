import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMapModule } from '../shared-map.module';
import { EmbeddedMapRoutingModule } from './embedded-map-routing.module';
import { EmbeddedMapContainerComponent } from './containers/embedded-map-container/embedded-map-container.component';
import { EmbeddedMapLayoutComponent } from './components/map/embedded-map-layout/embedded-map-layout.component';
import { EmbeddedDetailsCardComponent } from './containers/embedded-details-card/embedded-details-card.component';

@NgModule({
  declarations: [
    EmbeddedMapContainerComponent,
    EmbeddedMapLayoutComponent,
    EmbeddedDetailsCardComponent
  ],
  imports: [
    EmbeddedMapRoutingModule,
    SharedMapModule,
    CommonModule
  ]
})
export class EmbeddedMapModule {}
