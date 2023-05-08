import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import {
  AdditionalFiltersModalComponent,
  AdditionalFiltersData
} from 'src/app/shared/components/form/filters/additional-filters-modal/additional-filters-modal.component';
import { SecondaryFilters } from 'src/app/shared/components/form/filters/secondary-filters/secondary-filters.component';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';

import { LoadingService } from 'src/app/shared/services/loading.service';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { environment } from 'src/environments/environment';
import { MarketplaceFacadeService } from '../../marketplace-facade.service';
import { BestPracticesCategories } from '../../models/best-practices-categories';
import { MarketplaceItemDto } from '../../models/marketplace-item-dto';
import { MarketplaceTypes } from '../../models/marketplace-type';
import { OfferCategories } from '../../models/offer-categories';

@Component({
  selector: 'app-marketplace-search',
  templateUrl: './marketplace-search.component.html',
  styleUrls: ['./marketplace-search.component.scss']
})
export class MarketplaceSearchComponent implements OnInit {
  links$ = this.marketplaceFacade.partnerLinks$;
  items$ = this.marketplaceFacade.marketplaceItems$;
  featuredItems$ = this.marketplaceFacade.featuredMarketplaceItems$;
  loading$ = this.loader.isLoading$();
  paging$ = this.marketplaceFacade.marketplaceItemsPaging$;
  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = defaultPaginatorOptions.pageSizeOptions;
  includedFilters: SecondaryFilters[] = [
    SecondaryFilters.OFFER_CATS,
    SecondaryFilters.BEST_PRACTICE_CATS,
    SecondaryFilters.THEMATIC_FOCUS
  ];
  searchValue = '';

  constructor(
    private marketplaceFacade: MarketplaceFacadeService,
    private translate: TranslateService,
    private loader: LoadingService,
    public dialog: MatDialog,

    filtersService: SecondaryFitlersService
  ) {
    filtersService.setOpenFilters('marketplace-fitlers', [
      SecondaryFilters.OFFER_CATS,
      SecondaryFilters.BEST_PRACTICE_CATS
    ]);
  }

  ngOnInit(): void {
    this.marketplaceFacade.getFeatured();
    const filters = this.marketplaceFacade.getFilters();
    this.searchValue = (filters['query'] || '') as string;
  }

  getQuery(): string {
    return this.marketplaceFacade.getFilters()['query'] as string;
  }

  getCategories(): (OfferCategories | BestPracticesCategories)[] {
    const offerCats =
      (this.marketplaceFacade.getFilters()['offerCat'] as string[]) || [];
    const bpCats =
      (this.marketplaceFacade.getFilters()['bestPractiseCat'] as string[]) ||
      [];
    const oc: OfferCategories[] = offerCats.map((oc: string) => {
      const key = oc as keyof typeof OfferCategories;
      return OfferCategories[key];
    });
    const bp: BestPracticesCategories[] = bpCats.map((bp: string) => {
      const key = bp as keyof typeof BestPracticesCategories;
      return BestPracticesCategories[key];
    });
    return [...oc, ...bp];
  }

  countFilters(): number {
    return this.marketplaceFacade.countFilters();
  }

  getMarketplaceCategory(item: MarketplaceItemDto): string {
    const cat =
      item.marketplaceType === MarketplaceTypes.OFFER
        ? item.offerCategory
        : item.bestPractiseCategory;
    return this.translate.instant(`marketplace.labels.${cat}`);
  }

  handlePageChanged(event: PageEvent): void {
    this.marketplaceFacade.changePage(event.pageIndex, event.pageSize);
  }

  handleSearchValueChanged(query: string): void {
    this.searchValue = query;
  }

  handleSearch(query: string): void {
    this.marketplaceFacade.search({ query: query });
  }

  handleAdd(): void {
    this.marketplaceFacade.addNewMarketplaceItem();
  }

  open(id?: number): void {
    if (id) {
      window.open(
        environment.contextPath + `marketplace/search/${id}`,
        '_blank'
      );
    }
  }

  clearAll(): void {
    this.searchValue = '';
    this.marketplaceFacade.clearFilters();
  }

  openFilters(): void {
    const dialogRef = this.dialog.open(AdditionalFiltersModalComponent, {
      width: '800px',
      data: this.getFilterData()
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.marketplaceFacade.search(result);
      }
    });
  }

  handleFiltersChanged(filters: AdditionalFilters): void {
    this.marketplaceFacade.search(filters);
  }

  getFilterData(): AdditionalFiltersData {
    const filters: AdditionalFilters = this.marketplaceFacade.getFilters();

    return {
      use: this.includedFilters,
      selectedThematicFocusValues: filters['thematicFocus'],
      selectedBestPracticeCategories: filters['bestPractiseCat'],
      selectedOfferCategories: filters['offerCat']
    };
  }
}
