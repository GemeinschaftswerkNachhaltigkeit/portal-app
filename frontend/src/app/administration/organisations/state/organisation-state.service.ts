import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import Organisation from 'src/app/shared/models/organisation';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';

@Injectable({
  providedIn: 'root'
})
export class OrganisationStateService {
  private organisationsResponse = new BehaviorSubject<
    PagedResponse<Organisation>
  >({
    content: []
  });

  get organisations$(): Observable<Organisation[]> {
    return this.organisationsResponse
      .asObservable()
      .pipe(map((response) => response.content));
  }

  get organisationsPaging$(): Observable<Paging> {
    return this.organisationsResponse.asObservable().pipe(
      map((response) => ({
        number: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      }))
    );
  }

  setOrganisationResponse(response: PagedResponse<Organisation>): void {
    this.organisationsResponse.next(response);
  }

  removeOrga(orgaId: number): void {
    const response = { ...this.organisationsResponse.value };
    response.content = response.content.filter((entry) => entry.id !== orgaId);
    this.organisationsResponse.next(response);
  }

  updateInitiatorStatus(orgaId: number): void {
    const orgasResponse = { ...this.organisationsResponse.value };
    const content = [...orgasResponse.content];
    const orgaIndex = content.findIndex((orga) => orga.id === orgaId);
    if (orgaIndex !== -1) {
      const orga = content[orgaIndex];
      content[orgaIndex] = {
        ...orga,
        initiator: !orga.initiator
      };
      orgasResponse.content = content;
      this.organisationsResponse.next(orgasResponse);
    }
  }
}
