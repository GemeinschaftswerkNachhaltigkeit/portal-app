import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';

import PagedResponse from 'src/app/shared/models/paged-response';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import EventDto from '../models/event-dto';
import SearchFilter from '../models/search-filter';
import Activity from 'src/app/shared/models/actvitiy';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {
  constructor(
    private http: HttpClient,
    private readonly tracker: MatomoTracker
  ) {}

  search(searchFilter: SearchFilter): Observable<PagedResponse<EventDto>> {
    this.tracker.trackSiteSearch(
      JSON.stringify(searchFilter, null, 2),
      'EVENTS_SEARCH'
    );
    return this.http
      .get<
        PagedResponse<{
          resultType: string;
          activity: Activity;
        }>
      >(`${environment.apiUrl}/search`, {
        params: this.searchParams(searchFilter, true, true)
      })
      .pipe(
        map(
          (
            results: PagedResponse<{
              resultType: string;
              activity: Activity;
            }>
          ) => {
            const result: PagedResponse<EventDto> = {
              number: results.number,
              size: results.size,
              totalElements: results.totalElements,
              totalPages: results.totalPages,
              content: []
            };
            result.content = results.content.map((r) => {
              const resType = r.resultType;
              return {
                ...r.activity,
                resultType: resType
              } as EventDto;
            });
            return result;
          }
        )
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

    searchFilter.thematicFocus?.forEach((tf) => {
      params = params.append('thematicFocus', tf);
    });

    if (searchFilter.startDate) {
      const startDateValue = DateTime.fromISO(searchFilter.startDate)
        .setZone('utc')
        .toISO({ includeOffset: true });
      if (startDateValue) {
        params = params.append('startDate', startDateValue);
      }
    }

    if (searchFilter.endDate) {
      const endDateValue = DateTime.fromISO(searchFilter.endDate)
        .setZone('utc')
        .toISO({ includeOffset: true });
      if (endDateValue) {
        params = params.append('endDate', endDateValue);
      }
    }
    return params;
  }
}
