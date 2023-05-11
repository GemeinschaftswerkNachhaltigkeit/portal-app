import { NgModule } from '@angular/core';
// import { SharedModule } from '../shared/shared.module';
import { MapComponent } from './map/components/map/map.component';


@NgModule({
  declarations: [
    MapComponent,
  ],
  exports: [
    MapComponent,
  ],
})
export class SharedMapModule {}
