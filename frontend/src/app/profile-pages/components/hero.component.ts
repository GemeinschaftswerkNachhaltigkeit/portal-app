import { Component, Input } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/utils.service';
import Type from '../../shared/models/type';
import { ImgService } from '../../shared/services/img.service';
import { ImageMode } from 'src/app/shared/components/form/upload-image/upload-image.component';
import { CommonModule } from '@angular/common';
import { ImageComponent } from 'src/app/shared/components/base/image.component';
import { ExpiredBadgeComponent } from 'src/app/shared/components/base/badges/expired-badge.component';
import { CardLogoComponent } from 'src/app/shared/components/cards/card-logo.component';
import { CardLabelComponent } from 'src/app/shared/components/cards/card-label.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    ImageComponent,
    ExpiredBadgeComponent,
    CardLogoComponent,
    CardLabelComponent
  ],
  template: `
    <header class="header">
      <div class="expiredOverlay" *ngIf="isExpired"></div>

      <div class="img">
        <app-image
          [src]="bgImageName"
          alt="header"
          [mode]="imageMode"
          *ngIf="bgImageName"
        />
      </div>
      <div class="expiredBadge" *ngIf="isExpired">
        <app-expired-badge [dan]="dan"></app-expired-badge>
      </div>
      <div class="type">
        <app-card-label
          [type]="types?.resultType"
          [dan]="dan"
          [activityTypeLabel]="activityTypeLabel"
          [organisationTypeLabel]="organisationTypeLabel"
        ></app-card-label>
      </div>
      <div
        id="profile-logo"
        class="logo"
        [class]="types?.resultType || ''"
        [ngClass]="{ noLogo: !logo }"
      >
        <div class="expiredOverlay logo-overlay" *ngIf="isExpired"></div>
        <app-card-logo
          *ngIf="logo"
          [logoUrl]="logo"
          [name]="name"
        ></app-card-logo>
        <div
          *ngIf="period && utils.dateRangeString(period)"
          class="label"
          [ngClass]="{ dan: dan }"
        >
          <div class="expiredOverlay" *ngIf="isExpired"></div>
          {{ utils.dateRangeString(period) }}
        </div>
      </div>
    </header>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    $navColumn: 16.8rem;
    $contactColumn: 37.6rem;
    $logoSize: 12.8rem;

    .header {
      height: 27.6rem;
      width: 100%;
      position: relative;
      z-index: $z1;

      // background-color: $blue-light;
      .img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }

      .expiredOverlay {
        position: absolute;
        z-index: 2;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.7);

        &.logo-overlay {
          left: -2px;
          right: -2px;
          top: -2px;
          bottom: -2px;
        }
      }

      .type {
        position: absolute;
        bottom: -$spacing-4;
        left: calc($spacing-1 + #{$spacing-1} + #{$logoSize});
        z-index: 3;
      }

      .expiredBadge {
        z-index: $z4;
        position: absolute;
        left: $spacing-1;
        bottom: -2.2rem;
      }

      .logo {
        height: $logoSize;
        width: $logoSize;
        object-fit: cover;
        border: 2px solid $gray-light;
        position: absolute;
        bottom: $spacing-1;
        z-index: 3;
        left: $spacing-1;

        .label {
          padding: $spacing-2;
          color: white;
          position: absolute;
          bottom: -3.9rem;
          left: -2px;
          width: 22rem;
          text-align: center;
        }

        &.ORGANISATION {
          border: 2px solid $orange;
          .label {
            background-color: $orange;
          }
        }
        &.ACTIVITY {
          border: 2px solid $green;

          .label {
            background-color: $green;
            &.dan {
              background-color: $dan-blue;
            }
          }
        }
        &.noLogo {
          border: none;
          .label {
            left: 0;
          }
        }
      }
    }

    @media screen and (min-width: $breakpoint-sm) {
      .header {
        .expiredBadge {
          left: calc(#{$navColumn} + #{$spacing-4});
        }
        .logo {
          left: calc(#{$navColumn} + #{$spacing-4});
          bottom: -$spacing-8;
          .label {
            left: calc(100% + #{$spacing-8});
            bottom: 1.5rem;
          }
        }
        .type {
          left: calc(
            #{$navColumn} + #{$spacing-4} + #{$logoSize} + #{$spacing-4}
          );
        }
      }
    }
  `
})
export class HeroComponent {
  @Input() bgImageName? = '';
  @Input() imageMode?: ImageMode = 'cover';
  @Input() name? = '';
  @Input() logo? = '';
  @Input() types?: Type = {};
  @Input() dan = false;
  @Input() organisationTypeLabel? = '';
  @Input() activityTypeLabel? = '';
  @Input() period?: {
    start: string;
    end: string;
  };
  @Input() isExpired = false;

  constructor(
    public utils: UtilsService,
    private imgService: ImgService
  ) {}
}
