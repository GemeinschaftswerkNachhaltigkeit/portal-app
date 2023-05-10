import { Component, OnInit } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import Activity from 'src/app/shared/models/actvitiy';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ActiFacadeService } from '../../acti-facade.service';
import { ActivityUtilsService } from '../../services/activity-utils.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  loading$ = this.loader.isLoading$();
  activities$ = this.actiFacade.activities$;
  paging$ = this.actiFacade.activitiesPaging$;
  activityWips$ = this.actiFacade.activityWips$;
  activityWipsPaging$ = this.actiFacade.activityWipsPaging$;
  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = defaultPaginatorOptions.pageSizeOptions;

  constructor(
    public actiFacade: ActiFacadeService,
    public utils: ActivityUtilsService,
    private router: Router,
    private route: ActivatedRoute,
    private feedback: FeedbackService,
    private translate: TranslateService,
    private loader: LoadingService
  ) {}

  pageChangedHandler(event: PageEvent): void {
    this.actiFacade.changePage(event.pageIndex, event.pageSize);
  }
  wipsPageChangedHandler(event: PageEvent): void {
    this.actiFacade.changeWipsPage(event.pageIndex, event.pageSize);
  }

  deleteHandler(id?: number): void {
    this.actiFacade.deleteActivity(id);
  }

  editHandler(uuid?: number): void {
    this.actiFacade.updateActivity(uuid);
  }

  deleteWipHandler(uuid?: string): void {
    this.actiFacade.deleteActivityWip(uuid);
  }

  editWipHandler(uuid?: string): void {
    this.actiFacade.updateActivityWip(uuid);
  }

  createHandler(): void {
    this.actiFacade.createActivity();
  }

  openActivity(acti: Activity): void {
    this.actiFacade.openActivity(acti);
  }

  ngOnInit(): void {
    this.actiFacade.loadActivities();
    this.route.queryParams.subscribe((params: Params) => {
      if (params['update'] === 'success') {
        this.feedback.showFeedback(
          this.translate.instant('account.notifications.activityUpdateSuccess'),
          'success'
        );
        this.router.navigate(['.'], { relativeTo: this.route });
      }
    });
  }
}
