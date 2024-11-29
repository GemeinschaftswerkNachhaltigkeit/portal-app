import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import { SubscriptionFacadeService } from '../subscription-facade.service';
import { CommonModule } from '@angular/common';
import { ActionComponent } from '../../base/action.component';

@Component({
  selector: 'app-offer-subscription-action',
  standalone: true,
  imports: [CommonModule, ActionComponent, TranslateModule],
  template: `<app-action
      [clickable]="true"
      [stroked]="stroked"
      [small]="small"
      [full]="full"
      [disabled]="true"
      *ngIf="!subscriptionFacade.offerIsSubcribed(offer?.id)"
      icon="bookmark_add"
      (clicked)="bookmarkHandler()"
    >
      <span [ngClass]="{ small: small }">
        <span *ngIf="!short">{{ 'btn.bookmark' | translate }}</span>
        <span *ngIf="short">{{ 'btn.bookmarkShort' | translate }}</span>
      </span>
    </app-action>

    <app-action
      [clickable]="true"
      [stroked]="stroked"
      [small]="small"
      [full]="full"
      [disabled]="true"
      *ngIf="subscriptionFacade.offerIsSubcribed(offer?.id)"
      icon="bookmark_added"
      (clicked)="unbookmarkHandler()"
    >
      <span [ngClass]="{ small: small }">
        <span *ngIf="!short">{{ 'btn.unbookmark' | translate }}</span>
        <span *ngIf="short">{{ 'btn.unbookmarkShort' | translate }}</span>
      </span>
    </app-action> `,
  styles: `
    :host {
      display: flex;
      width: 100%;
    }
    .small {
      span {
        font-size: 1.2rem;
      }
    }
  `
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
