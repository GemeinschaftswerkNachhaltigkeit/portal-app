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
@Component({
  selector: 'app-details-card',
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
