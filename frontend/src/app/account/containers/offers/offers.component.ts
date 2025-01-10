import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from 'src/app/marketplace/components/card.component';
import { expired } from 'src/app/marketplace/marketplace-utils';
import { MarketplaceTypes } from 'src/app/marketplace/models/marketplace-type';
import { OfferDto } from 'src/app/marketplace/models/offer-dto';
import { OfferWipDto } from 'src/app/marketplace/models/offer-wip-dto';
import { Status } from 'src/app/marketplace/models/status';
import { CharCountComponent } from 'src/app/shared/components/base/char-count.component';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { CardListComponent } from 'src/app/shared/components/cards/card-list.component';
import { ListWithHeadingLayoutComponent } from 'src/app/shared/components/layout/list-with-heading-layout.component';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import { OffersService } from 'src/app/marketplace/offers.service';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    PageWithHeaderLayoutComponent,
    TranslateModule,
    MatButtonModule,
    CharCountComponent,
    LoadingIndicatorComponent,
    ListWithHeadingLayoutComponent,
    CardListComponent,
    CardComponent,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    OutlinedIconComponent,
    SpinnerComponent
  ],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  offersService = inject(OffersService);

  offers = this.offersService.offers;
  offersPaging = this.offersService.offersPaging;
  offerWips = this.offersService.offerWips;
  offerWipsPaging = this.offersService.offerWipsPaging;
  loading = this.offersService.loading;

  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = defaultPaginatorOptions.pageSizeOptions;
  type = MarketplaceTypes;
  status = Status;

  constructor() {}

  expired(item: OfferDto): boolean {
    return expired(item);
  }

  open(offer: OfferDto): void {
    if (offer.id && offer.status === Status.ACTIVE) {
      window.open(
        environment.contextPath + `marketplace/search/${offer.id}`,
        '_blank'
      );
    }
  }

  handleStatusChange(offer: OfferDto, status: Status) {
    this.offersService.setStatus(offer, status);
  }

  handleNew() {
    this.offersService.newOffer();
  }

  handlePageChanged(event: PageEvent): void {
    this.offersService.changeOffersPage(event.pageIndex, event.pageSize);
  }
  handleWipsPageChanged(event: PageEvent): void {
    this.offersService.changeOfferWipsPage(event.pageIndex, event.pageSize);
  }

  handleEditOffer(offer: OfferDto): void {
    this.offersService.editOffer(offer);
  }

  handleEditOfferWip(offerWip: OfferWipDto): void {
    this.offersService.editOfferWip(offerWip);
  }

  handleDeleteOffer(offer: OfferDto): void {
    this.offersService.deleteOffer(offer);
  }

  handleDeleteOfferWip(offerWip: OfferWipDto): void {
    this.offersService.deleteOfferWip(offerWip);
  }

  ngOnInit(): void {
    this.offersService.getOffers();
    this.offersService.getOfferWips();
  }
}
