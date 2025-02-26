import { Routes } from '@angular/router';
import { OrganisationListComponent } from './containers/organisation-list/organisation-list.component';

export const CLEARING_ROUTES: Routes = [
  {
    path: '',
    component: OrganisationListComponent
  }
];
