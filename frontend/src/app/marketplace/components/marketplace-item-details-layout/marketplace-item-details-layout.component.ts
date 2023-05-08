import { Component } from '@angular/core';
import { MarketplaceItemAnimation } from 'src/app/shared/components/animations/marketplace-item-animation';

@Component({
  selector: 'app-marketplace-item-details-layout',
  templateUrl: './marketplace-item-details-layout.component.html',
  styleUrls: ['./marketplace-item-details-layout.component.scss'],
  animations: [MarketplaceItemAnimation]
})
export class MarketplaceItemDetailsLayoutComponent {}
