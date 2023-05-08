import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizardComponent } from './containers/wizard/wizard.component';

const routes: Routes = [
  {
    path: ':orgId/:activityId',
    component: WizardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanRoutingModule {}
