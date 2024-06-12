/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganisationStatus } from 'src/app/shared/models/organisation-status';

import { DirectusService } from 'src/app/shared/services/directus.service';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';
import { environment } from 'src/environments/environment';
import { DirectusContentService } from '../../shared/services/directus-content.service';
import { ImportDescisionService } from '../services/import-descision.service';
import { OrganisationService } from '../services/organisation.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {
  orgId = null;

  participationDeclarationUrl = '';

  denied = false;

  public orgData$ = this.orgService.orgData$;
  public orgImportContent$ = this.directusContentService.orgImportContent$;

  constructor(
    public lpService: LandingpageService,
    public directusService: DirectusService,
    private directusContentService: DirectusContentService,
    private importService: ImportDescisionService,
    private router: Router,
    private orgService: OrganisationService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.orgId = params['organisationId'];
      if (this.orgId) {
        this.orgService.getOrganisation(this.orgId).then((org) => {
          this.directusContentService.getImportDescisionTranslations({
            orgname: org?.name || ''
          });

          if (
            org?.status === OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION ||
            org?.status === OrganisationStatus.NEW
          ) {
            this.goToOrgWizard(this.orgId!);
          }
          if (
            org?.status ===
            OrganisationStatus.FREIGABE_VERWEIGERT_KONTAKT_INITIATIVE
          ) {
            this.denied = true;
          }
        });
      }
    });
    this.directusService
      .getParticipationDeclarationUrl()
      .then((res) => (this.participationDeclarationUrl = res!));
  }

  accept() {
    if (this.orgId) {
      this.importService.acceptPrivacyPolicy(this.orgId).then((resp) => {
        if (resp) {
          this.goToOrgWizard(this.orgId!);
        }
      });
    }
  }

  deny() {
    if (this.orgId) {
      this.importService.denyPrivacyPolicy(this.orgId).then((resp) => {
        if (resp) {
          this.denied = true;
        }
      });
    }
  }

  goToOrgWizard(id: string) {
    this.router.navigate(['sign-up/organisation/' + id], {
      queryParams: {
        forceRegistration: true
      }
    });
  }

  goToLandingpage() {
    location.href = environment.landingPageUrl;
  }
}
