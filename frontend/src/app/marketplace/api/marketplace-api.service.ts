import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo-client';
import { Observable } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import { MarketplaceItemDto } from '../models/marketplace-item-dto';
import { SearchFilters } from '../models/search-filters';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceApiService {
  constructor(
    private http: HttpClient,
    private readonly tracker: MatomoTracker
  ) {}

  search(
    searchFilter: SearchFilters
  ): Observable<PagedResponse<MarketplaceItemDto>> {
    this.tracker.trackSiteSearch(
      JSON.stringify(searchFilter, null, 2),
      'MARKETPLACE_SEARCH'
    );
    return this.http.get<PagedResponse<MarketplaceItemDto>>(
      `${environment.apiUrl}/marketplace`,
      {
        params: this.searchParams(searchFilter)
      }
    );
  }

  getFeatured(): Observable<PagedResponse<MarketplaceItemDto>> {
    return this.http.get<PagedResponse<MarketplaceItemDto>>(
      `${environment.apiUrl}/marketplace`,
      {
        params: this.featuredParams()
      }
    );
  }

  getMarketplaceItem(id: number): Observable<MarketplaceItemDto> {
    return this.http.get<MarketplaceItemDto>(
      `${environment.apiUrl}/marketplace/${id}`
    );
  }

  private featuredParams(): HttpParams {
    let params = new HttpParams();
    params = params.append('featured', 'true');
    return params;
  }

  private searchParams(searchFilter: SearchFilters): HttpParams {
    let params = new HttpParams();

    params = params.append('page', searchFilter.page || '');
    params = params.append(
      'size',
      searchFilter.size || defaultPaginatorOptions.pageSize
    );
    params = params.append('query', (searchFilter.query || '').trim());
    params = params.append('sort', `createdAt,desc,ignorecase`);

    if (searchFilter.thematicFocus) {
      params = params.append(
        'thematicFocus',
        searchFilter.thematicFocus?.join(',')
      );
    }
    if (searchFilter.offerCat) {
      searchFilter.offerCat?.forEach((tf) => {
        params = params.append('offerCat', tf);
      });
    }
    if (searchFilter.bestPractiseCat) {
      searchFilter.bestPractiseCat?.forEach((tf) => {
        params = params.append('bestPractiseCat', tf);
      });
    }
    return params;
  }
}
