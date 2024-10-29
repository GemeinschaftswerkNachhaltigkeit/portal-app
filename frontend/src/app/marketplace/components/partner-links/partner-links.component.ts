import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  viewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { PartnerLink } from '../../models/partner-link';
import { OfferCategories } from '../../models/offer-categories';
import { BestPracticesCategories } from '../../models/best-practices-categories';

@Component({
  selector: 'app-partner-links',
  templateUrl: './partner-links.component.html',
  styleUrls: ['./partner-links.component.scss']
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
