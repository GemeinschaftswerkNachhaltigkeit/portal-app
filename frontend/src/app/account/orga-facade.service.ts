import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, take } from 'rxjs';
import { User } from '../auth/models/user';
import { UserRole } from '../auth/models/user-role';
import { AuthService } from '../auth/services/auth.service';
import { ConfirmationService } from '../core/services/confirmation.service';
import { FeedbackService } from '../shared/components/feedback/feedback.service';
import Organisation from '../shared/models/organisation';
import { OrganisationStatus } from '../shared/models/organisation-status';
import { OrganisationWIP } from '../shared/models/organisation-wip';
import { ErrorService } from '../shared/services/error.service';
import { LoadingService } from '../shared/services/loading.service';
import { OrganisationApiService } from './api/organisation-api.service';
import UserDto from './models/user-dto';
import UserListDto from './models/user-list-dto';

import { OrganisationStateService } from './state/organisation-state.service';

@Injectable({
  providedIn: 'root'
})
export class OrgaFacadeService {
  constructor(
    private auth: AuthService,
    private loading: LoadingService,
    private organisationApi: OrganisationApiService,
    private organisationState: OrganisationStateService,
    private confirm: ConfirmationService,
    private feedback: FeedbackService,
    private error: ErrorService,
    private translate: TranslateService,
    private router: Router
  ) {}

  // Organisation

  get organisation$(): Observable<Organisation | null> {
    return this.organisationState.organisation$;
  }
  get users$(): Observable<UserListDto[]> {
    return this.organisationState.users$;
  }

  openOrga(orga: Organisation): void {
    this.router.navigate(['/', 'organisations', orga.id]);
  }

  userIsOrgaAdmin(): boolean {
    const user = this.auth.getUser();
    if (user) {
      return this.auth.hasAnyRole(user, [UserRole.ORGANISATION_ADMIN]);
    } else {
      return false;
    }
  }

  hasOrganisationOrWip(): boolean {
    const user = this.auth.getUser();
    return !!user?.orgId || !!user?.orgWipId;
  }

  hasOrga(): boolean {
    const user = this.auth.getUser();
    return !!user?.orgId;
  }

  isInClearing(orga: Organisation): boolean {
    return orga.status === OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION;
  }

  isInProgress(orga: Organisation): boolean {
    const user = this.auth.getUser();
    const noFinishedOrg = !user?.orgId;
    return (
      noFinishedOrg &&
      !!orga.status &&
      orga.status !== OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION
    );
  }

  async loadOrganisationOfUser(): Promise<void> {
    this.organisationState.setOrganisation(null);
    await this.auth.refreshToken();
    const user = this.auth.getUser();

    if (this.userHasConfirmedOrga(user)) {
      this.loadOrga(user);
    }
    if (this.userHasWorkInProgressOrga(user)) {
      this.loadOrgaWip();
    }
  }

  private userHasWorkInProgressOrga(user?: User): boolean {
    return !!user && !!user.orgWipId;
  }

  private userHasConfirmedOrga(user?: User): boolean {
    return !!user && !!user.orgId;
  }

  private loadOrga(user?: User): void {
    this.loading.start('load-my-orga');
    this.organisationApi
      .organisationOfCurrentUser(user)
      .pipe(take(1))
      .subscribe({
        next: (orga) => {
          this.organisationState.setOrganisation(orga);
          if (orga && orga.id) {
            this.loadUsers(orga.id);
          }
          this.loading.stop('load-my-orga');
        },
        error: () => {
          this.loading.stop('load-my-orga');
        }
      });
  }

  private loadOrgaWip(): void {
    this.loading.start('load-my-orga-wip');
    this.organisationApi
      .organisationWipOfCurrentUser()
      .pipe(take(1))
      .subscribe({
        next: (orga) => {
          this.organisationState.setOrganisation(orga);
          this.loading.stop('load-my-orga-wip');
        },
        error: () => {
          this.loading.stop('load-my-orga-wip');
        }
      });
  }

