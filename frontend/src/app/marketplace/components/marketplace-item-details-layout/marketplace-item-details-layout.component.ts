import { Component } from '@angular/core';
import { MarketplaceItemAnimation } from '../../../shared/animations/marketplace-item-animation';

@Component({
  selector: 'app-marketplace-item-details-layout',
  templateUrl: './marketplace-item-details-layout.component.html',
  styleUrls: ['./marketplace-item-details-layout.component.scss'],
  animations: [MarketplaceItemAnimation]
})
export class MarketplaceItemDetailsLayoutComponent {}
