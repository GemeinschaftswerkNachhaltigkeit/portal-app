import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import { PageQuerParams } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import { BestPracticesDto } from '../models/best-practices-dto';
import { BestPracticesWipDto } from '../models/best-practices-wip-dto';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class BestPracticeApiService {
  constructor(private http: HttpClient) {}

  setStatus(
    orgId: number,
    bestPracticeId: number,
    status: Status
  ): Observable<object> {
    return this.http.put(
      `${environment.apiUrl}/organisations/${orgId}/marketplace/best-practise/${bestPracticeId}/status`,
      { status: status }
    );
  }

  createBestPractice(orgId: number): Observable<string> {
    return this.http
      .post<BestPracticesWipDto>(
        `${environment.apiUrl}/organisations/${orgId}/marketplace/best-practise`,
        {}
      )
      .pipe(
        map((bestPractice) => {
          return bestPractice.randomUniqueId || '';
        })
      );
  }

  updateBestPractice(
    orgId: number,
    bestPracticeId: number
  ): Observable<string> {
    return this.http
      .put<BestPracticesWipDto>(
        `${environment.apiUrl}/organisations/${orgId}/marketplace/best-practise/${bestPracticeId}`,
        {}
      )
      .pipe(
        map((bestPractice) => {
          return bestPractice.randomUniqueId || '';
        })
      );
  }

  deleteBestPractice(
    orgId: number,
    bestPracticeId: number
  ): Observable<object> {
    return this.http.delete(
      `${environment.apiUrl}/organisations/${orgId}/marketplace/best-practise/${bestPracticeId}`
    );
  }

  deleteBestPracticeWip(orgId: number, uuid: string): Observable<object> {
    return this.http.delete(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/best-practise/${uuid}`
    );
  }

  getBestPracticesWip(
    orgId: number,
    uuid: string
  ): Observable<BestPracticesWipDto> {
    return this.http.get<BestPracticesWipDto>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/best-practise/${uuid}`
    );
  }

  saveBestPracticesWip(
    orgId: number,
    uuid: string,
    bestPracticesWip: BestPracticesWipDto
  ): Observable<BestPracticesWipDto> {
    return this.http.put<BestPracticesWipDto>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/best-practise/${uuid}`,
      bestPracticesWip
    );
  }
  releaseBestPracticesWip(
    orgId: number,
    uuid: string,
    bestPracticesWip: BestPracticesWipDto
  ): Observable<BestPracticesWipDto> {
    return this.http.post<BestPracticesWipDto>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/best-practise/${uuid}/releases`,
      bestPracticesWip
    );
  }

  deleteBestPracticeImage(orgId: number, uuid: string): Observable<object> {
    return this.http.delete(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/best-practise/${uuid}/image`
    );
  }

  getPagedBestPracticeWips(
    orgId: number,
    paging?: PageQuerParams
  ): Observable<PagedResponse<BestPracticesWipDto>> {
    return this.http.get<PagedResponse<BestPracticesWipDto>>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace-wip/best-practise`,
      {
        params: paging
      }
    );
  }

  getPagedBestPractices(
    orgId: number,
    paging?: PageQuerParams
  ): Observable<PagedResponse<BestPracticesDto>> {
    return this.http.get<PagedResponse<BestPracticesDto>>(
      `${environment.apiUrl}/organisations/${orgId}/marketplace/best-practise`,
      {
        params: paging
      }
    );
  }
}
