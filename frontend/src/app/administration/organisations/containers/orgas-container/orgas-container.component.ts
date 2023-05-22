import { Component, OnInit } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { DynamicFilters } from 'src/app/map/models/search-filter';
import Organisation from 'src/app/shared/models/organisation';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { environment } from 'src/environments/environment';
import { OrgaFacadeService } from '../../orga-facade.service';

@Component({
  selector: 'app-orgas-container',
  templateUrl: './orgas-container.component.html',
  styleUrls: ['./orgas-container.component.scss']
})
export class OrgasContainerComponent implements OnInit {
  orgas$ = this.orgaFacade.organisations$;
  paging$ = this.orgaFacade.organisationsPaging$;
  filters$ = this.orgaFacade.filters$;
  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = defaultPaginatorOptions.pageSizeOptions;
  contextPath = environment.contextPath;
  isLoading$ = this.loading.isLoading$();

  constructor(
    private orgaFacade: OrgaFacadeService,
    public loading: LoadingService
  ) {}

  deleteHandler(orga: Organisation): void {
    this.orgaFacade.deleteOrganiation(orga.id);
  }

  editHandler(orga: Organisation): void {
    this.orgaFacade.updateOrganisation(orga.id);
  }

  open(orga: Organisation): void {
    this.orgaFacade.openOrga(orga);
  }

  noLocation(orga: Organisation): boolean {
    return !orga.location?.online && !orga.location?.coordinate;
  }

  handleToggleInitiator(orga: Organisation): void {
    if (orga?.id) {
      this.orgaFacade.toggleInitiator(orga.id);
    }
  }

  filtersChangedHandler(filters: DynamicFilters): void {
    this.orgaFacade.loadOrgas(filters);
  }

  pageChangedHandler(event: PageEvent): void {
    this.orgaFacade.changePage(event.pageIndex, event.pageSize);
  }

  sortChangedHandler(sortType: string): void {
    const sortParam = { sort: sortType };
    this.orgaFacade.loadOrgas(sortParam);
  }

  ngOnInit(): void {
    this.orgaFacade.setInitalFilters();
    this.orgaFacade.loadOrgas();
  }
}
