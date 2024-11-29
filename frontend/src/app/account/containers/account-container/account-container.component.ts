import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ActivityService } from 'src/app/shared/services/activity.service';
import { OrganisationService } from 'src/app/sign-up/services/organisation.service';
import { OrgaFacadeService } from 'src/app/profile-pages/orga-profile/orga-facade.service';
import { AccountFacadeService } from '../../account-facade.service';
import { FeatureService } from 'src/app/shared/components/feature/feature.service';

@Component({
  selector: 'app-account-container',
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.scss']
})
export class AccountContainerComponent {
  activities$ = this.orgaFacade.activites$;
  orga$ = this.orgaFacade.orga$;

  constructor(
    private authService: AuthService,
    public activityService: ActivityService,
    public featureService: FeatureService,
    public orgService: OrganisationService,
    private orgaFacade: OrgaFacadeService,
    private router: Router,
    private accountFacade: AccountFacadeService
  ) {}

  changePasswordHandler(): void {
    this.authService.changePassword();
  }

  private loadOrganisationDataForLoggedInUser() {
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.orgId) {
      this.orgaFacade.getById(currentUser.orgId);
    } else {
      throw new Error('error: no activities');
    }
  }

  createWipActivityForActivity(orgId: number, activityId: number) {
    this.activityService
      .createWipActivityForActivity(orgId, activityId)
      .then((resp) => {
        if (resp?.randomUniqueId) {
          this.router.navigate([
            '/sign-up/activity/' + orgId + '/' + resp?.randomUniqueId
          ]);
        }
      });
  }

  createActivity() {
    const currentUser = this.authService.getUser();
    const orgid = currentUser?.orgId?.toString();
    if (orgid) {
      this.activityService.createActivity(orgid).then((resp) => {
        if (resp?.randomUniqueId) {
          this.router.navigate([
            '/sign-up/activity/' + orgid + '/' + resp?.randomUniqueId
          ]);
        }
      });
    }
  }

  createOrg() {
    this.orgService.createOrganisation().then((resp) => {
      if (resp?.randomUniqueId) {
        this.router.navigate(['/sign-up/organisation/' + resp?.randomUniqueId]);
      }
    });
  }

  updateOrg(orgId: number) {
    this.orgService.createWipOrgForOrg(orgId).then((resp) => {
      if (resp?.randomUniqueId) {
        this.router.navigate(['/sign-up/organisation/' + resp?.randomUniqueId]);
      }
    });
  }

  async deleteActivity(orgId: number, activityId: number) {
    this.activityService
      .deleteActivity(orgId, activityId)
      .then(() => this.loadOrganisationDataForLoggedInUser())
      .catch((err) =>
        console.error('unexpected error deleting activity.', err)
      );
  }

  getKeycloakConsoleUrl() {
    return this.accountFacade.getKeycloakConsoleUrl();
  }
}
