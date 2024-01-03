import { Component, Input, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ImgService } from '../../../services/img.service';
import { SharedModule } from '../../../shared.module';
import { UtilsService } from '../../../services/utils.service';
import Activity from '../../../models/actvitiy';
import { RouterModule } from '@angular/router';
import { MarketplaceItem } from '../../../models/marketplaceItem';
import { MarketplaceTypes } from 'src/app/marketplace/models/marketplace-type';
import { TranslateService } from '@ngx-translate/core';

export type CardData = {
  title: string;
  description: string;
  logoUrl?: string;
};

@Component({
  selector: 'app-marketplace-card',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, NgClass],
  templateUrl: './marketplace-card.component.html',
  styleUrl: './marketplace-card.component.scss'
})
export class MarketplaceCardComponent {
  @Input() marketplaceItem: MarketplaceItem;

  utils = inject(UtilsService);
  translate = inject(TranslateService);
  imgService = inject(ImgService);

  imageUrl() {
    return this.imgService.url(this.marketplaceItem.image);
  }

  getMarketplaceCategory(item: MarketplaceItem): string {
    const cat =
      item.marketplaceType === MarketplaceTypes.OFFER
        ? item.offerCategory
        : item.bestPractiseCategory;
    return this.translate.instant(`marketplace.labels.${cat}`);
  }
}
