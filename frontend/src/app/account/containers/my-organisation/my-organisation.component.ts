import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import Organisation from 'src/app/shared/models/organisation';
import { UserStatus } from 'src/app/shared/models/user-status';
import { UserType } from 'src/app/shared/models/user-type';
import { LoadingService } from 'src/app/shared/services/loading.service';
import UserListDto from '../../models/user-list-dto';
import { OrgaFacadeService } from '../../orga-facade.service';

@Component({
  selector: 'app-my-organisation',
  templateUrl: './my-organisation.component.html',
  styleUrls: ['./my-organisation.component.scss']
})
export class MyOrganisationComponent implements OnInit {
  organisation$ = this.orgaFacade.organisation$;
  users$ = this.orgaFacade.users$;
  loading$ = this.loader.isLoading$();

  users: UserListDto[] = [
    {
      email: 'patrick@test.com',
      userType: UserType.ADMIN,
      status: UserStatus.OPEN
    }
  ];

  constructor(
    private orgaFacade: OrgaFacadeService,
    private feedback: FeedbackService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private loader: LoadingService,
    private auth: AuthService
  ) {}

  hasOrgaOrWip(): boolean {
    return this.orgaFacade.hasOrganisationOrWip();
  }

  hasOrga(): boolean {
    return this.orgaFacade.hasOrganisationOrWip();
  }

  isOrgaAdmin(): boolean {
    return this.orgaFacade.userIsOrgaAdmin() || true;
  }

  isClearing(orga: Organisation): boolean {
    return this.orgaFacade.isInClearing(orga);
  }
  isInProgress(orga: Organisation): boolean {
    return this.orgaFacade.isInProgress(orga);
  }

  createHandler(): void {
    this.orgaFacade.createOrganisation();
  }

  deleteHandler(): void {
    this.orgaFacade.deleteOrganiation();
  }

  editHandler(): void {
    this.orgaFacade.updateOrganisation();
  }

  leaveHandler(): void {
    this.orgaFacade.leaveOrganisation();
  }

  openOrga(orga: Organisation): void {
    if (this.isInProgress(orga)) {
      this.editHandler();
    } else {
      this.orgaFacade.openOrga(orga);
    }
  }

  deleteUserHandler(user: UserListDto, orgaId?: number): void {
    if (user && orgaId) {
      this.orgaFacade.deleteUser(user, orgaId);
    }
  }

  ngOnInit(): void {
    this.orgaFacade.loadOrganisationOfUser();
    this.route.queryParams.subscribe((params: Params) => {
      if (params['update'] === 'success') {
        this.feedback.showFeedback(
          this.translate.instant('account.notifications.orgaUpdateSuccess'),
          'success'
        );
        this.router.navigate(['.'], { relativeTo: this.route });
      }
    });
  }
}
