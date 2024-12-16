import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import Activity from 'src/app/shared/models/actvitiy';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ActiFacadeService } from '../../acti-facade.service';
import { ActivityUtilsService } from '../../services/activity-utils.service';
import { FeatureService } from 'src/app/shared/components/feature/feature.service';
import { CommonModule } from '@angular/common';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { MatButtonModule } from '@angular/material/button';
import { ListWithHeadingLayoutComponent } from 'src/app/shared/components/layout/list-with-heading-layout.component';
import { CardListComponent } from 'src/app/shared/components/cards/card-list.component';
import { BaseCardComponent } from 'src/app/shared/components/cards/base-card/base-card.component';
import { AlertComponent } from 'src/app/shared/components/base/alert.component';
import { MatIconModule } from '@angular/material/icon';
import { ActionComponent } from 'src/app/shared/components/base/action.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    CommonModule,
    PageWithHeaderLayoutComponent,
    MatButtonModule,
    TranslateModule,
    ListWithHeadingLayoutComponent,
    CardListComponent,
    BaseCardComponent,
    MatPaginatorModule,
    AlertComponent,
    MatIconModule,
    ActionComponent,
    SpinnerComponent,
    MatTooltipModule
  ],
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
    private loader: LoadingService,
    public featureService: FeatureService
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

  copyHandler(uuid?: number): void {
    this.actiFacade.copyActivity(uuid);
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

  createDanHandler(): void {
    this.actiFacade.createActivity(false, true);
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
