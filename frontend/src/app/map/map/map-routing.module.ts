import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsCardComponent } from './containers/details-card/details-card.component';
import { MapContainerComponent } from './containers/map-container/map-container.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule {}