  createOrganisation() {
    this.organisationApi
      .createOrganisation()
      .pipe(take(1))
      .subscribe({
        next: async (uuid) => {
          await this.auth.refreshToken();
          this.openOrgaWizard(uuid);
        }
      });
  }

  updateOrganisation() {
    const user = this.auth.getUser();
    if (user?.orgId) {
      this.organisationApi
        .updateOrganisation(user)
        .pipe(take(1))
        .subscribe({
          next: (uuid) => this.openOrgaWizard(uuid)
        });
    }
    if (user?.orgWipId) {
      this.organisationApi
        .organisationWipOfCurrentUser()
        .pipe(take(1))
        .subscribe({
          next: (wip: OrganisationWIP) =>
            this.openOrgaWizard(wip.randomUniqueId || '')
        });
    }
  }

  private openOrgaWizard(orgaUUID: string | null): void {
    if (orgaUUID) {
      this.router.navigate(['/sign-up', 'organisation', orgaUUID]);
    }
  }

  leaveOrganisation() {
    const ref = this.confirm.open({
      title: this.translate.instant('account.titles.leave'),
      description: this.translate.instant('account.texts.leave'),
      button: this.translate.instant('account.buttons.leave')
    });
    ref
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.organisationApi
            .leaveOrganisation()
            .pipe(take(1))
            .subscribe({
              next: () => this.loadOrganisationOfUser(),
              error: (error: HttpErrorResponse) => {
                this.error.handleErrors(error, [
                  {
                    status: 409,
                    feedbackKey: 'account.notifications.lastAdmin'
                  }
                ]);
              }
            });
        }
      });
  }

  deleteOrganiation(): void {
    const ref = this.confirm.open({
      title: this.translate.instant('account.titles.deleteOrga'),
      description: this.translate.instant('account.texts.deleteOrga'),
      button: this.translate.instant('account.buttons.delete')
    });
    const user = this.auth.getUser();
    ref
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.organisationApi
            .deleteOrganisation(user)
            .pipe(take(1))
            .subscribe({
              next: () => {
                return this.loadOrganisationOfUser();
              }
            });
        }
      });
  }

  addUser(
    user: UserDto,
    orgaId: number,
    successCallback: () => void
  ): Subscription {
    this.loading.start('new-user');
    return this.organisationApi
      .addUser(user, orgaId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.feedback.showFeedback(
            this.translate.instant('account.notifications.userAdded')
          );
          successCallback();
          this.loadUsers(orgaId);
          this.loading.stop('new-user');
        },
        error: (error) => {
          this.error.handleErrors(error, [
            {
              status: 409,
              msg: 'user - is not allowed to join organisation.',
              feedbackKey: 'account.notifications.notAllwedToJoinOrga'
            }
          ]);
          this.loading.stop('new-user');
        }
      });
  }

  deleteUser(user: UserListDto, orgaId: number): void {
    const ref = this.confirm.open({
      title: this.translate.instant('account.titles.confirmDelteUser'),
      description: this.translate.instant('account.texts.confirmDelteUser', {
        email: user.email,
        role: this.translate.instant('account.labels.' + user.userType)
      }),
      button: this.translate.instant('account.buttons.deleteUser')
    });
    ref
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.organisationApi
            .deleteUser(user, orgaId)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.feedback.showFeedback(
                  this.translate.instant('account.notifications.userDelted')
                );
                this.loadUsers(orgaId);
              },
              error: (error) => {
                this.error.handleErrors(error, [
                  {
                    status: 409,
                    feedbackKey: 'account.notifications.lastAdmin'
                  }
                ]);
              }
            });
        }
      });
  }

  loadUsers(orgId: number): void {
    this.loading.start('load-users');
    this.organisationApi
      .getUsers(orgId)
      .pipe(take(1))
      .subscribe({
        next: (users: UserListDto[]) => {
          this.organisationState.setUsers(users);
          this.loading.stop('load-users');
        },
        error: () => {
          this.loading.stop('load-users');
        }
      });
  }
}
