import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { UserRole } from 'src/app/auth/models/user-role';
import { AuthService } from 'src/app/auth/services/auth.service';
import { defaultContactGroupFields } from 'src/app/shared/components/form/contact-controls/contact-controls.component';
import { urlPattern } from 'src/app/shared/components/validator/url.validator';
import { wysiwygContentRequired } from 'src/app/shared/components/validator/wysiwyg-content-required.validator';
import { LabeledKey } from 'src/app/shared/models/labeled-key';
import { MimeTypeEnum } from 'src/app/shared/models/mimetype';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from 'src/environments/environment';
import { OfferCategories } from '../../models/offer-categories';
import { OfferWipDto } from '../../models/offer-wip-dto';
import { OffersFacadeService } from '../../offers-facade.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-offers-form',
  templateUrl: './offers-form.component.html',
  styleUrls: ['./offers-form.component.scss']
})
export class OffersFormComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: NgForm;

  formGroup: FormGroup;
  unsubscribe$ = new Subject();
  debounce$ = new Subject();
  loading$ = this.loader.isLoading$('offer-loading');
  offersWip$ = this.offersFacade.offersWip$;
  tokenRefresh$ = this.offersFacade.tokenRefresh$;
  orgId: number | null = null;
  uuid: string | null = null;
  token = this.offersFacade.token;
  isModification = false;
  image = '';

  constructor(
    fb: FormBuilder,
    public dzService: DropzoneService,
    private offersFacade: OffersFacadeService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: LoadingService,
    private auth: AuthService,
    private utils: UtilsService
  ) {
    this.formGroup = fb.group({
      offerCategory: fb.control<string>('JOBS', {
        validators: [Validators.required]
      }),
      thematicFocus: fb.control<string[]>([], [Validators.required]),
      content: fb.group({
        name: fb.control<string>('', [
          Validators.required,
          Validators.maxLength(100)
        ]),
        description: fb.control<string>('', [
          Validators.required,
          wysiwygContentRequired(100, 1500)
        ]),
        url: fb.control<string>('', [Validators.maxLength(1000), urlPattern()]),
        endUntil: fb.control<Date | null>(null)
      }),
      location: fb.control<string>(''),
      address: fb.group({
        name: ['', [Validators.maxLength(200)]],
        street: ['', [Validators.required, Validators.maxLength(200)]],
        streetNo: ['', [Validators.required, Validators.maxLength(5)]],
        supplement: ['', [Validators.maxLength(100)]],
        zipCode: ['', [Validators.required, Validators.maxLength(6)]],
        city: ['', [Validators.required, Validators.maxLength(200)]],
        country: [{ value: 'DE', disabled: true }, [Validators.required]]
      }),
      contact: fb.group(defaultContactGroupFields),
      visibility: fb.group({
        featured: [false],
        featuredText: ['', [Validators.maxLength(255)]]
      })
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {
    const routeParams = this.route.snapshot.params;
    this.orgId = routeParams['orgId'];
    this.uuid = routeParams['uuid'];
    this.isModification = this.route.snapshot.queryParams['edit'] === 'true';
    this.tokenRefresh$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.token = this.offersFacade.token;
    });
    this.handleAddressState();
    this.handleSaveOnChange();
    this.handleIntialValues();
    this.loadExistingOfferWip();
  }

  accessToFeatured(): boolean {
    const user = this.auth.getUser();
    return !!user && this.auth.hasAnyRole(user, [UserRole.MARKETPLACE_FEATURE]);
  }

  getCategories(): LabeledKey<string>[] {
    const options = Object.keys(OfferCategories).map((key) => ({
      key,
      label: `marketplace.labels.${key}`
    }));
    const user = this.auth.getUser();
    if (user && this.auth.hasAnyRole(user, [UserRole.MARKETPLACE_FEATURE])) {
      return options;
    } else {
      return options.filter((o) => o.key !== 'PROJECT_SUSTAINABILITY');
    }
  }

  getImageUploadConfig(
    orgId: number,
    uuid: string
  ): DropzoneConfigInterface & { disablePreviews: boolean } {
    return {
      clickable: true,
      maxFiles: 1,
      autoReset: 1,
      errorReset: 1,
      cancelReset: null,
      url: `${environment.apiUrl}/${this.getUploadEndpoint(orgId, uuid)}`,
      method: 'put',
      maxFilesize: 1048576,
      disablePreviews: true,
      acceptedFiles: [MimeTypeEnum.Image_Jpeg, MimeTypeEnum.Image_Png].join(
        ','
      ),
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    };
  }

  getUploadEndpoint(orgId: number, uuid: string): string {
    return `organisations/${orgId}/marketplace-wip/offer/${uuid}/image`;
  }

  handleDelteImage(): void {
    if (this.orgId && this.uuid) {
      this.offersFacade.deleteImage(this.orgId, this.uuid);
    }
  }

  handleSave(): void {
    if (this.orgId && this.uuid && this.form.dirty) {
      this.offersFacade.saveOffersWip(this.orgId, this.uuid, this.getPayload());
    }
  }

  handleSubmit(): void {
    if (this.formGroup.invalid && this.form?.submitted) {
      this.formGroup.markAllAsTouched();
    } else {
      if (this.orgId && this.uuid) {
        this.offersFacade.releaseOffersWip(
          this.orgId,
          this.uuid,
          this.getPayload()
        );
        this.goBackToOfferList();
      }
    }
  }

  handleCancelation(): void {
    this.goBackToOfferList();
  }

  private goBackToOfferList(): void {
    this.router.navigate(['/account/offers']);
  }

  private getPayload(): OfferWipDto {
    const values = this.formGroup.value;
    const isOnline = values.location === 'ONLINE';
    const isAddress = values.location === 'ADDRESS';
    const payload: OfferWipDto = {
      offerCategory: values.offerCategory,
      name: values.content.name || '',
      description: values.content.description || '',
      contact: values.contact,
      location: {
        address: isAddress ? { ...values.address, country: 'DE' } : {},
        online: isOnline,
        url: values.content.url
      },
      thematicFocus: values.thematicFocus,
      featured: values.visibility.featured,
      featuredText: values.visibility.featuredText,
      endUntil: values.content.endUntil
        ? (values.content.endUntil as DateTime).toISO() || ''
        : ''
    };

    return payload;
  }

  private handleAddressState(): void {
    this.formGroup
      .get('location')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value !== 'ADDRESS') {
          this.formGroup.get('address')?.disable();
        } else {
          this.formGroup.get('address')?.enable();
          this.formGroup.get('address.country')?.disable();
        }
        this.formGroup.updateValueAndValidity();
      });
  }

  private handleSaveOnChange(): void {
    this.formGroup.valueChanges
      .pipe(debounceTime(500), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.handleSave();
      });
  }

  private handleIntialValues(): void {
    this.offersWip$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((wipDto: OfferWipDto | null) => {
        if (wipDto) {
          this.initalizeForm(wipDto);
        }
      });
  }

  private loadExistingOfferWip(): void {
    if (this.orgId && this.uuid) {
      this.offersFacade.getOffersWip(this.orgId, this.uuid);
    }
  }

  private initalizeForm(wipDto: OfferWipDto): void {
    let locationType = 'NONE';
    if (wipDto.location?.online) {
      locationType = 'ONLINE';
    } else {
      if (this.utils.noLocation(wipDto?.location)) {
        locationType = 'NONE';
      } else {
        locationType = 'ADDRESS';
      }
    }
    const formData = {
      offerCategory: wipDto.offerCategory || OfferCategories.JOBS,
      thematicFocus: wipDto.thematicFocus,
      address: wipDto.location?.address,
      location: locationType,
      content: {
        name: wipDto.name,
        description: wipDto.description,
        url: wipDto.location?.url,
        endUntil: wipDto.endUntil ? DateTime.fromISO(wipDto.endUntil) : null
      },
      contact: wipDto.contact,
      visibility: {
        featured: wipDto.featured,
        featuredText: wipDto.featuredText
      }
    };
    this.image = wipDto.image || '';
    this.formGroup.patchValue(formData);

    if (this.formGroup.invalid && this.form?.submitted) {
      this.formGroup.markAllAsTouched();
    }
  }
}
