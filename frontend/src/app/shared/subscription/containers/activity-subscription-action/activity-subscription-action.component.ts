import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Activity from 'src/app/shared/models/actvitiy';
import { SubscriptionFacadeService } from '../../subscription-facade.service';

@Component({
  selector: 'app-activity-subscription-action',
  templateUrl: './activity-subscription-action.component.html',
  styleUrls: ['./activity-subscription-action.component.scss']
})
export class ActivitySubscriptionActionComponent {
  @Input() activity?: Activity;
  @Input() full = false;
  @Input() short? = false;
  @Input() stroked = false;
  @Input() small = false;

  constructor(
    public subscriptionFacade: SubscriptionFacadeService,
    private translate: TranslateService
  ) {}

  bookmarkHandler(): void {
    this.subscriptionFacade.bookmarkActivity(
      this.activity?.id || -1,
      this.translate.instant('authModal.subtitleActivity', {
        activity: this.activity?.name
      })
    );
  }

  unbookmarkHandler(): void {
    this.subscriptionFacade.unbookmarkActivity(this.activity?.id || -1);
  }
}
