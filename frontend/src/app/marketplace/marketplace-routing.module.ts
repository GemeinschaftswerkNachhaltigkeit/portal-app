import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardWithForcedLogin } from '../auth/guard/auth-guard-with-forced-login.service';
import { MarketplaceSearchComponent } from './containers/marketplace-search/marketplace-search.component';
import { BestPracticesFormComponent } from './containers/best-practices-form/best-practices-form.component';
import { OffersFormComponent } from './containers/offers-form/offers-form.component';
import { MarketplaceItemDetailsComponent } from './containers/marketplace-item-details/marketplace-item-details.component';

const routes: Routes = [
  {
    path: 'search',
    component: MarketplaceSearchComponent
  },
  {
    path: 'search/:itemId',
    component: MarketplaceItemDetailsComponent
  },
  {
    path: 'offers/:orgId/:uuid',
    component: OffersFormComponent,
    canActivate: [AuthGuardWithForcedLogin]
  },
  {
    path: 'best-practices/:orgId/:uuid',
    component: BestPracticesFormComponent,
    canActivate: [AuthGuardWithForcedLogin]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplcaeRoutingModule {}
