import { Component, EventEmitter, Input, Output } from '@angular/core';
import EventDto from '../models/event-dto';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { CommonModule } from '@angular/common';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { RouterModule } from '@angular/router';
import { ActivitySubscriptionActionComponent } from 'src/app/shared/components/subscription';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CommonModule,
    OutlinedIconComponent,
    RouterModule,
    ActivitySubscriptionActionComponent
  ],
  template: `
    <div
      class="event"
      [ngClass]="{ dan: event.resultType === 'DAN', last: last }"
    >
      <div class="content">
        <div (click)="open(event)">
          <h3 class="title">{{ event.name }}</h3>
          <div class="location">
            <div class="city">
              <app-outlined-icon>pin_drop</app-outlined-icon>
              <div>{{ utils.locationString(event.location) }}</div>
            </div>
            <div class="name">{{ event.location?.address?.name || '' }}</div>
          </div>
        </div>
        @if (event.organisation) {
          <div>
            <a [routerLink]="['/', 'organisations', event.organisation.id]">{{
              event.organisation.name
            }}</a>
          </div>
        }
      </div>

      <div class="actions">
        <!--
        <app-action
          [clickable]="true"
          icon="launch"
          [onlyIcon]="true"
          (clicked)="open(event)"
          >
        </app-action>
        -->
        <div style="width: 40px"></div>
        <app-activity-subscription-action
          [onlyIcon]="true"
          [activity]="utils.asActivity(event)"
        >
        </app-activity-subscription-action>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    :host {
      width: 100%;
    }

    .event {
      padding: $spacing-4;
      box-shadow: 0 1px 0 0 $gray-light inset;
      display: flex;
      flex-direction: column;
      gap: $spacing-4;
      position: relative;

      &:hover {
        background-color: $gray-light;
        cursor: pointer;
      }

      &.last {
        box-shadow:
          0 1px 0 0 $gray-light inset,
          0 -1px 0 0 $gray-light inset;
      }

      &::before {
        content: '';
        height: 100%;
        width: 4px;
        background-color: $green;
        position: absolute;
        left: -4px;
        top: 0;
      }

      &.dan {
        &::before {
          background-color: $dan-blue;
        }
      }

      .content {
        flex-shrink: 1;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        gap: $spacing-4;
        .title {
          font-weight: bold;
          padding: 0;
          margin: 0;
          overflow-wrap: break-word;
          word-wrap: break-word;
          hyphens: auto;
        }

        .location {
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: $spacing-4;
          flex-shrink: 0;

          .city {
            display: flex;
            align-items: center;
            gap: $spacing-2;
          }

          .name {
            text-decoration: underline;
          }
        }
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: fit-content;
      }
    }

    @media screen and (min-width: $breakpoint-xs) {
      .event {
        flex-direction: row;
        justify-content: space-between;
        .content {
          width: calc(100% - 80px - #{$spacing-4});
        }
        .actions {
          width: 80px;
          align-items: flex-end;
        }
      }
    }
  `
})
export class EventComponent {
  @Input() event!: EventDto;
  @Input() last = false;
  @Output() clicked = new EventEmitter<{ orgaId: number; actiId: number }>();

  constructor(public utils: UtilsService) {}

  open(event: EventDto): void {
    const orgaId = event.organisation?.id;

    if (orgaId !== undefined && orgaId !== null && event.id) {
      this.clicked.emit({ orgaId: orgaId, actiId: event.id });
    }
  }
}
