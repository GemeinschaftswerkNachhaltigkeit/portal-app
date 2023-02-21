import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import Paging from 'src/app/shared/models/paging';
import PagedResponse from '../../shared/models/paged-response';
import MarkerDto from '../models/markerDto';
import SearchResult from '../models/search-result';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {
  private searchResp = new BehaviorSubject<PagedResponse<SearchResult>>({
    content: []
  });
  private markers = new BehaviorSubject<MarkerDto[]>([]);
  private currentResult = new BehaviorSubject<SearchResult | null>(null);

  get markers$(): Observable<MarkerDto[]> {
    return this.markers.asObservable();
  }

  get currentResult$(): Observable<SearchResult | null> {
    return this.currentResult.asObservable();
  }

  get searchResults$(): Observable<SearchResult[]> {
    return this.searchResp
      .asObservable()
      .pipe(map((response) => response.content));
  }

  get searchPaging$(): Observable<Paging> {
    return this.searchResp.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  getResultForIdAndType(type = '', id = -1): SearchResult | undefined {
    return this.searchResp.value.content.find(
      (sr) => sr.id === id && sr.resultType === type
    );
  }

  setSearchResponse(resp: PagedResponse<SearchResult>): void {
    this.searchResp.next(resp);
  }

  setCurrentResult(res: SearchResult | null): void {
    this.currentResult.next(res);
  }

  setMarkers(makers: MarkerDto[]): void {
    this.markers.next(makers);
  }
}
