import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmbeddedMapContainerComponent } from './containers/embedded-map-container/embedded-map-container.component';
import { DetailsCardComponent } from '../map/containers/details-card/details-card.component';

const routes: Routes = [
  {
    path: '',
    component: EmbeddedMapContainerComponent,
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
export class EmbeddedMapRoutingModule {}
