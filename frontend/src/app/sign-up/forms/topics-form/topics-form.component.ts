/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-prototype-builtins */
/*  eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ImpactArea } from '../../../shared/models/impact-area';
import { OrganisationWIP } from '../../../shared/models/organisation-wip';
import { ThematicFocus } from '../../../shared/models/thematic-focus';
import { ActivityWIP } from '../../../shared/models/activity-wip';
import { GeoCoordinateLookupService } from 'src/app/shared/services/geo-coordinate-lookup.service';
import LocationData from 'src/app/shared/models/location-data';

@Component({
  selector: 'app-topics-form',
  templateUrl: './topics-form.component.html',
  styleUrls: ['./topics-form.component.scss']
})
export class TopicsFormComponent implements OnChanges, OnDestroy {
  topicsFormGroup: FormGroup;
  v = Validators;

  unsubscribe$ = new Subject();

  @Input() data: OrganisationWIP | ActivityWIP | null = null;
  @Input() enableAutosave = true;
  @Input() isEditAllowed = true;
  @Input() isAddressNameVisible = false;
  @Input() isLocationRequired = true;
  @Input() isActiveStep = false;

  @Output() saveData = new EventEmitter<OrganisationWIP | ActivityWIP>();

  sdgOptions = Array.from({ length: 17 }, (_, i) => i + 1);
  impactAreaOpts = Object.values(ImpactArea);
  thematicFocusOpts = Object.values(ThematicFocus);
  coordinatesNotFound = false;

  constructor(
    private _formBuilder: FormBuilder,
    private geoService: GeoCoordinateLookupService
  ) {
    this.topicsFormGroup = this._formBuilder.group({
      sustainableDevelopmentGoals: [[], Validators.required],
      thematicFocus: [[], Validators.required],
      impactArea: ['', Validators.required],
      location: ['ADDRESS'],
      online: [false],
      name: ['', [Validators.maxLength(200)]],
      street: ['', [Validators.required, Validators.maxLength(200)]],
      streetNo: ['', [Validators.required, Validators.maxLength(5)]],
      supplement: ['', [Validators.maxLength(100)]],
      zipCode: ['', [Validators.required, Validators.maxLength(6)]],
      city: ['', [Validators.required, Validators.maxLength(200)]],
      country: [{ value: 'DE', disabled: true }, [Validators.required]]
    });

    this.topicsFormGroup.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((values) => {
        this.checkLocation();
        this.saveFormData(values);
      });

    this.updateFormLocation();
  }

  anyAddressFieldIsDirty(): boolean {
    return !!(
      this.topicsFormGroup.get('street')?.dirty ||
      this.topicsFormGroup.get('streetNo')?.dirty ||
      this.topicsFormGroup.get('supplement')?.dirty ||
      this.topicsFormGroup.get('zipCode')?.dirty ||
      this.topicsFormGroup.get('city')?.dirty ||
      this.topicsFormGroup.get('country')?.dirty
    );
  }

  updateForm() {
    if (this.data) {
      this.topicsFormGroup.patchValue({
        sustainableDevelopmentGoals: this.data.sustainableDevelopmentGoals,
        thematicFocus: this.data.thematicFocus,
        impactArea: this.data.impactArea,
        name: this.data.location?.address?.name,
        location: this.getLocationType(this.data),
        street: this.data.location?.address?.street,
        streetNo: this.data.location?.address?.streetNo,
        supplement: this.data.location?.address?.supplement,
        zipCode: this.data.location?.address?.zipCode,
        city: this.data.location?.address?.city,
        state: this.data.location?.address?.state,
        online: !!this.data.location?.online,
        country: 'DE' //this.data.location?.address?.country
      });
      this.topicsFormGroup.markAllAsTouched();

      if (this.isEditAllowed === false) {
        this.topicsFormGroup.disable();
      } else {
        this.topicsFormGroup.enable();
      }
      this.topicsFormGroup.get('country')?.disable();
      this.handleOnline(this.data.location?.online || false);
    }
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

  saveFormData(formVals: {
    sustainableDevelopmentGoals: number[];
    thematicFocus: string[];
    organisationType: string;
    impactArea: string;
    name: string;
    location: 'ADDRESS' | 'ONLINE';
    street: string;
    streetNo: string;
    supplement: string;
    zipCode: string;
    city: string;
    country: string;
  }) {
    if (
      this.data?.randomUniqueId &&
      this.topicsFormGroup.valid &&
      this.topicsFormGroup.dirty &&
      this.enableAutosave === true
    ) {
      const data = {
        sustainableDevelopmentGoals: formVals.sustainableDevelopmentGoals,
        thematicFocus: formVals.thematicFocus as ThematicFocus[],
        impactArea: formVals.impactArea as ImpactArea,
        location: {
          ...this.data?.location,
          online: formVals.location === 'ONLINE',
          address: {
            name: formVals.name,
            street: formVals.street,
            streetNo: formVals.streetNo,
            supplement: formVals.supplement,
            zipCode: formVals.zipCode,
            city: formVals.city,
            //  state: formVals.state,
            country: 'DE' //formVals.country
          }
        }
      };
      this.saveData.emit(data);
    }
  }

  async checkLocation(): Promise<void> {
    const formValues = this.topicsFormGroup.value;
    const location: LocationData = {
      address: {
        name: formValues.name || '',
        city: formValues.city || '',
        street: formValues.street || '',
        streetNo: formValues.streetNo || '',
        supplement: formValues.supplement || '',
        zipCode: formValues.zipCode || '',
        state: formValues.state || ''
      }
    };
    const coordinates = await this.geoService.getCoordinates(location);
    this.coordinatesNotFound = !coordinates;
  }

  updateFormLocation() {
    this.topicsFormGroup
      .get('location')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((locationValue) => {
        this.handleOnline(locationValue === 'ONLINE');
      });
  }

  private handleOnline(isOnline: boolean): void {
    let online = isOnline;
    if (this.isLocationRequired) {
      online = false;
    }
    const fields = [
      'name',
      'street',
      'streetNo',
      'supplement',
      'zipCode',
      'city'
    ];
    if (online) {
      fields.forEach((key) => {
        const field = this.topicsFormGroup.get(key);
        field?.setValue('');
        field?.disable();
      });
    } else {
      fields.forEach((key) => {
        this.topicsFormGroup.get(key)?.enable();
      });
    }
    this.topicsFormGroup.updateValueAndValidity();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: any) {
    if (this.enableAutosave === false) {
      this.unsubscribe$.next(null);
      this.unsubscribe$.complete();
    }
    if (changes.data?.firstChange) {
      this.updateForm();
    }
  }
}
