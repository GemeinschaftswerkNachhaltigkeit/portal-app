import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Activity from 'src/app/shared/models/actvitiy';
import { SubscriptionFacadeService } from '../subscription-facade.service';
import { CommonModule } from '@angular/common';
import { ActionComponent } from '../../base/action.component';

@Component({
  selector: 'app-activity-subscription-action',
  standalone: true,
  imports: [CommonModule, ActionComponent, TranslateModule],
  template: `@if (!subscriptionFacade.activityIsSubcribed(activity?.id)) {
      <app-action
        [clickable]="true"
        [stroked]="stroked"
        [small]="small"
        [full]="full"
        icon="bookmark_add"
        [onlyIcon]="onlyIcon"
        (clicked)="bookmarkHandler()"
      >
        @if (!onlyIcon) {
          <span [ngClass]="{ small: small }">
            @if (!short) {
              <span>{{ 'btn.bookmark' | translate }}</span>
            }
            @if (short) {
              <span>{{ 'btn.bookmarkShort' | translate }}</span>
            }
          </span>
        }
      </app-action>
    }
    @if (subscriptionFacade.activityIsSubcribed(activity?.id)) {
      <app-action
        [clickable]="true"
        [stroked]="stroked"
        [small]="small"
        [full]="full"
        icon="bookmark_added"
        [onlyIcon]="onlyIcon"
        (clicked)="unbookmarkHandler()"
      >
        @if (!onlyIcon) {
          <span [ngClass]="{ small: small }">
            @if (!short) {
              <span>{{ 'btn.unbookmark' | translate }}</span>
            }
            @if (short) {
              <span>{{ 'btn.unbookmarkShort' | translate }}</span>
            }
          </span>
        }
      </app-action>
    }`,
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
export class ActivitySubscriptionActionComponent {
  @Input() activity?: Activity;
  @Input() full = false;
  @Input() onlyIcon = false;
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
