/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { environment } from 'src/environments/environment';
import { ActivityFormComponent } from '../forms/activity-form/activity-form.component';
import { ExternalLinksFormComponent } from '../forms/external-links-form/external-links-form.component';
import { TopicsFormComponent } from '../forms/topics-form/topics-form.component';
import { UserFormComponent } from '../forms/user-form/user-form.component';
import { ActivityWIP } from '../../shared/models/activity-wip';
import { ActivityService } from '../../shared/services/activity.service';
import { DirectusContentService } from '../services/directus-content.service';
import { GeoCoordinateLookupService } from 'src/app/shared/services/geo-coordinate-lookup.service';
import LocationData from 'src/app/shared/models/location-data';
import { MatStepper } from '@angular/material/stepper';
import { ImageType } from '../../shared/models/image-type';
import {
  StepperOrientation,
  STEPPER_GLOBAL_OPTIONS
} from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['../organisation/organisation.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class ActivityComponent implements OnDestroy {
  activityId = '';
  orgId = '';
  isModification = false;

  private paramsSub: Subscription;

  public activityData$ = this.activityService.activityData$;
  public activityContent$ = this.directusContentService.activityContent$;

  public activityStepState$ = this.activityService.activityUpdateStateData$;

  loading$ = this.loading.isLoading$('publishActivity');

  @ViewChild('stepper') stepper!: MatStepper;

  @ViewChild('stepOne') stepOneComponent!: ActivityFormComponent;
  @ViewChild('stepTwo') stepTwoComponent!: TopicsFormComponent;
  @ViewChild('stepThree') stepThreeComponent!: ExternalLinksFormComponent;
  @ViewChild('stepFour') stepFourComponent!: UserFormComponent;

  stepperOrientation: Observable<StepperOrientation>;
  isEditable = true;
  isSubmissionSuccess: boolean | null = null;
  enableAutosave = true;
  disableSubmitBtn = false;

  activityShareLink = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private changeDetectorRef: ChangeDetectorRef,
    private directusContentService: DirectusContentService,
    private loading: LoadingService,
    private translate: TranslateService,
    private geoService: GeoCoordinateLookupService,
    breakpointObserver: BreakpointObserver
  ) {
    this.changeDetectorRef.detach(); //prevent "NG0100: Expression has changed after it was checked" on [stepperControl]=".."
    this.paramsSub = this.route.params.subscribe((params) => {
      this.activityId = params['activityId'];
      this.orgId = params['orgId'];
      if (this.activityId && this.orgId) {
        this.activityService
          .getActivity(this.orgId, this.activityId)
          .then(() => {
            this.isModification =
              this.route.snapshot.queryParams['edit'] === 'true';
            this.changeDetectorRef.reattach();
            this.changeDetectorRef.detectChanges();
          });
      }
    });
    this.directusContentService.getSignUpActivityTranslations();
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 1000px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  get formStepOne() {
    return this.stepOneComponent
      ? this.stepOneComponent.activityFormGroup
      : null;
  }

  get formStepTwo() {
    return this.stepTwoComponent ? this.stepTwoComponent.topicsFormGroup : null;
  }

  get formStepThree() {
    return this.stepThreeComponent
      ? this.stepThreeComponent.linksFormGroup
      : null;
  }

  get formStepFour() {
    return this.stepFourComponent ? this.stepFourComponent.userFormGroup : null;
  }

  backToActivitiesHandler(): void {
    this.router.navigate(['/', 'account', 'activities']);
  }

  deleteHandler(image: ImageType): void {
    this.activityService.deleteImage(this.orgId, this.activityId, image);
  }

  isAllowedToEdit() {
    return this.activityService.isAllowedToEditActivityWip();
  }

  saveActivity(activityWIP: ActivityWIP, stepKey: string) {
    if (
      this.enableAutosave &&
      this.orgId &&
      this.activityId &&
      this.isEditable
    ) {
      this.activityService.updateActivity(
        this.orgId,
        this.activityId,
        activityWIP,
        stepKey
      );
    }
  }

  submit = (): void => {
    const loadingId = this.loading.start('publishActivity');
    this.enableAutosave = false;

    this.activityService
      .getActivity(this.orgId!, this.activityId!)
      .then((activity) => {
        this.geoService
          .getCoordinates(activity?.location as LocationData)
          .then((coords) => {
            this.activityService
              .updateActivity(
                this.orgId!,
                this.activityId!,
                {
                  location: { ...activity?.location, coordinate: coords },
                  contact: { ...activity?.contact }
                },
                'getCoords'
              )
              .then(() => {
                this.activityService
                  .publishActivity(this.orgId!, this.activityId!)
                  .then((resp) => {
                    if (resp) {
                      this.isEditable = false;
                      this.isSubmissionSuccess = true;
                      this.activityShareLink = `${window.location.origin}${environment.contextPath}organisations/${this.orgId}/${resp.id}`;
                    } else {
                      this.isEditable = true;
                      this.isSubmissionSuccess = false;
                    }
                  })
                  .finally(() => this.loading.stop(loadingId));
              });
          });
      });
  };

  shareLink(): string {
    const link = this.activityShareLink; //location.href;
    const subject = this.translate.instant(
      'profile.texts.shareActivity.subject'
    );
    const body = this.translate.instant('profile.texts.shareActivity.body', {
      activity: this.formStepOne?.get('name')?.value,
      link: link
    });
    return `mailto:?subject=${subject}&body=${body}`;
  }

  isActiveStep(idx: number) {
    return this.stepper ? this.stepper.selectedIndex === idx : false;
  }
}
