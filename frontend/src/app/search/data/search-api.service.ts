import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicFilters } from 'src/app/map/models/search-filter';
import { MarketplaceItemDto } from 'src/app/marketplace/models/marketplace-item-dto';
import Activity from 'src/app/shared/models/actvitiy';
import Organisation from 'src/app/shared/models/organisation';
import PagedResponse from 'src/app/shared/models/paged-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchApiService {
  private readonly searchEndpoint = `${environment.apiV2Url}/search`;
  private readonly marketplaceEndpoint = `${environment.apiV2Url}/marketplace`;

  http = inject(HttpClient);

  searchOrgas(
    filters: DynamicFilters
  ): Observable<PagedResponse<Organisation>> {
    return this.http.get<PagedResponse<Organisation>>(this.searchEndpoint, {
      params: { ...filters, resultType: 'ORGANISATION' }
    });
  }

  searchEvents(
    filters: DynamicFilters
  ): Observable<PagedResponse<Organisation>> {
    return this.http.get<PagedResponse<Activity>>(this.searchEndpoint, {
      params: { ...filters, resultType: 'ACTIVITY', activityType: 'EVENT' }
    });
  }

  searchMarketplace(
    filters: DynamicFilters
  ): Observable<PagedResponse<Organisation>> {
    return this.http.get<PagedResponse<MarketplaceItemDto>>(
      this.marketplaceEndpoint,
      {
        params: { ...filters }
      }
    );
  }
}
