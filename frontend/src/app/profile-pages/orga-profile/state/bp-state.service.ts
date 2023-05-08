import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';

@Injectable({
  providedIn: 'root'
})
export class BpStateService {
  bestPracticesPaged = new BehaviorSubject<PagedResponse<BestPracticesDto>>({
    content: []
  });

  get bestPractices$(): Observable<BestPracticesDto[]> {
    return this.bestPracticesPaged
      .asObservable()
      .pipe(map((response) => response.content));
  }

  get bestPracticesPaging$(): Observable<Paging> {
    return this.bestPracticesPaged.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  setBestPracticesResponse(resp: PagedResponse<BestPracticesDto>): void {
    this.bestPracticesPaged.next(resp);
  }
}
