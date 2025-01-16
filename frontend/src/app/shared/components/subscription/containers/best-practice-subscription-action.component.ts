import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import { SubscriptionFacadeService } from '../subscription-facade.service';
import { CommonModule } from '@angular/common';
import { ActionComponent } from '../../base/action.component';

@Component({
  selector: 'app-best-practice-subscription-action',
  standalone: true,
  imports: [CommonModule, ActionComponent, TranslateModule],
  template: `@if (!subscriptionFacade.bestPracticeIsSubcribed(bp?.id)) {
      <app-action
        [clickable]="true"
        [stroked]="stroked"
        [small]="small"
        [full]="full"
        [disabled]="true"
        icon="bookmark_add"
        (clicked)="bookmarkHandler()"
      >
        <span [ngClass]="{ small: small }">
          @if (!short) {
            <span>{{ 'btn.bookmark' | translate }}</span>
          }
          @if (short) {
            <span>{{ 'btn.bookmarkShort' | translate }}</span>
          }
        </span>
      </app-action>
    }

    @if (subscriptionFacade.bestPracticeIsSubcribed(bp?.id)) {
      <app-action
        [clickable]="true"
        [stroked]="stroked"
        [small]="small"
        [full]="full"
        [disabled]="true"
        icon="bookmark_added"
        (clicked)="unbookmarkHandler()"
      >
        <span [ngClass]="{ small: small }">
          @if (!short) {
            <span>{{ 'btn.unbookmark' | translate }}</span>
          }
          @if (short) {
            <span>{{ 'btn.unbookmarkShort' | translate }}</span>
          }
        </span>
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
