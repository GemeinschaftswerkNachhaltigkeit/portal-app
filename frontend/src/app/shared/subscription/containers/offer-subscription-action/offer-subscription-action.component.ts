import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import { SubscriptionFacadeService } from '../../subscription-facade.service';

@Component({
  selector: 'app-offer-subscription-action',
  templateUrl: './offer-subscription-action.component.html',
  styleUrls: ['./offer-subscription-action.component.scss']
})
export class OfferSubscriptionActionComponent {
  @Input() offer?: OfferDto;
  @Input() full = false;
  @Input() short? = false;
  @Input() stroked = false;
  @Input() small = false;

  constructor(
    public subscriptionFacade: SubscriptionFacadeService,
    private translate: TranslateService
  ) {}

  bookmarkHandler(): void {
    this.subscriptionFacade.bookmarkOffer(
      this.offer?.id || -1,
      this.translate.instant('authModal.subtitleOffer', {
        offer: this.offer?.name
      })
    );
  }

  unbookmarkHandler(): void {
    this.subscriptionFacade.unbookmarkOffer(this.offer?.id || -1);
  }
}
