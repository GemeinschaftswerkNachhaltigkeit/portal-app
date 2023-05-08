import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Organisation from 'src/app/shared/models/organisation';
import { SubscriptionFacadeService } from '../../subscription-facade.service';

@Component({
  selector: 'app-organisation-subscription-action',
  templateUrl: './organisation-subscription-action.component.html',
  styleUrls: ['./organisation-subscription-action.component.scss']
})
export class OrganisationSubscriptionActionComponent {
  @Input() organisation?: Organisation;
  @Input() short? = false;
  @Input() stroked = false;
  @Input() small = false;

  constructor(
    public subscriptionFacade: SubscriptionFacadeService,
    private translate: TranslateService
  ) {}

  followHandler(): void {
    this.subscriptionFacade.followOrganisation(
      this.organisation?.id || -1,
      this.translate.instant('authModal.subtitleOrganisation', {
        organisation: this.organisation?.name
      })
    );
  }

  unfollowHandler(): void {
    this.subscriptionFacade.unfollowOrganisation(this.organisation?.id || -1);
  }
}
