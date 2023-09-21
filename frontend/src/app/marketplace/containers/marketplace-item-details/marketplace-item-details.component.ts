import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MarketplaceFacadeService } from '../../marketplace-facade.service';
import { BestPracticesCategories } from '../../models/best-practices-categories';
import { MarketplaceItemDto } from '../../models/marketplace-item-dto';
import { OfferCategories } from '../../models/offer-categories';
import { expired } from '../../marketplace-utils';

@Component({
  selector: 'app-marketplace-item-details',
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
