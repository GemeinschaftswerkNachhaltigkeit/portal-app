import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { InternalMapFacade } from '../../../map-facade.service';
import SearchResult from '../../../models/search-result';
import { CardService } from '../../../services/card.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { SharedMarkerService } from '../../../services/marker.service';
import { ImgService } from 'src/app/shared/services/img.service';
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
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { CardLabelComponent } from 'src/app/shared/components/cards/card-label.component';
import { CardLogoComponent } from 'src/app/shared/components/cards/card-logo.component';
import { TopicComponent } from 'src/app/shared/components/base/topic.component';
import {
  ActivitySubscriptionActionComponent,
  OrganisationSubscriptionActionComponent
} from 'src/app/shared/components/subscription';
import { ImageComponent } from 'src/app/shared/components/base/image.component';
@Component({
  selector: 'app-details-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    SpinnerComponent,
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
    ImageComponent
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
export class DetailsCardComponent implements OnInit {
  @Input() mobile = false;
  currentResult?: SearchResult = undefined;
  remainingSdgsVisible = false;
  unsubscribe$ = new Subject();

  constructor(
    private mapFacade: InternalMapFacade,
    private router: Router,
    private route: ActivatedRoute,
    public card: CardService,
    public utils: UtilsService,
    private marker: SharedMarkerService,
    private imgService: ImgService
  ) {}

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
    this.mapFacade.closeCard();
    this.marker.clearMarkerIcons();
  }

  showAsExpired(entity?: SearchResult): boolean {
    return entity?.resultType === 'DAN' && entity
      ? this.utils.isExpiredActivity(entity.period)
      : false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['type'] && params['id']) {
        this.mapFacade.getById(params['type'], +params['id']);
      }
    });
    this.mapFacade.currentResult$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.currentResult = res || undefined;
      });
  }
}
