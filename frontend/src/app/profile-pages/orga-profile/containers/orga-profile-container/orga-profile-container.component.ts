import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import Organisation from 'src/app/shared/models/organisation';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { OrgaFacadeService } from '../../orga-facade.service';
import { CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { ProfileLayoutComponent } from 'src/app/profile-pages/components/profile-layout.component';
import {
  BreadcrumbComponent,
  BreadcrumbsComponent
} from 'src/app/shared/components/base/breadcrumb';
import { PageMenuComponent } from 'src/app/shared/components/layout/page-menu/page-menu.component';
import { MenuItemDirective } from 'src/app/shared/components/layout/page-menu/menu-item.directive';
import { MenuItemActiveDirective } from 'src/app/shared/components/layout/page-menu/menu-item-active.directive';
import { ActionComponent } from 'src/app/shared/components/base/action.component';
import { SectionComponent } from 'src/app/profile-pages/components/section.component';
import { SdgIconComponent } from 'src/app/shared/components/base/sdg-icon.component';
import { OrgaBadgesComponent } from 'src/app/shared/components/base/badges/orga-badges.component';
import { HtmlWrapperComponent } from 'src/app/shared/components/base/html-wrapper.component';
import { TabsComponent } from '../../components/tabs/tabs.component';
import { TabComponent } from '../../components/tabs/tab.component';
import { ListItemComponent } from '../../components/list-item.component';
import {
  ActivitySubscriptionActionComponent,
  OrganisationSubscriptionActionComponent
} from 'src/app/shared/components/subscription';
import { ContactComponent } from 'src/app/profile-pages/components/contact.component';
import { HeroComponent } from 'src/app/profile-pages/components/hero.component';

@Component({
  selector: 'app-orga-profile-container',
  standalone: true,
  imports: [
    CommonModule,
    LoadingIndicatorComponent,
    ProfileLayoutComponent,
    HeroComponent,
    BreadcrumbsComponent,
    BreadcrumbComponent,
    PageMenuComponent,
    MenuItemDirective,
    MenuItemActiveDirective,
    RouterModule,
    ActionComponent,
    SectionComponent,
    SdgIconComponent,
    OrgaBadgesComponent,
    HtmlWrapperComponent,
    TabsComponent,
    TabComponent,
    ListItemComponent,
    ActivitySubscriptionActionComponent,
    OrganisationSubscriptionActionComponent,
    ContactComponent,
    TranslateModule
  ],
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
