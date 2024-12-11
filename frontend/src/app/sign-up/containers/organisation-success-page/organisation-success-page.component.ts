import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { DirectusContentService } from '../../../shared/services/directus-content.service';
import { OrganisationService } from '../../services/organisation.service';
import { CommonModule } from '@angular/common';
import { NotificationPageComponent } from 'src/app/shared/components/layout/notification-page/notification-page.component';

@Component({
  selector: 'app-organisation-success-page',
  standalone: true,
  imports: [CommonModule, NotificationPageComponent],
  templateUrl: './organisation-success-page.component.html'
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
