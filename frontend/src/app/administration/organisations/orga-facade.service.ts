import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, take } from 'rxjs';
import { ConfirmationService } from 'src/app/core/services/confirmation.service';
import { DynamicFilters } from 'src/app/map/models/search-filter';
import { ErrorService } from 'src/app/shared/services/error.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { PersistFiltersService } from 'src/app/shared/services/persist-filters.service';
import { OrganisationApiService } from './api/organisation-api.service';
import { OrganisationStateService } from './state/organisation-state.service';
import { OrganisationUiStateService } from './state/organisation-ui-state.service';
import { environment } from 'src/environments/environment';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import Organisation from 'src/app/shared/models/organisation';
import PagedResponse from 'src/app/shared/models/paged-response';
import Paging from 'src/app/shared/models/paging';

@Injectable({
  providedIn: 'root'
})
export class OrgaFacadeService {
  constructor(
    private loading: LoadingService,
    private organisationApi: OrganisationApiService,
    private organisationState: OrganisationStateService,
    private organisationUiState: OrganisationUiStateService,
    private confirm: ConfirmationService,
    private feedback: FeedbackService,
    private error: ErrorService,
    private persistFilters: PersistFiltersService,
    private translate: TranslateService,
    private router: Router
  ) {}

  searchRequest?: Subscription;
  filters$ = this.organisationUiState.filters$;

  get organisations$(): Observable<Organisation[]> {
    return this.organisationState.organisations$;
  }

  get organisationsPaging$(): Observable<Paging> {
    return this.organisationState.organisationsPaging$;
  }

  openOrga(orga: Organisation): void {
    window.open(environment.contextPath + 'organisations/' + orga.id, '_blank');
  }

  setInitalFilters(): void {
    const filters = this.persistFilters.getFiltersFromUrl();
    this.organisationUiState.setFilters(filters);
  }

  loadOrgas(searchFilter?: DynamicFilters): void {
    this.organisationState.setOrganisationResponse({
      content: []
    });
    this.loading.start('load-orgas');
    let filters;
    if (searchFilter) {
      filters = searchFilter;
      this.persistFilters.setFiltersToUrl(searchFilter, [
        '/',
        'administration',
        'organisations'
      ]);
    } else {
      filters = this.organisationUiState.filterValues;
    }
    this.organisationUiState.setFilters(filters);
    if (this.searchRequest) {
      this.searchRequest.unsubscribe();
    }
    this.organisationApi
      .allOrganisations(filters)
      .pipe(take(1))
      .subscribe({
        next: (res: PagedResponse<Organisation>) => {
          this.organisationState.setOrganisationResponse(res);

          this.loading.stop('load-orgas');
        },
        error: () => {
          this.loading.stop('load-orgas');
        }
      });
  }

  updateOrganisation(orgaId?: number) {
    if (orgaId) {
      this.organisationApi
        .updateOrganisation(orgaId)
        .pipe(take(1))
        .subscribe({
          next: (uuid: string) => this.openOrgaWizard(uuid)
        });
    }
  }

  private openOrgaWizard(orgaUUID: string | null): void {
    if (orgaUUID) {
      this.router.navigate(['/sign-up', 'organisation', orgaUUID]);
    }
  }

  deleteOrganiation(orgaId?: number): void {
    if (orgaId) {
      const ref = this.confirm.open({
        title: this.translate.instant('account.titles.deleteOrga'),
        description: this.translate.instant('account.texts.deleteOrga'),
        button: this.translate.instant('account.buttons.delete')
      });
      ref
        .afterClosed()
        .pipe(take(1))
        .subscribe((confirmed) => {
          if (confirmed) {
            this.organisationState.removeOrga(orgaId);
            this.organisationApi
              .deleteOrganisation(orgaId)
              .pipe(take(1))
              .subscribe({
                error: () => {
                  return this.loadOrgas();
                }
              });
          }
        });
    }
  }

  changePage(page: number, size: number): void {
    this.loadOrgas({ page: page, size: size });
  }

  toggleInitiator(orgaId: number): void {
    this.organisationApi.toggleInitator(orgaId).subscribe({
      next: () => {
        this.organisationState.updateInitiatorStatus(orgaId);
      },
      error: () => {
        this.loadOrgas();
        this.feedback.showFeedback(
          this.translate.instant('error.unknown'),
          'error'
        );
      }
    });
  }
}
