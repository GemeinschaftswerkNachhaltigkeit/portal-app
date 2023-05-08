import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';
import { BestPracticesDto } from '../models/best-practices-dto';
import { BestPracticesWipDto } from '../models/best-practices-wip-dto';

@Injectable({
  providedIn: 'root'
})
export class BestPracticesStateService {
  private bestPracticesWip = new BehaviorSubject<BestPracticesWipDto | null>(
    null
  );
  private bestPracticesWipUuid = new BehaviorSubject<string | null>(null);
  private bestPracticeWips = new BehaviorSubject<
    PagedResponse<BestPracticesWipDto>
  >({
    content: []
  });
  private bestPractices = new BehaviorSubject<PagedResponse<BestPracticesDto>>({
    content: []
  });

  get bestPractices$(): Observable<BestPracticesDto[]> {
    return this.bestPractices.asObservable().pipe(
      map((pagedBestPracticess: PagedResponse<BestPracticesDto>) => {
        return pagedBestPracticess.content;
      })
    );
  }

  get bestPracticesPaging$(): Observable<Paging> {
    return this.bestPractices.asObservable().pipe(
      map((response: PagedResponse<BestPracticesWipDto>) => {
        return {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        };
      })
    );
  }

  get bestPracticeWips$(): Observable<BestPracticesWipDto[]> {
    return this.bestPracticeWips.asObservable().pipe(
      map((pagedBestPracticess: PagedResponse<BestPracticesWipDto>) => {
        return pagedBestPracticess.content;
      })
    );
  }

  get bestPracticeWipsPaging$(): Observable<Paging> {
    return this.bestPracticeWips.asObservable().pipe(
      map((response: PagedResponse<BestPracticesDto>) => {
        return {
          number: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        };
      })
    );
  }

  get bestPracticesWip$(): Observable<BestPracticesWipDto | null> {
    return this.bestPracticesWip.asObservable();
  }

  get bestPracticesWipUuid$(): Observable<string | null> {
    return this.bestPracticesWipUuid.asObservable();
  }

  setBestPracticesWip(bestPracticesWip: BestPracticesWipDto): void {
    this.bestPracticesWip.next(bestPracticesWip);
  }
  setBestPracticessWipUuid(bestPracticesWipUuid: string): void {
    this.bestPracticesWipUuid.next(bestPracticesWipUuid);
  }

  setBestPracticesResponse(resp: PagedResponse<BestPracticesDto>): void {
    this.bestPractices.next(resp);
  }

  setBestPracticesWipsResponse(resp: PagedResponse<BestPracticesWipDto>): void {
    this.bestPracticeWips.next(resp);
  }
}
