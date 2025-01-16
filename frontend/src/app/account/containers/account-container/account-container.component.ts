import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ActivityService } from 'src/app/shared/services/activity.service';
import { OrganisationService } from 'src/app/sign-up/services/organisation.service';
import { OrgaService } from 'src/app/profile-pages/orga-profile/orga.service';
import { AccountFacadeService } from '../../account-facade.service';
import { FeatureService } from 'src/app/shared/components/feature/feature.service';
import { CommonModule } from '@angular/common';
import { AccountLayoutComponent } from '../../components/account-layout.component';
import { PageMenuComponent } from 'src/app/shared/components/layout/page-menu/page-menu.component';
import { MenuItemActiveDirective } from 'src/app/shared/components/layout/page-menu/menu-item-active.directive';
import { MenuItemDirective } from 'src/app/shared/components/layout/page-menu/menu-item.directive';
import { TranslateModule } from '@ngx-translate/core';
import { NewBadgeComponent } from 'src/app/shared/components/base/badges/new-badge.component';
import { AuthenticatedExcludingRolesDirective } from 'src/app/auth/directives/authenticated-excluding-roles.directive';
import { AuthenticatedDirective } from 'src/app/auth/directives/authenticated.directive';
import { WithOrgaDirective } from 'src/app/auth/directives/with-orga.directive';
import { WithoutOrgaDirective } from 'src/app/auth/directives/without-orga.directive';

@Component({
  selector: 'app-account-container',
  standalone: true,
  imports: [
    CommonModule,
    AccountLayoutComponent,
    PageMenuComponent,
    MenuItemActiveDirective,
    MenuItemDirective,
    RouterModule,
    TranslateModule,
    AuthenticatedExcludingRolesDirective,
    AuthenticatedDirective,
    WithOrgaDirective,
    WithoutOrgaDirective,
    NewBadgeComponent
  ],
  templateUrl: './account-container.component.html',
  styleUrls: ['./account-container.component.scss']
})
export class AccountContainerComponent {
  activities = this.orgaService.activities;
  orga = this.orgaService.organisation;

  constructor(
    private authService: AuthService,
    public activityService: ActivityService,
    public featureService: FeatureService,
    public orgService: OrganisationService,
    private orgaService: OrgaService,
    private router: Router,
    private accountFacade: AccountFacadeService
  ) {}

  changePasswordHandler(): void {
    this.authService.changePassword();
  }

  private loadOrganisationDataForLoggedInUser() {
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.orgId) {
      this.orgaService.getOrganisationById(currentUser.orgId);
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
