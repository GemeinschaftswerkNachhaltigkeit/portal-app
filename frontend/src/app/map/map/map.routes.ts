import { Routes } from '@angular/router';
import { DetailsCardComponent } from './containers/details-card/details-card.component';
import { MapContainerComponent } from './containers/map-container/map-container.component';

export const MAP_ROUTES: Routes = [
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
  }
];
