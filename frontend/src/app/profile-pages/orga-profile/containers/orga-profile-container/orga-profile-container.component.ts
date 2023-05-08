import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import Organisation from 'src/app/shared/models/organisation';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { OrgaFacadeService } from '../../orga-facade.service';

@Component({
  selector: 'app-orga-profile-container',
  templateUrl: './orga-profile-container.component.html',
  styleUrls: ['./orga-profile-container.component.scss']
})
export class OrgaProfileContainerComponent implements OnInit {
  orga$ = this.orgaFacade.orga$;
  activities$ = this.orgaFacade.activites$;
  offers$ = this.orgaFacade.offers$;
  bp$ = this.orgaFacade.bp$;

  constructor(
    private translate: TranslateService,
    private orgaFacade: OrgaFacadeService,
    public subscription: SubscriptionFacadeService,
    private route: ActivatedRoute,
    private router: Router,
    private utils: UtilsService,
    public loader: LoadingService
  ) {}

  shareLink(orga: Organisation): string {
    const link = location.href;
    const subject = this.translate.instant('profile.texts.shareOrga.subject');
    const body = this.translate.instant('profile.texts.shareOrga.body', {
      orga: orga.name,
      link: link
    });
    return `mailto:?subject=${subject}&body=${body}`;
  }

  followHandler(orgaId?: number, name?: string): void {
    if (orgaId) {
      this.subscription.followOrganisation(
        orgaId,
        this.translate.instant('authModal.subtitleOrganisation', {
          organisation: name
        })
      );
    }
  }
  unfollowHandler(orgaId?: number): void {
    if (orgaId) {
      this.subscription.unfollowOrganisation(orgaId);
    }
  }

  bookmarkHandler(activityId?: number, name?: string): void {
    if (activityId) {
      this.subscription.bookmarkActivity(
        activityId,
        this.translate.instant('authModal.subtitleActivity', {
          activity: name
        })
      );
    }
  }
  unbookmarkHandler(activityId?: number): void {
    if (activityId) {
      this.subscription.unbookmarkActivity(activityId);
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['orgaId'];
    this.orgaFacade.getById(id);
    this.utils.scrollTop();
  }
}
