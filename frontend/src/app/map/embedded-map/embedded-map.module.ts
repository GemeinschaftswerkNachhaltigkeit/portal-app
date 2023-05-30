import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMapModule } from '../shared-map.module';
import { EmbeddedMapRoutingModule } from './embedded-map-routing.module';
import { EmbeddedMapContainerComponent } from './containers/embedded-map-container/embedded-map-container.component';
import { EmbeddedMapLayoutComponent } from './components/map/embedded-map-layout/embedded-map-layout.component';
import { EmbeddedDetailsCardComponent } from './containers/embedded-details-card/embedded-details-card.component';
<<<<<<< HEAD
=======

// export const APP_DATE_FORMATS: MatDateFormats = {
//   parse: {
//     dateInput: 'D'
//   },
//   display: {
//     dateInput: 'dd.LL.yyyy',
//     monthYearLabel: 'LLL yyyy',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'LLL yyyy'
//   }
// };
>>>>>>> add EmbeddedDetailsCardComponent

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
