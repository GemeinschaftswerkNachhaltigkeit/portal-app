import { Injectable } from '@angular/core';
import Organisation from '../models/organisation';
import Activity from '../models/actvitiy';
import { MarketplaceItemDto } from 'src/app/marketplace/models/marketplace-item-dto';
import { CardData } from '../standalone/orga-card/orga-card.component';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  toCard(data: Organisation | Activity | MarketplaceItemDto): CardData {
    const cardData: CardData = {
      title: data.name || '',
      description: data.description || ''
    };

    if ('logo' in data) {
      cardData.logoUrl = data.logo;
    }

    return cardData;
  }
}
