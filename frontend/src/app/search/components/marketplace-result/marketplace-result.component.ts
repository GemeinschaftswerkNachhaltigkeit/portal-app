import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MarketplaceItem } from 'src/app/shared/models/marketplaceItem';
import { MarketplaceTypes } from 'src/app/marketplace/models/marketplace-type';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-marketplace-result',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './marketplace-result.component.html',
  styleUrl: './marketplace-result.component.scss'
})
export class MarketplaceResultComponent {
  @Input() item: MarketplaceItem;

  utils = inject(UtilsService);
  imgService = inject(ImgService);
  translate = inject(TranslateService);

  imageUrl() {
    return this.imgService.url(this.item.image);
  }

  getMarketplaceCategory(item: MarketplaceItem): string {
    const cat =
      item.marketplaceType === MarketplaceTypes.OFFER
        ? item.offerCategory
        : item.bestPractiseCategory;
    return this.translate.instant(`marketplace.labels.${cat}`);
  }
}
