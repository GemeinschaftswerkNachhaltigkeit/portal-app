import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MapComponent } from './map/components/map/map.component';
import { DetailsLinkComponent } from './map/components/map/details-link/details-link.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    MapComponent,
    DetailsLinkComponent,
  ],
  imports: [
    MatIconModule,
    CommonModule,
    SharedModule
  ],
  exports: [
    MapComponent,
    DetailsLinkComponent,
    SharedModule,
    MatIconModule
  ],
})
export class SharedMapModule {}
