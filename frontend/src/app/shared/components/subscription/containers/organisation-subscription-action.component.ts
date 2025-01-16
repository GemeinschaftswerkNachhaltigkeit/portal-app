import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Organisation from 'src/app/shared/models/organisation';
import { SubscriptionFacadeService } from '../subscription-facade.service';
import { CommonModule } from '@angular/common';
import { ActionComponent } from '../../base/action.component';

@Component({
  selector: 'app-organisation-subscription-action',
  standalone: true,
  imports: [CommonModule, ActionComponent, TranslateModule],
  template: `@if (
      !subscriptionFacade.oganisationIsSubcribed(organisation?.id)
    ) {
      <app-action
        [clickable]="true"
        [stroked]="stroked"
        [small]="small"
        icon="add"
        (clicked)="followHandler()"
      >
        <span [ngClass]="{ small: small }">
          @if (!short) {
            <span>{{ 'btn.follow' | translate }}</span>
          }
          @if (short) {
            <span>{{ 'btn.followShort' | translate }}</span>
          }
        </span>
      </app-action>
    }
    @if (subscriptionFacade.oganisationIsSubcribed(organisation?.id)) {
      <app-action
        [clickable]="true"
        [stroked]="stroked"
        [small]="small"
        icon="check"
        (clicked)="unfollowHandler()"
      >
        <span [ngClass]="{ small: small }">
          @if (!short) {
            <span>{{ 'btn.unfollow' | translate }}</span>
          }
          @if (short) {
            <span>{{ 'btn.unfollowShort' | translate }}</span>
          }
        </span>
      </app-action>
    }`,
  styles: `
    .small {
      span {
        font-size: 1.2rem;
      }
    }
  `
})
export class OrganisationSubscriptionActionComponent {
  @Input() organisation?: Organisation;
  @Input() short? = false;
  @Input() stroked = false;
  @Input() small = false;

  constructor(
    public subscriptionFacade: SubscriptionFacadeService,
    private translate: TranslateService
  ) {}

  followHandler(): void {
    this.subscriptionFacade.followOrganisation(
      this.organisation?.id || -1,
      this.translate.instant('authModal.subtitleOrganisation', {
        organisation: this.organisation?.name
      })
    );
  }

  unfollowHandler(): void {
    this.subscriptionFacade.unfollowOrganisation(this.organisation?.id || -1);
  }
}
