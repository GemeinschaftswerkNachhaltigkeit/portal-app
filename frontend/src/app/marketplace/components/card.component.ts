import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CardService } from 'src/app/map/services/card.service';
import { Color } from 'src/app/shared/models/color';
import LocationData from 'src/app/shared/models/location-data';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MarketplaceTypes } from '../models/marketplace-type';
import Organisation from 'src/app/shared/models/organisation';
import { CommonModule } from '@angular/common';
import { ExpiredBadgeComponent } from 'src/app/shared/components/base/badges/expired-badge.component';
import { LabelComponent } from 'src/app/shared/components/base/label.component';
import { ActionComponent } from 'src/app/shared/components/base/action.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { EventBadgesComponent } from 'src/app/shared/components/base/badges/event-badges.component copy';
import { ContentRowComponent } from 'src/app/shared/components/base/content-row.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    ExpiredBadgeComponent,
    LabelComponent,
    ActionComponent,
    MatTooltipModule,
    OutlinedIconComponent,
    EventBadgesComponent,
    ContentRowComponent,
    RouterModule,
    TranslateModule
  ],
  template: `
    <div class="card-wrapper mat-elevation-z8">
      @if (expired) {
        <div class="expiredBadge">
          <app-expired-badge>{{
            'labels.expiredOffer' | translate
          }}</app-expired-badge>
        </div>
      }
      @if (featuredText) {
        <div class="featured">
          <div class="new">{{ 'labels.new' | translate }}</div>
          {{ featuredText }}
        </div>
      }
      @if (expired) {
        <div class="expired"></div>
      }
      <div
        class="card"
        [ngClass]="{
          notClickable: !clickable,
          draft: draft
        }"
      >
        <div class="clickable-area" (click)="cardClickHandler()"></div>
        <div class="top-right">
          <div class="category">
            @if (type && category) {
              <app-label [color]="typeColor(type)">
                {{ category | translate }}
              </app-label>
            }
          </div>
          @if (showActions) {
            <div class="actions">
              <app-action
                [onlyIcon]="true"
                [icon]="'edit'"
                (clicked)="editHandler()"
              ></app-action>
              <app-action
                [onlyIcon]="true"
                [icon]="'delete'"
                (clicked)="deleteHandler()"
              ></app-action>
              <ng-content select="[actionMenu]"></ng-content>
            </div>
          }
        </div>
        <div class="image-column">
          @if (featured) {
            <div
              class="featured-icon"
              [matTooltip]="'marketplace.labels.featured' | translate"
            >
              <app-outlined-icon>star</app-outlined-icon>
            </div>
          }
          @if (imageId) {
            <img [src]="imgService.url(imageId)" alt="Offer image" />
          }
        </div>

        <div class="content-column">
          <div class="top">
            <h3 class="title">{{ title }}</h3>
            <app-event-badges
              [activity]="{ thematicFocus: thematicFocus }"
            ></app-event-badges>

            <div class="infos">
              <div class="description">
                <p class="description-text">{{ utils.excerpt(content) }}</p>
              </div>
              <div class="details">
                @if (location) {
                  <div class="details-entries">
                    @if (hasAddress(location)) {
                      <app-content-row
                        [small]="true"
                        [content]="utils.locationString(location)"
                      ></app-content-row>
                    }
                    @if (location.online) {
                      <app-content-row
                        [small]="true"
                        [content]="'forms.labels.online' | translate"
                      ></app-content-row>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
          @if (thematicFocus.length) {
            <div class="thematicFocuses">
              {{ getFormattedThematicFocus() }}
            </div>
          }
          @if (orga) {
            <div class="orga">
              <a [routerLink]="['/', 'organisations', orga.id]">{{
                orga.name
              }}</a>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    // Must be px fixed as the design is created for a specific width
    $card-width: fit-content;
    $card-height: 300px;
    $text-color: mat.m2-get-color-from-palette($wpgwn-app-primary, 500);
    .card-wrapper {
      width: 100%;
      background: white;
      transition: transform 200ms;
      position: relative;

      .expiredBadge {
        z-index: $z4;
        position: absolute;
        left: $spacing-1;
        top: 2.2rem;
      }

      .expired {
        pointer-events: none;
        z-index: $z3;
        position: absolute;
        inset: 0;
        background-color: rgba(255, 255, 255, 0.7);
      }

      .featured {
        width: 100%;
        background-color: $orange;
        color: white;
        display: flex;
        grid-template-columns: min-content max-content;
        align-items: flex-start;
        gap: $spacing-3;
        padding: $spacing-6 $spacing-4;
        font-size: 1.8rem;
        .new {
          margin-top: 3px;
          width: fit-content;
          height: 1.6rem;
          padding: 0.2rem 0.6rem;
          background-color: $yellow;
          color: $blue-navy;
          border-radius: 0.8rem;
          text-transform: uppercase;
          font-size: 1rem;
          line-height: 1.2rem;
          font-weight: 600;
        }
      }
      .card {
        display: grid;
        grid-template-columns: 1fr;
        min-height: 20rem;
        position: relative;
        gap: $spacing-3;

        &.draft,
        &.expired {
          opacity: 0.7;
        }
        &.notClickable,
        &.draft {
          cursor: default;
        }
        overflow: hidden;

        .clickable-area {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: $spacing-10;
          z-index: $z2;
          &:hover {
            cursor: pointer;
          }

          &.expired {
            background-color: rgba(255, 255, 255, 0.7);
          }
        }
        .top-right {
          position: absolute;
          right: $spacing-4;
          top: $spacing-4;
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10);
          z-index: $z3;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;

          .actions {
            display: flex;
            justify-content: flex-end;
          }
          .category {
            height: 4rem;
            display: flex;
            align-items: center;
          }
        }

        .image-column {
          margin: $spacing-4;
          width: $spacing-16;
          height: $spacing-16;
          position: relative;

          .featured-icon {
            position: absolute;
            left: $spacing-2;
            top: $spacing-2;
            z-index: $z4;
            background-color: $orange;
            color: white;
            width: $spacing-8;
            height: $spacing-8;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .content-column {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          z-index: $z1;
          padding: $spacing-4;

          .top {
            position: relative;
            display: grid;
            grid-auto-rows: min-content;

            .title {
              color: $text-color;
              margin: 0;
              font-weight: bold;
              font-size: 1.4rem;
              overflow-wrap: break-word;
              word-wrap: break-word;
              word-break: break-word;
              hyphens: auto;
            }

            .infos {
              display: grid;
              grid-template-columns: 1fr;
              gap: $spacing-4;

              .description {
                .description-text {
                  font-size: 1.2rem;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  hyphens: auto;
                }
              }

              .details {
                .info-title {
                  color: $text-color;
                  font-weight: bold;
                  font-size: 1.2rem;
                  margin: 0;
                  margin-bottom: $spacing-2;
                }
                .details-entries {
                  display: grid;
                  gap: $spacing-4;
                  height: fit-content;
                }
              }
            }
          }

          .thematicFocuses {
            column-span: 2;
            font-size: 1rem;
            padding-top: $spacing-2;
            margin-top: $spacing-2;
            border-top: 2px solid rgba(0, 0, 0, 0.1);
          }
          .orga {
            font-size: 1rem;
            position: relative;
            z-index: 100;
          }
        }
      }
    }

    @media screen and (min-width: $breakpoint-xs) {
      .card-wrapper {
        &:hover {
          transform: translateX(2rem);
        }
        .card {
          grid-template-columns: 22rem 1fr;

          .top-right {
            gap: $spacing-4;
            flex-direction: row;

            .category {
              display: flex;
              align-items: center;
            }
          }
          .image-column {
            height: 100%;
            margin: 0;
            width: 100%;
          }

          .content-column {
            margin-top: 5rem;
            .top {
              .infos {
                grid-template-columns: 2fr minmax(24rem, 1fr);
                gap: $spacing-6;
              }
            }
          }
        }
      }
    }
  `
})
export class CardComponent {
  @Input() imageId?: string;
  @Input() title!: string;
  @Input() content!: string;
  @Input() location?: LocationData;
  @Input() thematicFocus: ThematicFocus[] = [];
  @Input() type?: MarketplaceTypes;
  @Input() orga?: Organisation;
  @Input() category = '';
  @Input() showActions? = true;
  @Input() clickable? = true;
  @Input() draft? = false;
  @Input() featured? = false;
  @Input() featuredText? = '';
  @Input() expired = false;

  @Output() cardClicked = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(
    public card: CardService,
    public utils: UtilsService,
    public imgService: ImgService,
    private translate: TranslateService
  ) {}

  typeColor(type: string): Color {
    switch (type) {
      case MarketplaceTypes.OFFER:
        return 'bordeauxe';
      case MarketplaceTypes.BEST_PRACTISE:
        return 'yellow';
      default:
        return 'primary';
    }
  }

  getFormattedThematicFocus(): string {
    return (
      this.thematicFocus
        ?.map((f) => this.translate.instant('thematicFocus.' + f))
        .join(', ') || ''
    );
  }

  hasAddress(location: LocationData): boolean {
    return !this.utils.noLocation(location);
  }

  cardClickHandler(): void {
    this.cardClicked.emit();
  }

  editHandler(): void {
    this.edit.emit();
  }

  deleteHandler(): void {
    this.delete.emit();
  }
}
