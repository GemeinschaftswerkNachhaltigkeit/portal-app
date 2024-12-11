import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfileUtilsService } from 'src/app/profile-pages/services/profile-utils.service';
import { ExpiredBadgeComponent } from 'src/app/shared/components/base/badges/expired-badge.component';
import {
  CategoryComponent,
  CategoryType
} from 'src/app/shared/components/base/category.component';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { SdgIconComponent } from 'src/app/shared/components/base/sdg-icon.component';
import LocationData from 'src/app/shared/models/location-data';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [
    CommonModule,
    ExpiredBadgeComponent,
    MatButtonModule,
    CategoryComponent,
    HeadingComponent,
    TranslateModule,
    SdgIconComponent,
    RouterModule
  ],
  template: `
    <article class="item">
      <div class="expired" *ngIf="isExpired()">
        <app-expired-badge></app-expired-badge>
      </div>
      <div [ngClass]="{ disabled: isExpired() }">
        <app-category [type]="getType()" [category]="category"></app-category>
        <app-heading size="sm" type="h3" color="none">
          {{ title }}
        </app-heading>
        <div class="info">
          <p class="description">{{ utils.excerpt(description) }}</p>
          <dl class="attributes">
            <ng-container>
              <dt class="key">{{ 'profile.labels.dateRange' | translate }}</dt>
              <dd class="value">
                {{ utils.dateRangeString(period) }}
              </dd>
            </ng-container>
            <dt class="key">{{ 'profile.labels.impactArea' | translate }}</dt>
            <dd class="value">
              {{ 'impactArea.' + impactArea | translate }}
            </dd>
            <dt class="key">
              {{ 'profile.labels.activityLocation' | translate }}
            </dt>
            <dd class="value">
              <span *ngIf="profileUtils.addressString(location?.address)">
                {{ profileUtils.addressString(location?.address) }}
              </span>
              <span *ngIf="profileUtils.cityString(location?.address)">
                {{ profileUtils.cityString(location?.address) }}
              </span>
              <span *ngIf="location?.online">
                {{ 'profile.labels.online' | translate }}
              </span>
            </dd>
          </dl>
        </div>
      </div>
      <aside class="aside" [ngClass]="{ disabled: isExpired() }">
        <div class="image-wrapper" *ngIf="image">
          <div class="image" *ngIf="!sdgs">
            <img [src]="imgService.url(image)" [alt]="title" />
          </div>
          <div class="sdgs" *ngIf="!image">
            <ng-container *ngFor="let sdg of utils.limitedSdgs(sdgs, 3)">
              <div class="sdg">
                <app-sdg-icon [goal]="sdg"></app-sdg-icon>
              </div>
            </ng-container>
            <div class="remaining" *ngIf="utils.remainingSdgs(sdgs, 3).length">
              +{{ utils.remainingSdgs(sdgs, 3).length }}
            </div>
          </div>
        </div>
        <div class="thematic-focus" *ngIf="thematicFocus?.length">
          <app-heading type="h4" size="xs" color="none"
            >{{ 'labels.tags' | translate }}:</app-heading
          >
          {{ getThematicFocus() }}
        </div>
        <div class="actions">
          <ng-content></ng-content>
          <a
            [routerLink]="openLink"
            mat-flat-button
            color="accent"
            class="open-link"
          >
            {{ openTitle | translate }}
          </a>
        </div>
      </aside>
    </article>
  `,
  styles: `
    @use '@angular/material' as mat;
    @use 'palette' as *;
    @use 'theme' as *;

    .item {
      padding: $spacing-6 0;
      display: grid;
      gap: $spacing-2;
      position: relative;
      color: $blue-navy;
      border-top: 2px solid $gray-light;

      .expired {
        position: absolute;
        z-index: $z3;
        left: 0;
        top: $spacing-10;
        width: fit-content;
      }

      .disabled {
        opacity: 0.3;
      }

      .info {
        .description {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }
        .attributes {
          display: none;
          grid-template-columns: 1fr;
          gap: $spacing-4;

          .key {
            color: $magenta;
            font-weight: bold;
          }
          .value {
            margin: 0;
          }
        }
      }

      .aside {
        display: flex;
        flex-direction: column;
        gap: $spacing-4;

        .image-wrapper {
          margin-bottom: $spacing-4;
          .image {
            width: $spacing-22;
            height: $spacing-22;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .sdgs {
            display: grid;
            grid-template-columns:
              fit-content($spacing-22)
              fit-content($spacing-22)
              fit-content($spacing-22)
              2rem;
            gap: $spacing-2;
            height: fit-content;

            .remaining {
              display: flex;
              align-items: center;
              justify-content: center;
              color: $blue-navy;
            }
          }
        }
      }
      .actions {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-items: end;
        gap: $spacing-2;

        .open-link {
          flex-grow: 1;
        }
      }
    }

    @media screen and (min-width: $breakpoint-sm) {
      .item {
        grid-template-columns: 2fr 1fr;
        gap: $spacing-20;
        .info {
          .attributes {
            grid-template-columns: 12rem 1fr;
          }
        }
      }
    }
  `
})
export class ListItemComponent implements OnInit {
  @Input() type: 'ACTIVITY' | 'BEST_PRACTICE' | 'OFFER' | 'DAN' = 'ACTIVITY';
  @Input() title = '';
  @Input() description = '';
  @Input() sdgs?: number[];
  @Input() thematicFocus?: ThematicFocus[] = [];
  @Input() image = '';
  @Input() category = '';
  @Input() period?: {
    start: string;
    end: string;
    permanent?: boolean;
  };
  @Input() impactArea?: string;
  @Input() location?: LocationData;
  @Input() openLink?: (string | number | undefined)[];
  @Input() openTitle = '';
  @Output() bookmark = new EventEmitter();
  @Output() unbookmark = new EventEmitter();
  catType = CategoryType;

  constructor(
    public profileUtils: ProfileUtilsService,
    public imgService: ImgService,
    public utils: UtilsService,
    private translate: TranslateService
  ) {}

  isExpired(): boolean {
    if (this.type !== 'ACTIVITY') {
      return false;
    }
    return this.utils.isExpiredActivity(this.period);
  }

  getType(): CategoryType {
    if (this.type === 'OFFER') {
      return this.catType.OFFER;
    }
    if (this.type === 'BEST_PRACTICE') {
      return this.catType.BEST_PRACTISE;
    }
    if (this.type === 'ACTIVITY') {
      return this.catType.ACTIVITY;
    }
    if (this.type === 'DAN') {
      return this.catType.DAN;
    }
    return this.catType.ACTIVITY;
  }

  getThematicFocus(): string {
    if (this.thematicFocus) {
      const count = 2;
      const countString =
        this.thematicFocus.length > count
          ? `(${this.remainingThematicFocus(count)})`
          : '';
      const tf = this.thematicFocus
        ?.slice(0, count)
        .map((tf) => this.translate.instant(`thematicFocus.${tf}`));
      return `${tf.join(', ')} ${countString}`;
    }
    return '';
  }

  remainingThematicFocus(count: number): string {
    if (this.thematicFocus) {
      return this.thematicFocus.length > count
        ? `+${this.thematicFocus.length - count}`
        : '';
    } else {
      return '';
    }
  }

  bookmarkHandler(): void {
    this.bookmark.emit();
  }

  unbookmarkHandler(): void {
    this.unbookmark.emit();
  }

  showAsExpired(): boolean {
    return this.period ? this.utils.isExpiredActivity(this.period) : false;
  }

  ngOnInit(): void {
    if (this.image && this.sdgs) {
      throw new Error('You can only use either an image or sdgs!');
    }
  }
}
