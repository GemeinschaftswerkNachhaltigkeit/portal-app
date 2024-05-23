import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  debounceTime,
  map,
  Observable,
  Subject,
  Subscription,
  takeUntil
} from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { environment } from 'src/environments/environment';

import { GeoCoordinateLookupService } from 'src/app/shared/services/geo-coordinate-lookup.service';
import LocationData from 'src/app/shared/models/location-data';
import { MatStepper } from '@angular/material/stepper';
import { StepperOrientation } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import { ImageType } from 'src/app/shared/models/image-type';
import { ActivityService } from 'src/app/shared/services/activity.service';
import { MasterDataFormComponent } from '../../components/master-data-form/master-data-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { urlPattern } from 'src/app/shared/components/validator/url.validator';
import { ActivityType } from 'src/app/shared/models/activity-type';
import { AuthService } from 'src/app/auth/services/auth.service';
import { wysiwygContentRequired } from 'src/app/shared/components/validator/wysiwyg-content-required.validator';
import { FeedbackService } from 'src/app/shared/components/feedback/feedback.service';
import { DirectusService } from 'src/app/shared/services/directus.service';
import { durationValidator } from 'src/app/shared/components/validator/duration.validator';
import { danPeriodValidator } from 'src/app/shared/components/validator/danPeriod.validator';
import { DateTime } from 'luxon';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnDestroy {
  activityId = '';
  orgId = '';
  data: ActivityWIP | null = null;
  imageType = ImageType;
  private paramsSub: Subscription;

  public activityData$ = this.activityService.activityData$;
  public danContent: {
    completed_message?: string;
    period_hint?: string;
  } | null = null;

  public activityStepState$ = this.activityService.activityUpdateStateData$;

  loading$ = this.loading.isLoading$('publishActivity');

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('stepOne') stepOneComponent!: MasterDataFormComponent;
  @ViewChild('stepTwo') stepTwoComponent!: HTMLDivElement;
  @ViewChild('stepThree') stepThreeComponent!: HTMLDivElement;

  $unsubscribe = new Subject();
  stepperOrientation: Observable<StepperOrientation>;
  isEditable = true;
  isModification = false;
  isSubmissionSuccess: boolean | null = null;
  enableAutosave = false;
  disableSubmitBtn = false;
  initialized = false;
  imageTypes = ImageType;

  activityShareLink = '';

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private directus: DirectusService,
    private loading: LoadingService,
    private translate: TranslateService,
    private geoService: GeoCoordinateLookupService,
    private feedback: FeedbackService,
    private fb: FormBuilder,
    public dzService: DropzoneService,
    breakpointObserver: BreakpointObserver
  ) {
    this.step1Form = fb.group({
      masterData: fb.group({
        name: fb.control('', [Validators.required]),
        activityType: fb.control({ disabled: true, value: ActivityType.DAN }, [
          Validators.required
        ]),
        description: fb.control('', [wysiwygContentRequired(100, 1500)]),
        start: fb.control('', [Validators.required]),
        end: fb.control('', [
          Validators.required,
          durationValidator('start', 3, 'months'),
          danPeriodValidator('start')
        ]),
        url: fb.control('', [Validators.maxLength(1000), urlPattern()]),
        registerUrl: fb.control('', [Validators.maxLength(1000), urlPattern()])
      })
    });
    this.step2Form = fb.group({
      topics: fb.group({
        sustainableDevelopmentGoals: fb.control([], [Validators.required]),
        thematicFocus: fb.control([], [Validators.required]),
        impactArea: [''],
        location: fb.control<string>('ADDRESS'),
        address: fb.group({
          name: ['', [Validators.maxLength(200)]],
          street: ['', [Validators.required, Validators.maxLength(200)]],
          streetNo: ['', [Validators.required, Validators.maxLength(5)]],
          supplement: ['', [Validators.maxLength(100)]],
          zipCode: ['', [Validators.required, Validators.maxLength(6)]],
          city: ['', [Validators.required, Validators.maxLength(200)]],
          country: [{ value: 'DE', disabled: true }, [Validators.required]]
        })
      })
    });
    this.step3Form = fb.group({
      contact: fb.group({
        firstName: fb.control('', [Validators.required]),
        lastName: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.required, Validators.email]),
        phone: fb.control('', [])
      })
    });

    this.paramsSub = this.route.params.subscribe((params) => {
      this.activityId = params['activityId'];
      this.orgId = params['orgId'];
      if (this.activityId && this.orgId) {
        this.activityService
          .getActivity(this.orgId, this.activityId, true)
          .then((activity) => {
            if (activity) {
              this.isModification =
                this.route.snapshot.queryParams['edit'] === 'true';
              this.patchFormData(activity);
              this.trackFromChanges();
              this.data = activity;
            } else {
              this.feedback.showFeedback(
                this.translate.instant('error.unknown'),
                'error'
              );
              this.router.navigate(['/', 'account', 'dan-activities']);
            }
          });
      }
    });

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 1000px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.getWizardContent();
    this.translate.onLangChange
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(() => {
        this.getWizardContent();
      });
  }

  private async getWizardContent() {
    try {
      this.danContent = await this.directus.getContentItemForCurrentLang<{
        completed_message: string;
        period_hint: string;
      }>('dan_wizard_translations');
    } catch (error) {
      this.danContent = null;
    }
  }

  private getPayload(): ActivityWIP {
    const step1Values = this.step1Form.value;
    const step2Values = this.step2Form.value;
    const step3Values = this.step3Form.value;

    return {
      name: step1Values.masterData.name,
      activityType: step1Values.masterData.activityType,
      description: step1Values.masterData.description,
      period: {
        start: step1Values.masterData.start,
        end: step1Values.masterData.end
      },
      sustainableDevelopmentGoals:
        step2Values.topics.sustainableDevelopmentGoals,
      thematicFocus: step2Values.topics.thematicFocus,
      impactArea: step2Values.topics.impactArea,
      location: {
        url: step1Values.masterData.url,
        address: step2Values.topics.address || null,
        online: step2Values.topics.location === 'ONLINE',
        privateLocation: step2Values.topics.location === 'PRIVATE'
      },
      contact: step3Values.contact,
      registerUrl: step1Values.masterData.registerUrl
    };
  }

  private patchFormData(data: ActivityWIP): void {
    this.step1Form.patchValue({
      masterData: {
        name: data.name,
        activityType: ActivityType.DAN,
        description: data.description,
        start: data.period?.start ? DateTime.fromISO(data.period.start) : null,
        end: data.period?.end ? DateTime.fromISO(data.period.end) : null,
        url: data.location?.url,
        registerUrl: data.registerUrl
      }
    });
    this.step2Form.patchValue({
      topics: {
        sustainableDevelopmentGoals: data.sustainableDevelopmentGoals,
        thematicFocus: data.thematicFocus,
        impactArea: data.impactArea,
        location: this.getLocationType(data),
        address: data.location?.address
      }
    });
    this.step3Form.patchValue({
      contact: {
        ...data.contact,
        firstName: data.contact?.firstName || this.authService.getFirstName(),
        lastName: data.contact?.lastName || this.authService.getLastName(),
        email: data.contact?.email || this.authService.getEmail()
      }
    });
    if (this.getLocationType(data) !== 'ADDRESS') {
      this.step2Form.get('topics.address')?.disable();
    }
    this.enableAutosave = true;
  }

  private getLocationType(data: ActivityWIP): string {
    if (data.location?.online) {
      return 'ONLINE';
    }
    if (data.location?.privateLocation) {
      return 'PRIVATE';
    }
    return 'ADDRESS';
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

  private trackFromChanges(): void {
    this.step1Form.valueChanges
      .pipe(debounceTime(100))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(() => {
        if (this.step1Form.valid && this.enableAutosave) {
          this.saveActivity(this.getPayload(), 'master-data');
        }
      });
    this.step2Form.valueChanges
      .pipe(debounceTime(100))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(() => {
        if (this.step2Form.valid && this.enableAutosave) {
          this.saveActivity(this.getPayload(), 'topics');
        }
      });
    this.step3Form.valueChanges
      .pipe(debounceTime(100))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(() => {
        if (this.step3Form.valid && this.enableAutosave) {
          this.saveActivity(this.getPayload(), 'contact');
        }
      });
  }

  deleteHandler(image: ImageType): void {
    this.activityService.deleteImage(this.orgId, this.activityId, image, true);
  }

  isAllowedToEdit() {
    return this.activityService.isAllowedToEditActivityWip();
  }

  backToDansHandler(): void {
    this.router.navigate(['/', 'account', 'dan-activities']);
  }

  saveActivity(activityWIP: ActivityWIP, stepKey: string) {
    console.log('save');
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
        stepKey,
        true
      );
    }
  }

  submit = (): void => {
    if (this.step1Form.valid && this.step2Form.valid && this.step3Form.valid) {
      const loadingId = this.loading.start('publishActivity');
      this.enableAutosave = false;

      this.activityService
        .getActivity(this.orgId, this.activityId, true)
        .then((activity) => {
          this.geoService
            .getCoordinates(activity?.location as LocationData)
            .then((coords) => {
              this.activityService
                .updateActivity(
                  this.orgId,
                  this.activityId,
                  {
                    location: { ...activity?.location, coordinate: coords },
                    contact: { ...activity?.contact }
                  },
                  'getCoords',
                  true
                )
                .then(() => {
                  this.activityService
                    .publishActivity(this.orgId, this.activityId, true)
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
    }
  };

  shareLink(): string {
    const link = this.activityShareLink; //location.href;
    const subject = this.translate.instant(
      'profile.texts.shareActivity.subject'
    );
    const body = this.translate.instant('profile.texts.shareActivity.body', {
      activity: this.step1Form.get('masterData.name')?.value || '',
      link: link
    });
    return `mailto:?subject=${subject}&body=${body}`;
  }

  isActiveStep(idx: number) {
    return this.stepper ? this.stepper.selectedIndex === idx : false;
  }
}
