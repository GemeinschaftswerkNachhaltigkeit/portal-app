import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { DirectusContentService } from '../services/directus-content.service';
import { OrganisationService } from '../services/organisation.service';

@Component({
  selector: 'app-organisation-success-page',
  templateUrl: './organisation-success-page.component.html',
  styleUrls: ['./organisation-success-page.component.scss']
})
export class OrganisationSuccessPageComponent implements OnInit {
  public orgData$ = this.orgService.orgData$;
  public orgContent$ = this.directusContentService.orgContent$;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orgService: OrganisationService,
    private directusContentService: DirectusContentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const orgId = params['organisationId'];
      if (orgId) {
        this.orgService.getOrganisation(orgId);
      }
    });
    this.directusContentService.getSignUpOrganisationtTranslations();
  }
  leaveWizard() {
    this.router.navigate(['/account']);
  }
  isContactSameAsCurrentUser(org: OrganisationWIP | null) {
    return !org?.contactInvite;
  }
}
