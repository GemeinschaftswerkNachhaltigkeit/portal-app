import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmbeddedMapContainerComponent } from './containers/embedded-map-container/embedded-map-container.component';
import { EmbeddedMapDetailsCardComponent } from './containers/embedded-map-details-card/embedded-map-details-card.component';

const routes: Routes = [
  {
    path: '',
    component: EmbeddedMapContainerComponent,
    children: [
      {
        path: ':type/:detail',
        component: EmbeddedMapDetailsCardComponent,
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
