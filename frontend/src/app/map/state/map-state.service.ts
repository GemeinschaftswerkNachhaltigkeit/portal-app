import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import Paging from 'src/app/shared/models/paging';
import PagedResponse from '../../shared/models/paged-response';
import MarkerDto from '../models/markerDto';
import SearchResult from '../models/search-result';

@Injectable({
  providedIn: 'root'
})
export abstract class SharedMapStateService {
  private searchResp = new BehaviorSubject<PagedResponse<SearchResult>>({
    content: []
  });
  private markers = new BehaviorSubject<MarkerDto[]>([]);
  private currentResult = new BehaviorSubject<SearchResult | null>(null);
  private embedded = false;

  get markers$(): Observable<MarkerDto[]> {
    return this.markers.asObservable();
  }

  get currentResult$(): Observable<SearchResult | null> {
    return this.currentResult.asObservable();
  }

  get isEmbedded(): boolean {
    return this.embedded;
  }

  set isEmbedded(isEmbedded: boolean) {
    this.embedded = isEmbedded;
  }

  getResultForIdAndType(type = '', id = -1): SearchResult | undefined {
    return this.searchResp.value.content.find(
      (sr) => sr.id === id && sr.resultType === type
    );
  }

  setCurrentResult(res: SearchResult | null): void {
    this.currentResult.next(res);
  }

  setMarkers(makers: MarkerDto[]): void {
    this.markers.next(makers);
  }
}

@Injectable({ providedIn: 'root' })
export class InternalMapStateService {
  private searchResp = new BehaviorSubject<PagedResponse<SearchResult>>({
    content: []
  });
  private sharedMapState = inject(SharedMapStateService);

  get markers$(): Observable<MarkerDto[]> {
    return this.sharedMapState.markers$;
  }

  get currentResult$(): Observable<SearchResult | null> {
    return this.sharedMapState.currentResult$;
  }

  get isEmbedded(): boolean {
    return this.sharedMapState.isEmbedded;
  }

  set isEmbedded(isEmbedded: boolean) {
    this.sharedMapState.isEmbedded = isEmbedded;
  }

  getResultForIdAndType(type = '', id = -1): SearchResult | undefined {
    return this.sharedMapState.getResultForIdAndType(type, id);
  }

  setCurrentResult(res: SearchResult | null): void {
    this.sharedMapState.setCurrentResult(res);
  }

  setMarkers(makers: MarkerDto[]): void {
    this.sharedMapState.setMarkers(makers);
  }

  /* #### Methods for internal map only ### */
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

  setSearchResponse(resp: PagedResponse<SearchResult>): void {
    this.searchResp.next(resp);
  }
}

@Injectable({ providedIn: 'root' })
export class EmbeddedMapStateService {
  private sharedMapState = inject(SharedMapStateService);

  get markers$(): Observable<MarkerDto[]> {
    return this.sharedMapState.markers$;
  }

  get currentResult$(): Observable<SearchResult | null> {
    return this.sharedMapState.currentResult$;
  }

  get isEmbedded(): boolean {
    return this.sharedMapState.isEmbedded;
  }

  set isEmbedded(isEmbedded: boolean) {
    this.sharedMapState.isEmbedded = isEmbedded;
  }

  getResultForIdAndType(type = '', id = -1): SearchResult | undefined {
    return this.sharedMapState.getResultForIdAndType(type, id);
  }

  setCurrentResult(res: SearchResult | null): void {
    this.sharedMapState.setCurrentResult(res);
  }

  setMarkers(makers: MarkerDto[]): void {
    this.sharedMapState.setMarkers(makers);
  }
}
