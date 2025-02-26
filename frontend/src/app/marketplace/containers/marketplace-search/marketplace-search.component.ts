import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AdditionalFiltersModalComponent,
  AdditionalFiltersData
} from 'src/app/shared/components/form/filters/additional-filters-modal.component';
import {
  SecondaryFilters,
  SecondaryFiltersComponent
} from 'src/app/shared/components/form/filters/secondary-filters.component';
import AdditionalFilters from 'src/app/shared/models/additional-filters';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';

import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { environment } from 'src/environments/environment';
import { BestPracticesCategories } from '../../models/best-practices-categories';
import { MarketplaceItemDto } from '../../models/marketplace-item-dto';
import { MarketplaceTypes } from '../../models/marketplace-type';
import { OfferCategories } from '../../models/offer-categories';
import { expired } from '../../marketplace-utils';
import { CommonModule } from '@angular/common';
import { MarketplaceLayoutComponent } from '../../components/marketplace-layout.component';
import { AddBannerComponent } from '../../components/add-banner.component';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { MatButtonModule } from '@angular/material/button';
import { SearchInputComponent } from 'src/app/shared/components/form/search-input.component';
import { FilterModalButtonComponent } from 'src/app/shared/components/form/filters/filter-modal-button.component';
import { CardListComponent } from 'src/app/shared/components/cards/card-list.component';
import { CardComponent } from '../../components/card.component';
import { PartnerLinksComponent } from '../../components/partner-links.component';
import { MarketplaceSearchService } from '../../marketplace-search.service';
import { MarketplaceItemService } from '../../marketplace-item.service';
import { ErrorComponent } from 'src/app/shared/components/base/error.component';
import { MarketplaceContentService } from '../../marketplace-content.service';

@Component({
  selector: 'app-marketplace-search',
  standalone: true,
  imports: [
    CommonModule,
    MarketplaceLayoutComponent,
    AddBannerComponent,
    HeadingComponent,
    MatButtonModule,
    SecondaryFiltersComponent,
    SearchInputComponent,
    FilterModalButtonComponent,
    CardListComponent,
    CardComponent,
    MatPaginatorModule,
    PartnerLinksComponent,
    TranslateModule,
    ErrorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './marketplace-search.component.html',
  styleUrls: ['./marketplace-search.component.scss']
})
export class MarketplaceSearchComponent implements OnInit {
  marketplaceSearchService = inject(MarketplaceSearchService);
  marketplaceItemService = inject(MarketplaceItemService);
  marketplaceContentService = inject(MarketplaceContentService);

  items = this.marketplaceSearchService.items;
  featuredItems = this.marketplaceSearchService.featuredItems;
  loading = this.marketplaceSearchService.loading;
  error = this.marketplaceSearchService.error;
  paging = this.marketplaceSearchService.paging;
  partners = this.marketplaceContentService.partners;

  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = defaultPaginatorOptions.pageSizeOptions;
  includedFilters: SecondaryFilters[] = [
    SecondaryFilters.OFFER_CATS,
    SecondaryFilters.BEST_PRACTICE_CATS,
    SecondaryFilters.THEMATIC_FOCUS
  ];
  searchValue = '';

  constructor(
    private translate: TranslateService,
    public dialog: MatDialog,
    filtersService: SecondaryFitlersService
  ) {
    filtersService.setOpenFilters('marketplace-fitlers', [
      SecondaryFilters.OFFER_CATS,
      SecondaryFilters.BEST_PRACTICE_CATS
    ]);
  }

  ngOnInit(): void {
    this.marketplaceSearchService.getFeaturedItems();
    this.marketplaceContentService.getPartners();
    this.searchValue = this.marketplaceSearchService.getQueryFilter();
  }

  getQuery(): string {
    return this.marketplaceSearchService.getQueryFilter();
  }

  expired(item: MarketplaceItemDto): boolean {
    return expired(item);
  }

  getCategories(): (OfferCategories | BestPracticesCategories)[] {
    const offerCats = this.marketplaceSearchService.getOfferCategoryFilter();
    const bpCats =
      this.marketplaceSearchService.getBestPractiseCategoryFilter();
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
    return this.marketplaceSearchService.countFilters();
  }

  getMarketplaceCategory(item: MarketplaceItemDto): string {
    const cat =
      item.marketplaceType === MarketplaceTypes.OFFER
        ? item.offerCategory
        : item.bestPractiseCategory;
    return this.translate.instant(`marketplace.labels.${cat}`);
  }

  handlePageChanged(event: PageEvent): void {
    this.marketplaceSearchService.changePage(event.pageIndex, event.pageSize);
  }

  handleSearchValueChanged(query: string): void {
    this.searchValue = query;
  }

  handleSearch(query: string): void {
    this.marketplaceSearchService.search({ query: query });
  }

  handleAdd(): void {
    this.marketplaceItemService.addNewMarketplaceItem();
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
    this.marketplaceSearchService.clearFilters();
  }

  openFilters(): void {
    const dialogRef = this.dialog.open(AdditionalFiltersModalComponent, {
      width: '800px',
      data: this.getFilterData()
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.marketplaceSearchService.search(result);
      }
    });
  }

  handleFiltersChanged(filters: AdditionalFilters): void {
    this.marketplaceSearchService.search(filters);
  }

  getFilterData(): AdditionalFiltersData {
    return {
      use: this.includedFilters,
      selectedThematicFocusValues:
        this.marketplaceSearchService.getThematicFocusFilter(),
      selectedBestPracticeCategories:
        this.marketplaceSearchService.getBestPractiseCategoryFilter(),
      selectedOfferCategories:
        this.marketplaceSearchService.getOfferCategoryFilter()
    };
  }
}
