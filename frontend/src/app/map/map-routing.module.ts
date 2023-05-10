import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmbeddedMapContainerComponent } from './embedded-map/containers/embedded-map-container/embedded-map-container.component';
import { DetailsCardComponent } from './map/containers/details-card/details-card.component';
import { MapContainerComponent } from './map/containers/map-container/map-container.component';

const routes: Routes = [
  {
    path: '',
    component: MapContainerComponent,
    children: [
      {
        path: ':type/:detail',
        component: DetailsCardComponent,
        data: { animation: 'mapDetails' }
      }
    ]
  },
  {
    path: 'embeddedMap',
    component: EmbeddedMapContainerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule {}
