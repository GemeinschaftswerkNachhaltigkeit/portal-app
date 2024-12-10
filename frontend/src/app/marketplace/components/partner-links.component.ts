import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  viewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { PartnerLink } from '../models/partner-link';
import { OfferCategories } from '../models/offer-categories';
import { BestPracticesCategories } from '../models/best-practices-categories';
import { CommonModule } from '@angular/common';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-partner-links',
  standalone: true,
  imports: [
    CommonModule,
    HeadingComponent,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div #slidercontainer id="partner-links">
      <div
        id="partner-links-slider"
        class="slider-wrapper"
        *ngIf="filtered?.length"
      >
        <div class="title">
          <app-heading size="sm" color="none" [uppercase]="true">{{
            'marketplace.titles.slider' | translate
          }}</app-heading>
        </div>

        <swiper-container
          #swiper
          slides-per-view="auto"
          loop="true"
          space-between="12"
          loop-fill-group-with-blank="true"
        >
          <ng-container *ngFor="let link of filtered">
            <swiper-slide>
              <a class="slide-wrapper" target="_blank" [href]="link.url">
                <div class="image-wrapper">
                  <img [src]="link.logo" alt="" />
                </div>
                <h5>{{ link.title }}</h5>
              </a>
            </swiper-slide>
          </ng-container>
        </swiper-container>

        <div class="buttons" *ngIf="filtered.length">
          <button class="button prev" type="button" (click)="slidePrev()">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <button class="button next" type="button" (click)="slideNext()">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    .slider-wrapper {
      background-color: $gray-light;
      padding: $spacing-10 0;
      position: relative;

      swiper-container {
        width: 100%;
        height: 100%;
      }

      swiper-slide {
        width: 280px;
      }

      .slide-wrapper {
        display: block;
        height: 200px;
        width: 100%;
        background-color: white;
        padding: $spacing-4;
        margin: $spacing-4 0;
        text-decoration: none;
        color: $blue-navy;

        .image-wrapper {
          height: 80px;
          margin-bottom: $spacing-4;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }

      .no-slider {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;

        .slide-wrapper {
          padding: $spacing-4;
          max-width: 220px;
        }
      }

      .title {
        text-align: center;
        padding: 0 $spacing-8 $spacing-4 $spacing-8;
      }

      .buttons {
        display: flex;
        position: absolute;
        right: $spacing-10;
        bottom: -2rem;
        gap: $spacing-1;

        .button {
          width: 4rem;
          height: 4rem;
          color: white;
          background-color: $blue-navy;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          outline: none;
          border-radius: 50%;
          transition: transform 300ms;

          &:hover {
            cursor: pointer;
            transform: scale(1.1);
          }
        }
      }
    }
  `
})
export class PartnerLinksComponent implements OnDestroy, OnChanges {
  @Input() links: PartnerLink[] = [];
  @Input() selectedCategories: (OfferCategories | BestPracticesCategories)[] =
    [];

  swiper = viewChild<ElementRef>('swiper');
  filtered: PartnerLink[] = [];
  destroyed = new Subject<void>();
  sm = false;
  xs = false;
  md = false;
  resizeObs: ResizeObserver | null = null;
  slides = 1;
  width = {
    value: 0
  };

  ngOnChanges(): void {
    this.filtered = this.filterLinks(this.links, this.selectedCategories);
  }

  filterLinks(
    links: PartnerLink[],
    cats: (OfferCategories | BestPracticesCategories)[]
  ): PartnerLink[] {
    return links.filter((l: PartnerLink) => {
      if (!cats?.length) {
        return true;
      } else {
        return cats.includes(l.category);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.resizeObs?.disconnect();
  }

  slideNext() {
    this.swiper()?.nativeElement.swiper.slideNext();
  }
  slidePrev() {
    this.swiper()?.nativeElement.swiper.slidePrev();
  }
}
