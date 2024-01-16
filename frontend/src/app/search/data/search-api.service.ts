import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DynamicFilters } from 'src/app/map/models/search-filter';
import SearchResult, {
  SearchResultResponseContent
} from 'src/app/map/models/search-result';
import { MarketplaceItemDto } from 'src/app/marketplace/models/marketplace-item-dto';
import PagedResponse from 'src/app/shared/models/paged-response';
import { SearchUtilsService } from 'src/app/shared/services/search-utils.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchApiService {
  private readonly searchEndpoint = `${environment.apiV2Url}/search`;
  private readonly marketplaceEndpoint = `${environment.apiUrl}/marketplace`;

  searchUtils = inject(SearchUtilsService);
  http = inject(HttpClient);

  searchOrgas(
    filters: DynamicFilters
  ): Observable<PagedResponse<SearchResult>> {
    return this.http
      .get<PagedResponse<SearchResultResponseContent>>(this.searchEndpoint, {
        params: { ...filters, resultType: 'ORGANISATION' }
      })
      .pipe(map(this.searchUtils.mapSearchResults));
  }

  searchEvents(
    filters: DynamicFilters
  ): Observable<PagedResponse<SearchResult>> {
    return this.http
      .get<PagedResponse<SearchResultResponseContent>>(this.searchEndpoint, {
        params: { ...filters, resultType: 'ACTIVITY', activityType: 'EVENT' }
      })
      .pipe(map(this.searchUtils.mapSearchResults));
  }

  searchMarketplace(
    filters: DynamicFilters
  ): Observable<PagedResponse<SearchResult>> {
    return this.http
      .get<PagedResponse<MarketplaceItemDto>>(this.marketplaceEndpoint, {
        params: { ...filters }
      })
      .pipe(
        map((results) => {
          const newResults: PagedResponse<SearchResult> = {
            number: results.number,
            size: results.size,
            totalElements: results.totalElements,
            totalPages: results.totalPages,
            content: []
          };
          newResults.content = results.content.map((r) => {
            return {
              ...r,
              resultType: 'MARKETPLACE'
            } as SearchResult;
          });
          return newResults;
        })
      );
  }
}
