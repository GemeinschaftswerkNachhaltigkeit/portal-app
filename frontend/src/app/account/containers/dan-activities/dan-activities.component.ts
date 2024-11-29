import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import Activity from 'src/app/shared/models/actvitiy';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ActiFacadeService } from '../../acti-facade.service';
import { ActivityUtilsService } from '../../services/activity-utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DanHelpModalComponent } from './dan-help-modal/dan-help-modal.component';

@Component({
  selector: 'app-dan-activities',
  templateUrl: './dan-activities.component.html',
  styleUrls: ['./dan-activities.component.scss']
})
export class DanActivitiesComponent implements OnInit {
  readonly danLimit = 100;

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
    private loader: LoadingService,
    private dialog: MatDialog
  ) {}

  pageChangedHandler(event: PageEvent): void {
    this.actiFacade.changePage(event.pageIndex, event.pageSize, true);
  }
  wipsPageChangedHandler(event: PageEvent): void {
    this.actiFacade.changeWipsPage(event.pageIndex, event.pageSize);
  }

  deleteHandler(id?: number): void {
    this.actiFacade.deleteActivity(id, true);
  }

  editHandler(uuid?: number): void {
    this.actiFacade.updateActivity(uuid, true);
  }

  copyHandler(uuid?: number): void {
    this.actiFacade.copyActivity(uuid, true);
  }

  deleteWipHandler(uuid?: string): void {
    this.actiFacade.deleteActivityWip(uuid, true);
  }

  editWipHandler(uuid?: string): void {
    this.actiFacade.updateActivityWip(uuid, true);
  }

  createHandler(): void {
    this.actiFacade.createActivity(true);
  }

  openActivity(acti: Activity): void {
    this.actiFacade.openActivity(acti);
  }

  openHelp(): void {
    this.dialog.open(DanHelpModalComponent, {
      width: '800px'
    });
  }

  ngOnInit(): void {
    this.actiFacade.loadActivities(true);
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
