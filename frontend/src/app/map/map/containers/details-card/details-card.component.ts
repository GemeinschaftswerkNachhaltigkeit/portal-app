import { Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import SearchResult from '../../../models/search-result';
import { CardService } from '../../../data/card.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { MarkerService } from '../../../data/marker.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DetailsLinkComponent } from 'src/app/map/components/details-link.component';
import { ExpiredBadgeComponent } from 'src/app/shared/components/base/badges/expired-badge.component';
import { OrgaBadgesComponent } from 'src/app/shared/components/base/badges/orga-badges.component';
import { ContentRowComponent } from 'src/app/shared/components/base/content-row.component';
import { SdgIconComponent } from 'src/app/shared/components/base/sdg-icon.component';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { CardLabelComponent } from 'src/app/shared/components/cards/card-label.component';
import { CardLogoComponent } from 'src/app/shared/components/cards/card-logo.component';
import { TopicComponent } from 'src/app/shared/components/base/topic.component';
import {
  ActivitySubscriptionActionComponent,
  OrganisationSubscriptionActionComponent
} from 'src/app/shared/components/subscription';
import { ImageComponent } from 'src/app/shared/components/base/image.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MapService } from 'src/app/map/data/map.service';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
@Component({
  selector: 'app-details-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    LoadingIndicatorComponent,
    ExpiredBadgeComponent,
    DetailsLinkComponent,
    CardLabelComponent,
    MatIconModule,
    CardLogoComponent,
    OrgaBadgesComponent,
    ContentRowComponent,
    SdgIconComponent,
    TranslateModule,
    TopicComponent,
    OrganisationSubscriptionActionComponent,
    ActivitySubscriptionActionComponent,
    ImageComponent,
    SpinnerComponent
  ],
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          height: '*'
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          height: 0
        })
      ),
      transition('open <=> closed', [animate('200ms')])
    ])
  ]
})
export class DetailsCardComponent {
  public mapService = inject(MapService);
  private route = inject(ActivatedRoute);
  public card = inject(CardService);
  public utils = inject(UtilsService);
  private marker = inject(MarkerService);

  mobile = input(false);

  currentResult?: SearchResult = undefined;
  remainingSdgsVisible = false;

  unsubscribe$ = new Subject();

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['type'] && params['id']) {
        this.mapService.getEntryByIdAndType(params['type'], +params['id']);
      }
    });
    toObservable(this.mapService.currentResult)
      .pipe(takeUntilDestroyed())
      .subscribe((res) => {
        this.currentResult = res || undefined;
      });
  }

  get bgImage(): string | undefined {
    return this.currentResult?.image;
  }

  getActivityType(currentResult: SearchResult): string {
    if (currentResult && currentResult.activityType) {
      return currentResult?.activityType;
    } else {
      return '';
    }
  }

  toggleRemainingSdgs(): void {
    this.remainingSdgsVisible = !this.remainingSdgsVisible;
  }

  close(): void {
    this.mapService.closeCard();
    this.marker.clearMarkerIcons();
  }

  showAsExpired(entity?: SearchResult): boolean {
    return entity?.resultType === 'DAN' && entity
      ? this.utils.isExpiredActivity(entity.period)
      : false;
  }
}
