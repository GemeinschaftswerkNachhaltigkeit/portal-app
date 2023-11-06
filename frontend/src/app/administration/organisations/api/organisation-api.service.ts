import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import SearchFilter from 'src/app/map/models/search-filter';
import Organisation from 'src/app/shared/models/organisation';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import PagedResponse from 'src/app/shared/models/paged-response';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganisationApiService {
  constructor(private http: HttpClient) {}

  allOrganisations(
    searchFilter: SearchFilter
  ): Observable<PagedResponse<Organisation>> {
    return this.http.get<PagedResponse<Organisation>>(
      `${environment.apiUrl}/organisations`,
      {
        params: this.searchParams(searchFilter)
      }
    );
  }

  private searchParams(searchFilter: SearchFilter): HttpParams {
    let params = new HttpParams();
    params = params.append('page', searchFilter.page || '');
    params = params.append(
      'size',
      searchFilter.size || defaultPaginatorOptions.pageSize
    );
    params = params.append(
      'sort',
      searchFilter.sort
        ? searchFilter.sort + ',ignorecase'
        : `createdAt,desc,ignorecase`
    );
    params = params.append('query', (searchFilter.query || '').trim());

    return params;
  }

  deleteOrganisation(orgId: number): Observable<object> {
    return this.http.delete(`${environment.apiUrl}/organisations/${orgId}`);
  }

  updateOrganisation(orgId: number): Observable<string> {
    return this.http
      .put<OrganisationWIP>(`${environment.apiUrl}/organisations/${orgId}`, {})
      .pipe(map((orgaWip: OrganisationWIP) => orgaWip.randomUniqueId || ''));
  }

  toggleInitator(id: number): Observable<object> {
    return this.http.put(
      `${environment.apiUrl}/organisations/${id}/toggle-initiator`,
      {}
    );
  }
}
