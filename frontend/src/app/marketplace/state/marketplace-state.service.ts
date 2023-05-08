import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';
import { MarketplaceItemDto as MarketplaceItemDto } from '../models/marketplace-item-dto';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceStateService {
  private marketplaceItems = new BehaviorSubject<
    PagedResponse<MarketplaceItemDto>
  >({
    content: []
  });
  private featuredMarketplaceItems = new BehaviorSubject<
    PagedResponse<MarketplaceItemDto>
  >({
    content: []
  });
  private marketplaceItem = new BehaviorSubject<MarketplaceItemDto | null>(
    null
  );

  get marketplaceItems$(): Observable<MarketplaceItemDto[]> {
    return this.marketplaceItems.asObservable().pipe(
      map((marketplaceItems: PagedResponse<MarketplaceItemDto>) => {
        return marketplaceItems.content;
      })
    );
  }
  get featuredMarketplaceItems$(): Observable<MarketplaceItemDto[]> {
    return this.featuredMarketplaceItems.asObservable().pipe(
      map((marketplaceItems: PagedResponse<MarketplaceItemDto>) => {
        return marketplaceItems.content;
      })
    );
  }

  get marketplaceItemsPaging$(): Observable<Paging> {
    return this.marketplaceItems.asObservable().pipe(
      map((response: PagedResponse<MarketplaceItemDto>) => {
        return {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        };
      })
    );
  }

  setMarketplaceItemsResponse(resp: PagedResponse<MarketplaceItemDto>): void {
    this.marketplaceItems.next(resp);
  }

  setFeaturedMarketplaceItemsResponse(
    resp: PagedResponse<MarketplaceItemDto>
  ): void {
    this.featuredMarketplaceItems.next(resp);
  }

  get marketplaceItem$(): Observable<MarketplaceItemDto | null> {
    return this.marketplaceItem.asObservable();
  }

  setMarketplaceItemResponse(resp: MarketplaceItemDto): void {
    this.marketplaceItem.next(resp);
  }
}
