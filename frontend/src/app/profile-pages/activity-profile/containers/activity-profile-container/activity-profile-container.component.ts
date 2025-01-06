import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import Activity from 'src/app/shared/models/actvitiy';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ActivityFacadeService } from '../../activity-facade.service';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from 'src/app/profile-pages/components/profile-layout.component';
import { SectionComponent } from 'src/app/profile-pages/components/section.component';
import { ActionComponent } from 'src/app/shared/components/base/action.component';
import {
  BreadcrumbsComponent,
  BreadcrumbComponent
} from 'src/app/shared/components/base/breadcrumb';
import { HtmlWrapperComponent } from 'src/app/shared/components/base/html-wrapper.component';
import { SdgIconComponent } from 'src/app/shared/components/base/sdg-icon.component';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { MenuItemActiveDirective } from 'src/app/shared/components/layout/page-menu/menu-item-active.directive';
import { MenuItemDirective } from 'src/app/shared/components/layout/page-menu/menu-item.directive';
import { PageMenuComponent } from 'src/app/shared/components/layout/page-menu/page-menu.component';
import { ActivitySubscriptionActionComponent } from 'src/app/shared/components/subscription';
import { EventBadgesComponent } from 'src/app/shared/components/base/badges/event-badges.component copy';
import { ContactComponent } from 'src/app/profile-pages/components/contact.component';
import { HeroComponent } from 'src/app/profile-pages/components/hero.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-activity-profile-container',
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
    EventBadgesComponent,
    HtmlWrapperComponent,
    ActivitySubscriptionActionComponent,
    ContactComponent,
    TranslateModule,
    MatIconModule
  ],
  templateUrl: './activity-profile-container.component.html',
  styleUrls: ['./activity-profile-container.component.scss']
})
export class ActivityProfileContainerComponent implements OnInit {
  activity$ = this.activityFacade.activity$;
  unsubscribe$ = new Subject();

  constructor(
    public subscription: SubscriptionFacadeService,
    private translate: TranslateService,
    private activityFacade: ActivityFacadeService,
    private route: ActivatedRoute,
    private router: Router,
    private utils: UtilsService
  ) {}

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

  shareLink(activity: Activity): string {
    const link = location.href;
    const subject = this.translate.instant(
      'profile.texts.shareActivity.subject'
    );
    const body = this.translate.instant('profile.texts.shareActivity.body', {
      activity: activity.name,
      link: link
    });
    return `mailto:?subject=${subject}&body=${body}`;
  }

  isExpired(activity: Activity): boolean {
    return this.utils.isExpiredActivity(activity.period);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['activityId'];
    this.activityFacade.getById(id);
    this.utils.scrollTop();
  }
}
