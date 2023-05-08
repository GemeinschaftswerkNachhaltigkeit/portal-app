import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import PagedResponse from '../../shared/models/paged-response';
import SearchFilter from '../models/search-filter';
import SearchResult, {
  SearchResultResponseContent
} from '../models/search-result';
import { DateTime } from 'luxon';
import { MatomoTracker } from '@ngx-matomo/tracker';
import MarkerDto from '../models/markerDto';

@Injectable({
  providedIn: 'root'
})
export class MapApiService {
  constructor(
    private http: HttpClient,
    private readonly tracker: MatomoTracker
  ) {}

  search(searchFilter: SearchFilter): Observable<PagedResponse<SearchResult>> {
    if (searchFilter.envelope) {
      this.tracker.trackSiteSearch(
        JSON.stringify(searchFilter, null, 2),
        'MAP_SEARCH'
      );
      return this.http
        .get<PagedResponse<SearchResultResponseContent>>(
          `${environment.apiUrl}/search`,
          {
            params: this.searchParams(searchFilter, true, true)
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
              } else if (resType === 'ACTIVITY') {
                return {
                  ...r.activity,
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
    } else {
      return of({ content: [] });
    }
  }

  searchMarkers(searchFilter: SearchFilter): Observable<MarkerDto[]> {
    return this.http.get<MarkerDto[]>(`${environment.apiUrl}/search/markers`, {
      params: this.searchParams(searchFilter)
    });
  }

  byId(type: string, id: number): Observable<SearchResult> {
    const enpoint = type === 'ACTIVITY' ? 'activities' : 'organisations';
    return this.http
      .get<SearchResult>(`${environment.apiUrl}/${enpoint}/${id}`, {})
      .pipe(
        map((result: SearchResult) => {
          result.resultType = type;
          return result;
        })
      );
  }

  private searchParams(
    searchFilter: SearchFilter,
    includeExpiredActivities = false,
    includeNoCoords = false
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
    params = params.append('query', searchFilter.query || '');
    params = params.append('location', searchFilter.location || '');
    searchFilter.viewType?.forEach((resultType) => {
      params = params.append('resultType', resultType);
    });
    if (searchFilter.envelope) {
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

    searchFilter.activityTypes?.forEach((activityType) => {
      params = params.append('activityTypes', activityType);
    });

    if (searchFilter.startDate) {
      const startDateValue = DateTime.fromISO(searchFilter.startDate)
        .setZone('utc')
        .toISO({ includeOffset: true });
      params = params.append('startDate', startDateValue);
    }

    if (searchFilter.endDate) {
      const endDateValue = DateTime.fromISO(searchFilter.endDate)
        .setZone('utc')
        .toISO({ includeOffset: true });
      params = params.append('endDate', endDateValue);
    }

    if (searchFilter.initiator) {
      params = params.append('initiator', true);
    }
    if (searchFilter.projectSustainabilityWinner) {
      params = params.append('projectSustainabilityWinner', true);
    }

    return params;
  }
}
