import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationListComponent } from './organisation-list/organisation-list.component';

const routes: Routes = [
  {
    path: '',
    component: OrganisationListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClearingRoutingModule {}
