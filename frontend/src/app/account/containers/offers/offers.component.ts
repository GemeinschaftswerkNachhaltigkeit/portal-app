import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { OffersFacadeService } from 'src/app/marketplace/offers-facade.service';
import { CharCountComponent } from 'src/app/shared/components/base/char-count.component';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { CardListComponent } from 'src/app/shared/components/cards/card-list.component';
import { ListWithHeadingLayoutComponent } from 'src/app/shared/components/layout/list-with-heading-layout.component';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { environment } from 'src/environments/environment';

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
    OutlinedIconComponent
  ],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  offers$ = this.offersFacade.offers$;
  offerWips$ = this.offersFacade.offerWips$;
  offersPaging$ = this.offersFacade.offersPaging$;
  offerWipsPaging$ = this.offersFacade.offerWipsPaging$;
  loading$ = this.loader.isLoading$('load-all-offers');
  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = defaultPaginatorOptions.pageSizeOptions;
  type = MarketplaceTypes;
  status = Status;

  constructor(
    private offersFacade: OffersFacadeService,
    private loader: LoadingService
  ) {}

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
    this.offersFacade.setStatus(offer, status);
  }

  handleNew() {
    this.offersFacade.newOffer();
  }

  handlePageChanged(event: PageEvent): void {
    this.offersFacade.changeOffersPage(event.pageIndex, event.pageSize);
  }
  handleWipsPageChanged(event: PageEvent): void {
    this.offersFacade.changeOfferWipsPage(event.pageIndex, event.pageSize);
  }

  handleEditOffer(offer: OfferDto): void {
    this.offersFacade.editOffer(offer);
  }

  handleEditOfferWip(offerWip: OfferWipDto): void {
    this.offersFacade.editOfferWip(offerWip);
  }

  handleDeleteOffer(offer: OfferDto): void {
    this.offersFacade.deleteOffer(offer);
  }

  handleDeleteOfferWip(offerWip: OfferWipDto): void {
    this.offersFacade.deleteOfferWip(offerWip);
  }

  ngOnInit(): void {
    this.offersFacade.loadOffersAndOfferWips();
  }
}
