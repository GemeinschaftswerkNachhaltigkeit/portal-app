import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchHeaderComponent } from '../components/search-header/search-header.component';
import { SearchService, Type } from '../data/search.service';
import { TypeFilterComponent } from '../components/type-filter/type-filter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResultsHeadingComponent } from '../components/results-heading/results-heading.component';
import { OrgaCardComponent } from 'src/app/shared/standalone/cards/orga-card/orga-card.component';
import { EventCardComponent } from 'src/app/shared/standalone/cards/event-card/event-card.component';
import { MarketplaceCardComponent } from 'src/app/shared/standalone/cards/marketplace-card/marketplace-card.component';
import { RemainingResultsHeadingComponent } from '../components/remaining-results-heading/remaining-results-heading.component';
import { AllResultsLinkComponent } from '../components/all-results-link/all-results-link.component';
import { OrgaResultComponent } from '../components/orga-result/orga-result.component';
import { EventResultComponent } from '../components/event-result/event-result.component';
import { MarketplaceResultComponent } from '../components/marketplace-result/marketplace-result.component';
import { NoResultsComponent } from '../components/no-results/no-results.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    SearchHeaderComponent,
    TypeFilterComponent,
    ResultsHeadingComponent,
    OrgaCardComponent,
    EventCardComponent,
    MarketplaceCardComponent,
    RemainingResultsHeadingComponent,
    AllResultsLinkComponent,
    OrgaResultComponent,
    EventResultComponent,
    MarketplaceResultComponent,
    NoResultsComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchService = inject(SearchService);
  loading = inject(LoadingService);
  searchValue = this.searchService.searchValue;
  activeType = this.searchService.activeType;
  results = this.searchService.results;
  mainResults = this.searchService.mainResults;
  remainingResults = this.searchService.remainingResults;
  isLoading = toSignal(this.loading.isLoading$('search-loader', 200));

  setType(type: Type): void {
    this.searchService.setResultType(type);
  }

  handleSearch(searchValue: string): void {
    this.searchService.setResultType('marketplace');
    this.searchService.search(searchValue);
  }
}
