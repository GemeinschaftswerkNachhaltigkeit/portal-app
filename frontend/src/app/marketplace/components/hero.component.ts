import { Component, Input } from '@angular/core';
import { Color } from 'src/app/shared/models/color';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ImgService } from '../../shared/services/img.service';
import { BestPracticesCategories } from '../models/best-practices-categories';
import { OfferCategories } from '../models/offer-categories';
import { CommonModule } from '@angular/common';
import { ExpiredBadgeComponent } from 'src/app/shared/components/base/badges/expired-badge.component';
import { LabelComponent } from 'src/app/shared/components/base/label.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    ExpiredBadgeComponent,
    LabelComponent,
    TranslateModule
  ],
  template: `
    <header class="header" [ngClass]="{ expired: expired }">
      @if (expired) {
        <div class="expired"></div>
      }

      @if (bgImage) {
        <img [src]="bgImage" alt="header" />
      }

      @if (expired) {
        <div class="expiredBadge">
          <app-expired-badge>{{
            'labels.expiredOffer' | translate
          }}</app-expired-badge>
        </div>
      }
      <div class="type">
        <app-label [color]="color">{{ catgegory }}</app-label>
      </div>
    </header>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .header {
      height: 21.6rem;
      width: 100%;
      position: relative;
      z-index: $z1;

      .expiredBadge {
        z-index: $z5;
        position: absolute;
        left: $spacing-1;
        bottom: -2.2rem;
      }

      .expired {
        pointer-events: none;
        z-index: $z3;
        position: absolute;
        inset: 0;
        background-color: rgba(255, 255, 255, 0.7);
      }

      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }

      .type {
        position: absolute;
        left: $spacing-8;
        bottom: 0;
        z-index: $z4;
        transform: translateY(50%);
      }
    }
  `
})
export class HeroComponent {
  @Input() bgImageName!: string;
  @Input() type!: 'offer' | 'bestPractice';
  @Input() catgegory?: OfferCategories | BestPracticesCategories;
  @Input() expired = false;

  constructor(
    public utils: UtilsService,
    private imgService: ImgService
  ) {}

  get bgImage(): string | null {
    return this.imgService.url(this.bgImageName);
  }

  get color(): Color {
    return this.type === 'offer' ? 'bordeauxe' : 'yellow';
  }
}
