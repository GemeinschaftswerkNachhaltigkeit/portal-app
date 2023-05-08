import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgaProfileContainerComponent } from './containers/orga-profile-container/orga-profile-container.component';

const routes: Routes = [
  {
    path: '',
    component: OrgaProfileContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgaProfileRoutingModule {}
