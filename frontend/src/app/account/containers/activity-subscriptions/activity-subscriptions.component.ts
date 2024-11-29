import { Component } from '@angular/core';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import Activity from 'src/app/shared/models/actvitiy';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ActiFacadeService } from '../../acti-facade.service';

@Component({
  selector: 'app-activity-subscriptions',
  templateUrl: './activity-subscriptions.component.html',
  styleUrls: ['./activity-subscriptions.component.scss']
})
export class ActivitySubscriptionsComponent {
  activitySubscriptions$ = this.subscriptionFacade.activitySubscriptions$;
  loading$ = this.loader.isLoading$();

  constructor(
    private subscriptionFacade: SubscriptionFacadeService,
    public actiFacade: ActiFacadeService,
    private loader: LoadingService
  ) {}

  unbookmarkHandler(activityId: number): void {
    this.subscriptionFacade.unbookmarkActivity(activityId);
  }

  openActivity(acti: Activity): void {
    this.actiFacade.openActivity(acti);
  }
}
