import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo-client';
import { DateTime } from 'luxon';
import { Observable, map, shareReplay } from 'rxjs';

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

  getDates(
    date: DateTime,
    searchFilter: SearchFilter
  ): Observable<{ [key: string]: number }> {
    const month = date.startOf('month').startOf('day').toUTC().toISO();
    return this.http.get<{ [key: string]: number }>(
      `${environment.apiV2Url}/search/month/${month}`,
      {
        params: this.searchParamsCalendar(searchFilter)
      }
    );
  }

  search(
    searchFilter: SearchFilter,
    page: number
  ): Observable<PagedResponse<EventDto>> {
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
      >(`${environment.apiV2Url}/search`, {
        params: this.searchParams(searchFilter, page, true, true)
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
        ),
        shareReplay()
      );
  }

  private searchParamsCalendar(searchFilter: SearchFilter): HttpParams {
    let params = new HttpParams();
    params = params.append('includeExpiredActivities', true);
    if (!searchFilter.onlyDan) {
      params = params.append('resultType', 'ACTIVITY');
    }
    params = params.append('resultType', 'DAN');
    params = params.append('includeAllActionDays', true);
    params = params.append('includeNoCoords', true);
    params = params.append('expiredOnEnd', false);
    params = params.append('query', (searchFilter.query || '').trim());
    params = params.append('location', searchFilter.location || '');
    if (searchFilter.online) {
      params = params.append('online', !!searchFilter.online);
    }
    params = params.append('permanent', !!searchFilter.permanent);

    searchFilter.thematicFocus?.forEach((tf) => {
      params = params.append('thematicFocus', tf);
    });

    return params;
  }

  private searchParams(
    searchFilter: SearchFilter,
    nextPage = 0,
    includeExpiredActivities = false,
    includeNoCoords = false
  ): HttpParams {
    let params = new HttpParams();
    params = params.append(
      'includeExpiredActivities',
      includeExpiredActivities
    );
    if (!searchFilter.onlyDan) {
      params = params.append('resultType', 'ACTIVITY');
    }
    params = params.append('resultType', 'DAN');
    params = params.append('includeAllActionDays', true);
    params = params.append('includeNoCoords', includeNoCoords);
    params = params.append('expiredOnEnd', false);
    params = params.append('page', nextPage);
    params = params.append('size', defaultPaginatorOptions.pageSize);
    params = params.append('sort', `period.start,asc,ignorecase`);
    params = params.append('query', (searchFilter.query || '').trim());
    params = params.append('location', searchFilter.location || '');
    if (searchFilter.online) {
      params = params.append('online', !!searchFilter.online);
    }
    params = params.append('permanent', !!searchFilter.permanent);

    searchFilter.thematicFocus?.forEach((tf) => {
      params = params.append('thematicFocus', tf);
    });

    if (!searchFilter.permanent) {
      if (searchFilter.startDate) {
        const startDateValue = DateTime.fromISO(searchFilter.startDate)
          .startOf('day')
          .toUTC()
          .toISO();
        if (startDateValue) {
          params = params.append('startDate', startDateValue);
        }
      } else {
        const startDateValue = DateTime.now().startOf('day').toUTC().toISO();
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
    }
    return params;
  }
}
