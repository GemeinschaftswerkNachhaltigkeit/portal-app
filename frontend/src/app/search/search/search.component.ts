import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchHeaderComponent } from '../components/search-header/search-header.component';
import { SearchService, Type } from '../data/search.service';
import { TypeFilterComponent } from '../components/type-filter/type-filter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResultsHeadingComponent } from '../components/results-heading/results-heading.component';
import { OrgaCardComponent } from 'src/app/shared/standalone/orga-card/orga-card.component';
import { EventCardComponent } from 'src/app/shared/standalone/event-card/event-card.component';
import { MarketplaceCardComponent } from 'src/app/shared/standalone/marketplace-card/marketplace-card.component';

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
    MarketplaceCardComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchService = inject(SearchService);
  searchValue = this.searchService.searchValue;
  activeType = this.searchService.activeType;
  results = this.searchService.results;

  setType(type: Type): void {
    this.searchService.setResultType(type);
  }

  handleSearch(searchValue: string): void {
    this.searchService.setResultType('marketplace');
    this.searchService.search(searchValue);
  }
}
