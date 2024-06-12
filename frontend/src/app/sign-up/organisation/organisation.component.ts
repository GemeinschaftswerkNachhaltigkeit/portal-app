/*  eslint-disable @typescript-eslint/no-non-null-assertion */
/*  eslint-disable  @typescript-eslint/no-unused-vars */

import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription, timeout } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import LocationData from 'src/app/shared/models/location-data';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { GeoCoordinateLookupService } from 'src/app/shared/services/geo-coordinate-lookup.service';
import { ExternalLinksFormComponent } from '../forms/external-links-form/external-links-form.component';
import { OrganisationFormComponent } from '../forms/organisation-form/organisation-form.component';
import { TopicsFormComponent } from '../forms/topics-form/topics-form.component';
import { UserFormComponent } from '../forms/user-form/user-form.component';
import { DirectusContentService } from '../../shared/services/directus-content.service';
import { OrganisationService } from '../services/organisation.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { OrganisationStatus } from 'src/app/shared/models/organisation-status';
import { MatStepper } from '@angular/material/stepper';
import { Point } from 'geojson';
import { UserPermission } from 'src/app/auth/models/user-role';
import { ImageType } from '../../shared/models/image-type';
import {
  StepperOrientation,
  STEPPER_GLOBAL_OPTIONS
} from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class OrganisationComponent implements OnInit, OnDestroy {
  orgId = '';
  nextUrl = '';
  private paramsSub: Subscription | null = null;

  public orgData$ = this.orgService.orgData$;
  public orgContent$ = this.directusContentService.orgContent$;
  public orgStepState$ = this.orgService.orgUpdateStateData$;

  loading$ = this.loading.isLoading$('submitForApproval');

  @ViewChild('stepper') stepper!: MatStepper;

  @ViewChild('stepOne') stepOneComponent!: OrganisationFormComponent;
  @ViewChild('stepTwo') stepTwoComponent!: TopicsFormComponent;
  @ViewChild('stepThree') stepThreeComponent!: ExternalLinksFormComponent;
  @ViewChild('stepFour') stepFourComponent!: UserFormComponent;

  stepperOrientation: Observable<StepperOrientation>;
  isEditable = true;
  linarMode = true;
  isSubmissionSuccess: boolean | null = null;
  enableAutosave = false;
  disableSubmitBtn = false;
  isModification = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orgService: OrganisationService,
    private changeDetectorRef: ChangeDetectorRef,
    private geoService: GeoCoordinateLookupService,
    private directusContentService: DirectusContentService,
    private authService: AuthService,
    private loading: LoadingService,
    breakpointObserver: BreakpointObserver
  ) {
    this.changeDetectorRef.detach();
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 1000px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe((params) => {
      this.orgId = params['organisationId'];
      this.nextUrl = this.route.snapshot.queryParams['next'];
      if (this.orgId) {
        this.orgService
          .getOrganisation(this.orgId)
          .then((org) => {
            this.isModification = !this.orgService.isNotOrgModification(
              org?.status
            );

            if (
              this.orgService.isNotOrgModification(org?.status) &&
              !this.orgService.isAllowedToCreateOrg(org?.id)
            ) {
              this.router.navigate(['/', 'error'], {
                queryParams: {
                  error: 'userAlreadyAssigendToOrg'
                }
              });
            }
            if (!org) {
              this.router.navigate(['/', 'error'], {
                queryParams: {
                  error: 'organisationWipNotFound'
                }
              });
            }
            this.enableAutosave = true;
            if (
              org?.status === OrganisationStatus.PRIVACY_CONSENT_REQUIRED ||
              org?.status ===
                OrganisationStatus.FREIGABE_VERWEIGERT_KONTAKT_INITIATIVE
            ) {
              this.router.navigate(['sign-up/import/' + this.orgId]);
            }
            if (
              org?.status ===
                OrganisationStatus.FREIGABE_KONTAKT_ORGANISATION &&
              !this.isAdmin()
            ) {
              this.isEditable = true;
              this.linarMode = false;
              this.enableAutosave = false;
              this.disableSubmitBtn = true;
            }
          })
          .then(() => {
            this.changeDetectorRef.reattach();
            this.changeDetectorRef.detectChanges();
          });
      }
    });
    this.directusContentService.getSignUpOrganisationtTranslations();
  }

  isAdmin(): boolean {
    return this.orgService.isRneAdmin();
  }

  ngOnDestroy() {
    this.paramsSub?.unsubscribe();
  }

  get formStepOne() {
    return this.stepOneComponent
      ? this.stepOneComponent.organisationFormGroup
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

  backToProile(): void {
    this.router.navigate(['/', 'account', 'my-organisation']);
  }

  leaveWizard() {
    if (this.isAdmin()) {
      this.router.navigate(['/clearing']);
    } else {
      this.router.navigate(['/account']);
    }
  }

  isAllowedToEdit(org: OrganisationWIP | null) {
    return this.orgService.isAllowedToEditOrgWip(org);
  }

  deleteHandler(image: ImageType): void {
    this.orgService.deleteImage(this.orgId, image);
  }

  async saveOrg(org: OrganisationWIP, stepKey: string) {
    if (this.orgId && this.enableAutosave) {
      if (stepKey === 'topics') {
        try {
          const updatedOrg = await this.addCoordinates(org);
          this.orgService.updateOrganisation(this.orgId, updatedOrg, stepKey);
        } catch (error) {
          console.error('Error during update of organisation (topics step)');
        }
      } else {
        this.orgService.updateOrganisation(this.orgId, org, stepKey);
      }
    }
  }

  private async loadCoords(orga?: OrganisationWIP): Promise<Point | undefined> {
    try {
      this.loading.start('load-coords');
      const coords = await this.geoService.getCoordinates(
        orga?.location as LocationData
      );
      this.loading.stop('load-coords');
      return coords;
    } catch (e) {
      this.loading.stop('load-coords');
      return undefined;
    }
  }

  private async addCoordinates(
    orga: OrganisationWIP
  ): Promise<OrganisationWIP> {
    const coordinate = await this.loadCoords(orga);
    return {
      ...orga,
      location: this.updateLocation(orga.location, coordinate)
    };
  }

  private updateLocation(
    location?: LocationData,
    newCoords?: Point
  ): LocationData | undefined {
    return (
      location && {
        ...location,
        coordinate: newCoords ? newCoords : null
      }
    );
  }

  private handleAdminRouting(): void {
    if (this.nextUrl) {
      this.router.navigate([this.nextUrl]);
    } else {
      this.router.navigate(['administration/organisations']);
    }
  }

  submitForApproval = (): void => {
    const loadingId = this.loading.start('submitForApproval');
    this.enableAutosave = false;
    this.orgService.getOrganisation(this.orgId!).then((org) => {
      this.loadCoords(org).then((coords) => {
        console.debug('ADD COORDS', coords);
        this.orgService
          .updateOrganisation(
            this.orgId!,
            {
              location: this.updateLocation(org?.location, coords),
              contact: { ...org?.contact }
            },
            'getCoords'
          )
          .then(() => {
            if (
              org?.status === OrganisationStatus.AKTUALISIERUNG_ORGANISATION
            ) {
              this.orgService
                .publishOrganisationUpdate(this.orgId!)
                .then((resp) => {
                  if (resp) {
                    const user = this.authService.getUser();
                    const isAdmin =
                      user &&
                      this.authService.hasAnyPermission(user, [
                        UserPermission.RNE_ADMIN
                      ]);
                    if (isAdmin) {
                      this.handleAdminRouting();
                    } else {
                      this.router.navigate(
                        ['/', 'account', 'my-organisation'],
                        {
                          queryParams: { update: 'success' }
                        }
                      );
                    }
                  } else {
                    this.isEditable = true;
                    this.isSubmissionSuccess = false;
                  }
                })
                .finally(() => this.loading.stop(loadingId));
            } else {
              this.orgService
                .submitForApproval(this.orgId!)
                .then((resp) => {
                  if (resp) {
                    if (this.isAdmin()) {
                      this.handleAdminRouting();
                    } else {
                      this.router.navigate([
                        'sign-up/organisation/' + this.orgId + '/success'
                      ]);
                    }
                  } else {
                    this.isEditable = true;
                    this.isSubmissionSuccess = false;
                  }
                })
                .finally(() => this.loading.stop(loadingId));
            }
          });
      });
    });
  };

  isContactSameAsCurrentUser(org: OrganisationWIP | null) {
    return org?.contact?.email === this.authService.getEmail();
  }

  isActiveStep(idx: number) {
    return this.stepper ? this.stepper.selectedIndex === idx : false;
  }
}
