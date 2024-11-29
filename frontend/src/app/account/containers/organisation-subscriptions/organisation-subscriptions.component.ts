import { Component } from '@angular/core';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import Organisation from 'src/app/shared/models/organisation';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { OrgaFacadeService } from '../../orga-facade.service';

@Component({
  selector: 'app-organisation-subscriptions',
  templateUrl: './organisation-subscriptions.component.html',
  styleUrls: ['./organisation-subscriptions.component.scss']
})
export class OrganisationSubscriptionsComponent {
  orgaSubscriptions$ = this.subscriptionFacade.organisationSubscriptions$;
  loading$ = this.loader.isLoading$();

  constructor(
    public orgaFacade: OrgaFacadeService,
    private subscriptionFacade: SubscriptionFacadeService,
    private loader: LoadingService
  ) {}

  unfollowHandler(orgaId: number): void {
    this.subscriptionFacade.unfollowOrganisation(orgaId);
  }

  openOrga(orga: Organisation): void {
    this.orgaFacade.openOrga(orga);
  }
}
