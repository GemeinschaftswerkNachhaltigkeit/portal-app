import { Routes } from '@angular/router';
import { WizardComponent } from './containers/wizard/wizard.component';

export const ACTIVITY_ROUTES: Routes = [
  {
    path: ':orgId/:activityId',
    component: WizardComponent
  }
];
