import { Component } from '@angular/core';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import Activity from 'src/app/shared/models/actvitiy';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ActiFacadeService } from '../../acti-facade.service';
import { CommonModule } from '@angular/common';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { CardListComponent } from 'src/app/shared/components/cards/card-list.component';
import { BaseCardComponent } from 'src/app/shared/components/cards/base-card/base-card.component';

@Component({
  selector: 'app-activity-subscriptions',
  standalone: true,
  imports: [
    CommonModule,
    PageWithHeaderLayoutComponent,
    TranslateModule,
    LoadingIndicatorComponent,
    CardListComponent,
    BaseCardComponent
  ],
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
