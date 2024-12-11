import { Routes } from '@angular/router';
import { EmbeddedMapContainerComponent } from './containers/embedded-map-container/embedded-map-container.component';
import { EmbeddedDetailsCardComponent } from './containers/embedded-details-card/embedded-details-card.component';

export const EMBEDDED_MAP_ROUTES: Routes = [
  {
    path: '',
    component: EmbeddedMapContainerComponent,
    children: [
      {
        path: ':type/:detail',
        component: EmbeddedDetailsCardComponent,
        data: { animation: 'mapDetails' }
      }
    ]
  }
];
