import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EmbeddedMapFacade } from '../../../map-facade.service';
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
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { ExpiredBadgeComponent } from 'src/app/shared/components/base/badges/expired-badge.component';
import { DetailsLinkComponent } from 'src/app/map/components/details-link.component';
import { CardLabelComponent } from 'src/app/shared/components/cards/card-label.component';
import { MatIconModule } from '@angular/material/icon';
import { CardLogoComponent } from 'src/app/shared/components/cards/card-logo.component';
import { OrgaBadgesComponent } from 'src/app/shared/components/base/badges/orga-badges.component';
import { ContentRowComponent } from 'src/app/shared/components/base/content-row.component';
import { SdgIconComponent } from 'src/app/shared/components/base/sdg-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-embedded-details-card',
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
    TranslateModule
  ],
  templateUrl: './embedded-details-card.component.html',
  styleUrls: ['./embedded-details-card.component.scss'],
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
export class EmbeddedDetailsCardComponent implements OnInit {
  @Input() mobile = false;
  currentResult?: SearchResult = undefined;
  remainingSdgsVisible = false;
  unsubscribe$ = new Subject();

  constructor(
    private mapFacade: EmbeddedMapFacade,
    private route: ActivatedRoute,
    public card: CardService,
    public utils: UtilsService,
    private marker: SharedMarkerService,
    private imgService: ImgService
  ) {}

  get bgImage(): string | null {
    return this.imgService.url(this.currentResult?.image);
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
    return this.card.isActivity(entity?.resultType) && entity
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
