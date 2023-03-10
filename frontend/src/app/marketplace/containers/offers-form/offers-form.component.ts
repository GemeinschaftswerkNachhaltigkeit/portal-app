import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { defaultContactGroupFields } from 'src/app/shared/form/contact-controls/contact-controls.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { urlPattern } from 'src/app/shared/validator/url.validator';
import { wysiwygContentRequired } from 'src/app/shared/validator/wysiwyg-content-required.validator';
import { OfferCategories } from '../../models/offer-categories';
import { OfferWipDto } from '../../models/offer-wip-dto';
import { OffersFacadeService } from '../../offers-facade.service';

@Component({
  selector: 'app-offers-form',
  templateUrl: './offers-form.component.html',
  styleUrls: ['./offers-form.component.scss']
})
export class OffersFormComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: NgForm;

  categories = Object.keys(OfferCategories).map((key) => ({
    key,
    label: `marketplace.labels.${key}`
  }));

  formGroup: FormGroup;
  unsubscribe$ = new Subject();
  debounce$ = new Subject();
  loading$ = this.loader.isLoading$('offer-loading');
  offersWip$ = this.offersFacade.offersWip$;
  tokenRefresh$ = this.offersFacade.tokenRefresh$;
  orgId: number | null = null;
  uuid: string | null = null;
  token = this.offersFacade.token;
  image = '';

  constructor(
    fb: FormBuilder,
    private offersFacade: OffersFacadeService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: LoadingService,
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
        url: fb.control<string>('', [Validators.maxLength(1000), urlPattern()])
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
      contact: fb.group(defaultContactGroupFields)
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
    this.tokenRefresh$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.token = this.offersFacade.token;
    });
    this.handleAddressState();
    this.handleSaveOnChange();
    this.handleIntialValues();
    this.loadExistingOfferWip();
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
      thematicFocus: values.thematicFocus
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
        url: wipDto.location?.url
      },
      contact: wipDto.contact
    };
    this.image = wipDto.image || '';
    this.formGroup.patchValue(formData);

    if (this.formGroup.invalid && this.form?.submitted) {
      this.formGroup.markAllAsTouched();
    }
  }
}
