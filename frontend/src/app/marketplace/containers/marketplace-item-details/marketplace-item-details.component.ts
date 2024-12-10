import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MarketplaceFacadeService } from '../../marketplace-facade.service';
import { BestPracticesCategories } from '../../models/best-practices-categories';
import { MarketplaceItemDto } from '../../models/marketplace-item-dto';
import { OfferCategories } from '../../models/offer-categories';
import { expired } from '../../marketplace-utils';
import { CommonModule, DatePipe } from '@angular/common';
import { MarketplaceItemDetailsLayoutComponent } from '../../components/marketplace-item-details-layout.component';
import {
  BreadcrumbComponent,
  BreadcrumbsComponent
} from 'src/app/shared/components/base/breadcrumb';
import { HeroComponent } from '../../components/hero.component';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { TranslateModule } from '@ngx-translate/core';
import { HtmlWrapperComponent } from 'src/app/shared/components/base/html-wrapper.component';
import { ContactComponent } from '../../components/contact.component';
import { TopicComponent } from 'src/app/shared/components/base/topic.component';
import { ContentRowComponent } from 'src/app/shared/components/base/content-row.component';
import { EventBadgesComponent } from 'src/app/shared/components/base/badges/event-badges.component copy';

@Component({
  selector: 'app-marketplace-item-details',
  standalone: true,
  imports: [
    CommonModule,
    MarketplaceItemDetailsLayoutComponent,
    BreadcrumbComponent,
    BreadcrumbsComponent,
    RouterModule,
    HeroComponent,
    HeadingComponent,
    DatePipe,
    TranslateModule,
    HtmlWrapperComponent,
    ContactComponent,
    TopicComponent,
    ContentRowComponent,
    EventBadgesComponent
  ],
  templateUrl: './marketplace-item-details.component.html',
  styleUrls: ['./marketplace-item-details.component.scss']
})
export class MarketplaceItemDetailsComponent implements OnInit {
  item$ = this.marketplaceFacade.item$;

  constructor(
    private route: ActivatedRoute,
    private marketplaceFacade: MarketplaceFacadeService,
    public utils: UtilsService
  ) {}

  expired(item: MarketplaceItemDto): boolean {
    return expired(item);
  }

  getCat(
    item: MarketplaceItemDto
  ): OfferCategories | BestPracticesCategories | undefined {
    return item.offerCategory ? item.offerCategory : item.bestPractiseCategory;
  }

  getType(item: MarketplaceItemDto): 'offer' | 'bestPractice' {
    return item.offerCategory ? 'offer' : 'bestPractice';
  }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const id = params['itemId'];
    if (id) {
      this.marketplaceFacade.loadItem(id);
    }
  }
}
