/*  eslint-disable  @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, take } from 'rxjs';
import { OrganisationStatus } from 'src/app/shared/models/organisation-status';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import Paging, { PageQuerParams } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';
import PagedOrganisationWipResponse from '../models/paged-org-wip-response';
import { map, Observable } from 'rxjs';
import DuplicateDto from '../models/duplicate-dto';

const REQUEST_URL = environment.apiUrl + '/manage-organisations'; //'http://localhost:8081/api/v1/register-organisation/';

@Injectable({
  providedIn: 'root'
})
export class ClearingService {
  orgDataSubject = new BehaviorSubject<PagedOrganisationWipResponse>({
    content: []
  });

  orgDuplicateSubject = new BehaviorSubject<DuplicateDto | null>(null);
  orgDuplicate$ = this.orgDuplicateSubject.asObservable();

  constructor(private http: HttpClient) {}

  async getOrganisations(page: PageQuerParams, includeFeedback = false) {
    const status = includeFeedback
      ? [
          OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION,
          OrganisationStatus.RUECKFRAGE_CLEARING
        ]
      : OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION;
    try {
      const response = await lastValueFrom(
        this.http.get<PagedOrganisationWipResponse>(REQUEST_URL, {
          params: {
            ...page,
            status: status
          }
        })
      );
      this.orgDataSubject.next(response);
      return response;
    } catch (e) {
      //   this.orgUpdateStateSubject.next({ type: 'loadError', error: true });
      console.error('loadError', e);
      return;
    }
  }

  async publishOrganisation(orgId: number) {
    try {
      const response = await lastValueFrom(
        this.http.post<any>(`${REQUEST_URL}/${orgId}/publish`, {})
      );
      return response;
    } catch (e) {
      console.error('publishError', e);
      return;
    }
  }

  async requireFeedbackForOrganisation(orgId: number, feedback: string) {
    try {
      const response = await lastValueFrom(
        this.http.post<any>(`${REQUEST_URL}/${orgId}/require-feedback`, {
          feedback: feedback
        })
      );
      return response;
    } catch (e) {
      console.error('requireFeedbackError', e);
      return;
    }
  }

  async rejectOrganisation(orgId: number, reason: string) {
    try {
      const response = await lastValueFrom(
        this.http.post<any>(`${REQUEST_URL}/${orgId}/reject`, {
          rejectionReason: reason
        })
      );
      return response;
    } catch (e) {
      console.error('requireFeedbackError', e);
      return;
    }
  }

  get orgData$(): Observable<OrganisationWIP[]> {
    return this.orgDataSubject
      .asObservable()
      .pipe(map((response) => response.content));
  }

  get orgListPaging$(): Observable<Paging> {
    return this.orgDataSubject.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  get orgListPaging(): Paging {
    const orgData = this.orgDataSubject.value;
    return {
      number: orgData.number,
      size: orgData.size,
      totalElements: orgData.totalElements,
      totalPages: orgData.totalPages
    };
  }

  isAllowedToRequestFeedback(status: OrganisationStatus): boolean {
    if (status === OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION) {
      return true;
    }
    return false;
  }

  isAllowedToReject(status: OrganisationStatus): boolean {
    if (status === OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION) {
      return true;
    }
    return false;
  }

  isAllowedToPublish(status: OrganisationStatus): boolean {
    if (
      status === OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION ||
      status === OrganisationStatus.RUECKFRAGE_CLEARING
    ) {
      return true;
    }
    return false;
  }

  getDuplicate(orgId: number) {
    this.http
      .get<DuplicateDto>(`${REQUEST_URL}/${orgId}/duplicates`)
      .pipe(take(1))
      .subscribe({
        next: (duplicateDto) => {
          this.orgDuplicateSubject.next(duplicateDto);
        },
        error: (e) => {
          console.error('getDuplicates', e);
        }
      });
  }
}
