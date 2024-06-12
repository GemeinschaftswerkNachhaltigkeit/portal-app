import { Component, OnDestroy, OnInit, ViewChild, input } from '@angular/core';
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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
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
import { SocialMediaType } from 'src/app/shared/models/social-media-type';
import { MasterDataFormComponent } from '../../components/master-data-form/master-data-form.component';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';
import { DirectusContentService } from 'src/app/shared/services/directus-content.service';
import { SavedService } from 'src/app/shared/services/saved.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnDestroy, OnInit {
  activityId = input<string>('', { alias: 'activityId' });
  orgId = input<string>('');
  useDanEndpoint = false;
  isDan = false;
  markedAsDan: boolean = false;
  data: ActivityWIP | null = null;
  imageType = ImageType;

  public activityData$ = this.activityService.activityData$;
  public danContent: {
    completed_message?: string;
    period_hint?: string;
  } | null = null;
  public danContent$ = this.directusContentService.danContent$;
  public activityContent$ = this.directusContentService.activityContent$;

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
  inDanPeriod = false;
  danPeriodParams = {
    url: this.lpService.getDanUrl()
  };

  activityShareLink = '';

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;

  endDateValidators: ValidatorFn[] = [];
  danPeriodSub: Subscription;

  constructor(
    private lpService: LandingpageService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private directus: DirectusService,
    private directusContentService: DirectusContentService,
    private loading: LoadingService,
    private translate: TranslateService,
    private geoService: GeoCoordinateLookupService,
    private feedback: FeedbackService,
    private fb: FormBuilder,
    public dzService: DropzoneService,
    private breakpointObserver: BreakpointObserver,
    private savedService: SavedService
  ) {
    this.endDateValidators = [
      Validators.required,
      durationValidator('start', 3, 'months'),
      danPeriodValidator('start')
    ];
    this.directusContentService.getDanTranslations();
    this.directusContentService.getSignUpActivityTranslations();
    this.step1Form = fb.group({
      masterData: fb.group({
        name: fb.control('', [Validators.required]),
        description: fb.control('', [wysiwygContentRequired(100, 1500)]),
        start: fb.control('', [Validators.required]),
        end: fb.control('', [Validators.required]),
        permanent: fb.control(false, []),
        registerUrl: fb.control('', [Validators.maxLength(1000), urlPattern()]),
        isDan: fb.control('EVENT', [])
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
      links: fb.group({
        url: fb.control('', [Validators.maxLength(1000), urlPattern()]),
        FACEBOOK: fb.control('', [Validators.maxLength(1000), urlPattern()]),
        INSTAGRAM: fb.control('', [Validators.maxLength(1000), urlPattern()]),
        TIKTOK: fb.control('', [Validators.maxLength(1000), urlPattern()]),
        LINKEDIN: fb.control('', [Validators.maxLength(1000), urlPattern()]),
        YOUTUBE: fb.control('', [Validators.maxLength(1000), urlPattern()]),
        TWITTER: fb.control('', [Validators.maxLength(1000), urlPattern()])
      })
    });
    this.step4Form = fb.group({
      contact: fb.group({
        firstName: fb.control('', [Validators.required]),
        lastName: fb.control('', [Validators.required]),
        position: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.required, Validators.email]),
        phone: fb.control('', [])
      })
    });
  }

  ngOnInit(): void {
    this.activityService
      .getActivity(this.orgId(), this.activityId(), this.useDanEndpoint)
      .then((activity) => {
        this.isDan = activity?.activityType === ActivityType.DAN;
        this.handleOptionalFields(this.isDan);
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
          this.router.navigate(['/', 'account', 'activities']);
        }
      });

    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 1000px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.updateDateSelect();
    this.handleMarkedAsDan();
    this.checkDanPeriod();

    this.getWizardContent();
    this.translate.onLangChange
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(() => {
        this.getWizardContent();
      });
  }

  private handleOptionalFields(isDan: boolean) {
    const masterData = this.step1Form.get('masterData') as FormGroup;
    const end = masterData?.get('end') as FormControl;
    const start = masterData?.get('start') as FormControl;
    if (isDan) {
      end.setValidators(this.endDateValidators);

      start.updateValueAndValidity();
    } else {
      end.setValidators([Validators.required]);
    }
    end.updateValueAndValidity();
    start.updateValueAndValidity();
    end.markAsTouched();
    start.markAsTouched();
  }

  public async checkDanPeriod() {
    if (this.step1Form) {
      const masterData = this.step1Form.get('masterData') as FormGroup;
      const end = masterData?.get('end') as FormControl;

      this.isDanPeriod();
      this.step1Form?.valueChanges
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe(async () => {
          this.inDanPeriod = await this.isDanPeriod();
          if (!this.inDanPeriod) {
            end.setValidators([Validators.required]);
          }
        });
    }
  }

  private async isDanPeriod() {
    return await this.activityService.isInDanPeriod(
      this.step1Form.get('masterData.start')?.value,
      this.step1Form.get('masterData.end')?.value
    );
  }

  private handleMarkedAsDan(): void {
    if (!this.isDan) {
      if (this.step1Form) {
        this.step1Form
          .get('masterData.isDan')
          ?.valueChanges.pipe(takeUntil(this.$unsubscribe))
          .subscribe((markedAsDan: ActivityType) => {
            this.markedAsDan = markedAsDan === 'DAN';
            this.handleOptionalFields(this.markedAsDan);
            if (this.markedAsDan) {
              this.maybeResetThemeFocus();
            }
          });
      }
    }
  }

  private maybeResetThemeFocus(): void {
    const thematicFocusControl = this.step2Form.get('topics.thematicFocus');
    if (thematicFocusControl?.value.length > 3) {
      thematicFocusControl?.setValue([]);
      thematicFocusControl?.updateValueAndValidity();
    }
  }

  private handleIsPermanent(isPermanent: boolean): void {
    if (!this.isDan) {
      if (isPermanent) {
        this.step1Form.get('masterData.start')?.clearValidators();
        this.step1Form.get('masterData.start')?.setValue('');
        this.step1Form.get('masterData.start')?.disable();
        this.step1Form.get('masterData.end')?.clearValidators();
        this.step1Form.get('masterData.end')?.setValue('');
        this.step1Form.get('masterData.end')?.disable();
        this.step1Form.get('masterData.isDan')?.setValue('EVENT');
      } else {
        this.step1Form
          .get('masterData.start')
          ?.setValidators([Validators.required]);
        this.step1Form.get('masterData.start')?.enable();
        this.step1Form
          .get('masterData.end')
          ?.setValidators([Validators.required]);
        this.step1Form.get('masterData.end')?.enable();
      }
    }
  }

  private updateDateSelect() {
    if (this.step1Form) {
      this.step1Form
        .get('masterData.permanent')
        ?.valueChanges.pipe(takeUntil(this.$unsubscribe))
        .subscribe((isPermanent: boolean) => {
          this.handleIsPermanent(isPermanent);
        });
    }
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
    const step4Values = this.step4Form.value;

    const socialMedia = Object.keys(step3Values.links)
      .filter((key) => {
        return key !== 'url' && !!step3Values.links[key];
      })
      .map((key) => ({
        type: key as SocialMediaType,
        contact: step3Values.links[key]
      }));

    return {
      name: step1Values.masterData.name,
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
        url: step3Values.links.url,
        address: step2Values.topics.address || null,
        online: step2Values.topics.location === 'ONLINE',
        privateLocation: step2Values.topics.location === 'PRIVATE'
      },
      registerUrl: step1Values.masterData.registerUrl,
      socialMediaContacts: socialMedia,
      contact: step4Values.contact,
      specialType: this.isDan ? 'DAN' : step1Values.masterData.isDan
    };
  }

  private patchFormData(data: ActivityWIP): void {
    this.step1Form.patchValue({
      masterData: {
        name: data.name,
        description: data.description,
        start: data.period?.start ? DateTime.fromISO(data.period.start) : null,
        end: data.period?.end ? DateTime.fromISO(data.period.end) : null,
        url: data.location?.url,
        registerUrl: data.registerUrl,
        isDan: this.isDan ? 'DAN' : data.specialType || 'EVENT'
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
      links: {
        url: data.location?.url,
        ...data.socialMediaContacts
      }
    });
    this.step4Form.patchValue({
      contact: {
        ...data.contact,
        firstName: data.contact?.firstName || this.authService.getFirstName(),
        lastName: data.contact?.lastName || this.authService.getLastName(),
        email: data.contact?.email || this.authService.getEmail()
      }
    });
    if (!this.isDan && !this.markedAsDan) {
      this.handleIsPermanent(this.data?.period?.permanent || false);
    }

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
    this.$unsubscribe.next(null);
    this.$unsubscribe.complete;
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
          this.saveActivity(this.getPayload(), 'links');
        }
      });
    this.step4Form.valueChanges
      .pipe(debounceTime(100))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(() => {
        if (this.step4Form.valid && this.enableAutosave) {
          this.saveActivity(this.getPayload(), 'contact');
        }
      });
  }

  deleteHandler(image: ImageType): void {
    this.activityService.deleteImage(
      this.orgId(),
      this.activityId(),
      image,
      true
    );
  }

  isAllowedToEdit() {
    return this.activityService.isAllowedToEditActivityWip();
  }

  backHandler(): void {
    this.router.navigate(['/', 'account', 'activities']);
  }

  async saveActivity(activityWIP: ActivityWIP, stepKey: string) {
    if (
      this.enableAutosave &&
      this.orgId &&
      this.activityId &&
      this.isEditable
    ) {
      try {
        await this.activityService.updateActivity(
          this.orgId(),
          this.activityId(),
          activityWIP,
          stepKey,
          this.useDanEndpoint
        );
        this.savedService.showSaved();
      } catch (error) {
        console.log('Error while saving activity', error);
      }
    }
  }

  submit = (): void => {
    if (this.step1Form.valid && this.step2Form.valid && this.step4Form.valid) {
      const step1Values = this.step1Form.value;
      const loadingId = this.loading.start('publishActivity');
      this.enableAutosave = false;

      this.activityService
        .getActivity(this.orgId(), this.activityId(), this.useDanEndpoint)
        .then((activity) => {
          this.geoService
            .getCoordinates(activity?.location as LocationData)
            .then((coords) => {
              this.activityService
                .updateActivity(
                  this.orgId(),
                  this.activityId(),
                  {
                    location: { ...activity?.location, coordinate: coords },
                    contact: { ...activity?.contact },
                    specialType: this.isDan
                      ? 'DAN'
                      : step1Values.masterData.isDan
                  },
                  'getCoords',
                  this.useDanEndpoint
                )
                .then(() => {
                  this.activityService
                    .publishActivity(
                      this.orgId(),
                      this.activityId(),
                      this.useDanEndpoint
                    )
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
