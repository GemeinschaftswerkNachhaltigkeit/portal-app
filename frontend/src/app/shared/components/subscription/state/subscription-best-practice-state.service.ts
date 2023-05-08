import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BestPracticesDto } from 'src/app/marketplace/models/best-practices-dto';
import PagedResponse from '../../../models/paged-response';
import Paging from '../../../models/paging';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionBestPracticeStateService {
  private bestPracticeSubscriptionsResponse = new BehaviorSubject<
    PagedResponse<{ bestPractice: BestPracticesDto }>
  >({ content: [] });

  get bestPracticeSubscriptions$(): Observable<BestPracticesDto[]> {
    return this.bestPracticeSubscriptionsResponse
      .asObservable()
      .pipe(map((response) => response.content.map((c) => c.bestPractice)));
  }

  get bestPracticeSubscriptionsPaging$(): Observable<Paging> {
    return this.bestPracticeSubscriptionsResponse.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  bestPracticeIsSubcribed(id?: number): boolean {
    const resp = this.bestPracticeSubscriptionsResponse.value;
    if (resp) {
      const ids = resp.content.map((c) => c.bestPractice.id || -1);
      return this.isSubscibed(ids, id);
    } else {
      return false;
    }
  }

  setBestPracticeSubscriptionsResp(
    resp: PagedResponse<{ bestPractice: BestPracticesDto }>
  ): void {
    this.bestPracticeSubscriptionsResponse.next(resp);
  }

  private isSubscibed(ids: number[], id?: number): boolean {
    return !!id && ids.includes(id);
  }
}
