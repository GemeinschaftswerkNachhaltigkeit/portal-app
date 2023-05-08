import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import { SubscriptionFacadeService } from '../../subscription-facade.service';

@Component({
  selector: 'app-best-practice-subscription-action',
  templateUrl: './best-practice-subscription-action.component.html',
  styleUrls: ['./best-practice-subscription-action.component.scss']
})
export class BestPracticeSubscriptionActionComponent {
  @Input() bp?: BestPracticesDto;
  @Input() full = false;
  @Input() short? = false;
  @Input() stroked = false;
  @Input() small = false;

  constructor(
    public subscriptionFacade: SubscriptionFacadeService,
    private translate: TranslateService
  ) {}

  bookmarkHandler(): void {
    this.subscriptionFacade.bookmarkBestPractice(
      this.bp?.id || -1,
      this.translate.instant('authModal.subtitleBestPractice', {
        bp: this.bp?.name
      })
    );
  }

  unbookmarkHandler(): void {
    this.subscriptionFacade.unbookmarkBestPractice(this.bp?.id || -1);
  }
}
