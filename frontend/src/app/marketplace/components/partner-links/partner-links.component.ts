import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  NgZone,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { A11y, Virtual } from 'swiper';
SwiperCore.use([Virtual, A11y]);
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { PartnerLink } from '../../models/partner-link';
import { OfferCategories } from '../../models/offer-categories';
import { BestPracticesCategories } from '../../models/best-practices-categories';

@Component({
  selector: 'app-partner-links',
  templateUrl: './partner-links.component.html',
  styleUrls: ['./partner-links.component.scss']
})
export class PartnerLinksComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() links: PartnerLink[] = [];
  @Input() selectedCategories: (OfferCategories | BestPracticesCategories)[] =
    [];

  @ViewChild('slidercontainer') sliderContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @ViewChild('outlet', { read: ViewContainerRef }) outletRef?: ViewContainerRef;
  @ViewChild('content', { read: TemplateRef })
  contentRef?: TemplateRef<SwiperComponent>;
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

  constructor(breakpointObserver: BreakpointObserver, private ngZone: NgZone) {
    breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        Object.keys(result.breakpoints).forEach(() => {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.xs = true;
            this.sm = false;
            this.md = false;
          } else if (result.breakpoints[Breakpoints.Small]) {
            this.xs = false;
            this.sm = true;
            this.md = false;
          } else if (result.breakpoints[Breakpoints.Medium]) {
            this.xs = false;
            this.sm = false;
            this.md = true;
          } else {
            this.xs = false;
            this.sm = false;
            this.md = false;
          }
        });
      });
  }

  ngOnInit(): void {
    this.resizeObs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;

        if (entry.target.id === 'partner-links') {
          this.ngZone.run(() => {
            this.width.value = width;
            const newSlides = this.getSlidesPerView(width);
            if (newSlides !== this.slides) {
              this.rerender();
            }
            this.slides = newSlides;
          });
        }
      }
    });
  }
  ngAfterViewInit(): void {
    const el = this.sliderContainer?.nativeElement;
    if (el) {
      this.resizeObs?.observe(el);
    }
  }
  ngOnChanges(): void {
    this.filtered = this.filterLinks(this.links, this.selectedCategories);
  }

  public rerender() {
    if (this.contentRef && this.outletRef) {
      this.outletRef.clear();
      this.outletRef.createEmbeddedView(this.contentRef);
    }
  }

  getSlidesPerView(containerWidth: number): number {
    if (containerWidth > 800) {
      return 4;
    }
    if (containerWidth > 500) {
      return 3;
    }
    if (containerWidth > 380) {
      return 2;
    }

    return 1;
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

  isSlider(): boolean {
    if (this.filtered.length >= 4) {
      return true;
    }
    if (this.filtered.length >= 3 && (this.sm || this.xs)) {
      return true;
    }
    if (this.filtered.length >= 2 && !this.sm && this.xs) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.resizeObs?.disconnect();
  }

  slideNext() {
    this.swiper?.swiperRef.slideNext(100);
  }
  slidePrev() {
    this.swiper?.swiperRef.slidePrev(100);
  }
}
