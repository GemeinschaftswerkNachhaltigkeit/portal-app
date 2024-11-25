import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, of } from 'rxjs';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import PagedResponse from '../../shared/models/paged-response';
import SearchFilter from '../models/search-filter';
import SearchResult, {
  SearchResultResponseContent
} from '../models/search-result';
import { MatomoTracker } from 'ngx-matomo-client';
import MarkerDto from '../models/markerDto';
import { FeatureService } from 'src/app/shared/components/feature/feature.service';

@Injectable({
  providedIn: 'root'
})
export class MapApiService {
  constructor(
    private http: HttpClient,
    private feature: FeatureService,
    private readonly tracker: MatomoTracker
  ) {}

  search(searchFilter: SearchFilter): Observable<PagedResponse<SearchResult>> {
    if (searchFilter.envelope) {
      this.tracker.trackSiteSearch(
        JSON.stringify(searchFilter, null, 2),
        'MAP_SEARCH'
      );
      const danActive$ = this.feature.show$('dan-account');
      const getRequest = (danActive: boolean) =>
        this.http
          .get<PagedResponse<SearchResultResponseContent>>(
            `${environment.apiV2Url}/search`,
            {
              params: this.searchParams(searchFilter, true, true, danActive)
            }
          )
          .pipe(
            map((results: PagedResponse<SearchResultResponseContent>) => {
              const newResults: PagedResponse<SearchResult> = {
                number: results.number,
                size: results.size,
                totalElements: results.totalElements,
                totalPages: results.totalPages,
                content: []
              };
              newResults.content = results.content.map((r) => {
                const resType = r.resultType;
                if (resType === 'ORGANISATION') {
                  return {
                    ...r.organisation,
                    resultType: resType
                  } as SearchResult;
                } else if (resType === 'DAN') {
                  return {
                    ...r.activity,
                    resultType: resType
                  } as SearchResult;
                } else {
                  console.error('Invalid result type', resType);
                  return {} as SearchResult;
                }
              });
              return newResults;
            })
          );

      return danActive$.pipe(
        mergeMap((active) =>
          getRequest(active).pipe(
            map((request) => {
              return request;
            })
          )
        )
      );
    } else {
      return of({ content: [] });
    }
  }

  searchMarkers(searchFilter: SearchFilter): Observable<MarkerDto[]> {
    const danActive$ = this.feature.show$('dan-account');
    const getMarkerRequest = (active: boolean) =>
      this.http.get<MarkerDto[]>(`${environment.apiV2Url}/search/markers`, {
        params: this.searchParams(searchFilter, true, false, active)
      });

    return danActive$.pipe(
      mergeMap((active) =>
        getMarkerRequest(active).pipe(
          map((request) => {
            return request;
          })
        )
      )
    );
  }

  byId(type: string, id: number): Observable<SearchResult> {
    const danActive$ = this.feature.show$('dan-account');
    const enpoint = type === 'DAN' ? 'activities' : 'organisations';
    const getRequest = (active: boolean) => {
      console.log('BY ID', active, type);
      if (!active && type === 'DAN') {
        throw new Error('DAN period not active');
      }
      return this.http
        .get<SearchResult>(`${environment.apiUrl}/${enpoint}/${id}`, {})
        .pipe(
          map((result: SearchResult) => {
            result.resultType = type;
            return result;
          })
        );
    };
    return danActive$.pipe(
      mergeMap((active) => {
        return getRequest(active).pipe(
          map((request) => {
            return request;
          })
        );
      })
    );
  }

  private searchParams(
    searchFilter: SearchFilter,
    includeExpiredActivities = false,
    includeNoCoords = false,
    includeDan = true
  ): HttpParams {
    let params = new HttpParams();
    params = params.append(
      'includeExpiredActivities',
      includeExpiredActivities
    );
    params = params.append('includeNoCoords', includeNoCoords);
    params = params.append('page', searchFilter.page || '');
    params = params.append(
      'size',
      searchFilter.size || defaultPaginatorOptions.pageSize
    );
    params = params.append('query', (searchFilter.query || '').trim());
    params = params.append('location', searchFilter.location || '');
    if (searchFilter.viewType) {
      searchFilter.viewType?.forEach((resultType) => {
        if (resultType === 'DAN' && includeDan) {
          params = params.append('resultType', resultType);
        }
        if (resultType !== 'DAN') {
          params = params.append('resultType', resultType);
        }
      });
    }
    if (!searchFilter.viewType || !searchFilter.viewType?.length) {
      if (includeDan) {
        params = params.append('resultType', 'DAN');
      }
      params = params.append('resultType', 'ORGANISATION');
    }

    if (searchFilter.envelope && searchFilter.envelope !== 'mobile') {
      params = params.append('envelope', searchFilter.envelope || '');
    }
    searchFilter.sdgs?.forEach((sdg) => {
      params = params.append('sustainableDevelopmentGoals', sdg);
    });
    searchFilter.thematicFocus?.forEach((tf) => {
      params = params.append('thematicFocus', tf);
    });
    searchFilter.impactAreas?.forEach((ia) => {
      params = params.append('impactArea', ia);
    });

    searchFilter.orgaTypes?.forEach((orgaType) => {
      params = params.append('organisationType', orgaType);
    });

    if (searchFilter.initiator) {
      params = params.append('initiator', true);
    }
    if (searchFilter.projectSustainabilityWinner) {
      params = params.append('projectSustainabilityWinner', true);
    }

    return params;
  }
}
