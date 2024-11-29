import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import Activity from 'src/app/shared/models/actvitiy';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ActivityFacadeService } from '../../activity-facade.service';

@Component({
  selector: 'app-activity-profile-container',
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
