import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgasContainerComponent } from './containers/orgas-container/orgas-container.component';

const routes: Routes = [
  {
    path: '',
    component: OrgasContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationsRoutingModule {}
