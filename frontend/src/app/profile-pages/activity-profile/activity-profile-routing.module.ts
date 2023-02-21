import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityProfileContainerComponent } from './containers/activity-profile-container/activity-profile-container.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityProfileContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityProfileRoutingModule {}
