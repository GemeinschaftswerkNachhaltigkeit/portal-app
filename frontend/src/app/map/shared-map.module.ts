import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MapComponent } from './map/components/map/map.component';
import { DetailsCardComponent } from './map/containers/details-card/details-card.component';
import { DetailsLinkComponent } from './map/components/map/details-link/details-link.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    MapComponent,
    DetailsCardComponent,
    DetailsLinkComponent,
  ],
  imports: [
    MatIconModule,
    CommonModule,
    SharedModule
  ],
  exports: [
    MapComponent,
    DetailsCardComponent,
    DetailsLinkComponent,
    SharedModule
  ],
})
export class SharedMapModule {}
