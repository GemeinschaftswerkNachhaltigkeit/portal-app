import { Component } from '@angular/core';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import Organisation from 'src/app/shared/models/organisation';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { OrgaFacadeService } from '../../orga-facade.service';
import { CommonModule } from '@angular/common';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { CardListComponent } from 'src/app/shared/components/cards/card-list.component';
import { BaseCardComponent } from 'src/app/shared/components/cards/base-card/base-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-organisation-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    PageWithHeaderLayoutComponent,
    SpinnerComponent,
    CardListComponent,
    BaseCardComponent,
    TranslateModule
  ],
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
