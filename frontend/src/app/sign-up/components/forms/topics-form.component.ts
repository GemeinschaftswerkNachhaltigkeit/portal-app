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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ImpactArea } from '../../../shared/models/impact-area';
import { OrganisationWIP } from '../../../shared/models/organisation-wip';
import { ThematicFocus } from '../../../shared/models/thematic-focus';
import { ActivityWIP } from '../../../shared/models/activity-wip';
import { GeoCoordinateLookupService } from 'src/app/shared/services/geo-coordinate-lookup.service';
import LocationData from 'src/app/shared/models/location-data';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { ThematicFocusControlComponent } from 'src/app/shared/components/form/thematic-focus-control.component';
import { ValidCheckComponent } from 'src/app/shared/components/form/valid-check.component';
import { AlertComponent } from 'src/app/shared/components/base/alert.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';

@Component({
  selector: 'app-topics-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatSelectModule,
    FormFieldErrorComponent,
    ThematicFocusControlComponent,
    ValidCheckComponent,
    AlertComponent,
    SpinnerComponent
],
  template: `<form [formGroup]="topicsFormGroup">
      <mat-form-field appearance="outline">
        <mat-label>{{
          'forms.labels.sustainableDevelopmentGoals' | translate
        }}</mat-label>
        <mat-select formControlName="sustainableDevelopmentGoals" multiple>
          @for (goalNo of sdgOptions; track goalNo) {
            <mat-option [value]="goalNo">
              {{ goalNo }} {{ 'SDGS.goal_' + goalNo | translate }}
            </mat-option>
          }
        </mat-select>
        <mat-error>
          <app-form-field-error
            [field]="topicsFormGroup.get('sustainableDevelopmentGoals')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>
    
      <app-thematic-focus-control
        controlName="thematicFocus"
        [label]="'forms.labels.thematicFocus' | translate"
      ></app-thematic-focus-control>
      <mat-form-field appearance="outline">
        <mat-label>{{ 'forms.labels.impactArea' | translate }}</mat-label>
        <mat-select formControlName="impactArea">
          @for (impactArea of impactAreaOpts; track impactArea) {
            <mat-option
              [value]="impactArea"
              >
              {{ 'impactArea.' + impactArea | translate }}
            </mat-option>
          }
        </mat-select>
        <mat-error>
          <app-form-field-error
            [field]="topicsFormGroup.get('impactArea')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>
    
      <div class="fields">
        <div class="field">
          @if (isAddressNameVisible) {
            <mat-form-field>
              <mat-label>{{ 'forms.labels.addressName' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'forms.labels.addressName' | translate"
                formControlName="name"
                />
              <app-valid-check
                [form]="topicsFormGroup"
                controlName="name"
              ></app-valid-check>
              <mat-error>
                <app-form-field-error
                  [field]="topicsFormGroup.get('name')"
                ></app-form-field-error>
              </mat-error>
            </mat-form-field>
          }
          <div class="address-row-1">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'forms.labels.street' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'forms.labels.street' | translate"
                formControlName="street"
                />
    
              <app-valid-check
                [form]="topicsFormGroup"
                controlName="street"
              ></app-valid-check>
    
              <mat-error>
                <app-form-field-error
                  [field]="topicsFormGroup.get('street')"
                ></app-form-field-error>
              </mat-error>
            </mat-form-field>
    
            <mat-form-field appearance="outline">
              <mat-label>{{ 'forms.labels.streetNo' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'forms.labels.streetNo' | translate"
                formControlName="streetNo"
                />
    
              <app-valid-check
                [form]="topicsFormGroup"
                controlName="streetNo"
              ></app-valid-check>
    
              <mat-error>
                <app-form-field-error
                  [field]="topicsFormGroup.get('streetNo')"
                ></app-form-field-error>
              </mat-error>
            </mat-form-field>
    
            <mat-form-field appearance="outline">
              <mat-label>{{ 'forms.labels.supplement' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'forms.labels.supplement' | translate"
                formControlName="supplement"
                />
    
              <app-valid-check
                [form]="topicsFormGroup"
                controlName="supplement"
              ></app-valid-check>
    
              <mat-error>
                <app-form-field-error
                  [field]="topicsFormGroup.get('supplement')"
                ></app-form-field-error>
              </mat-error>
            </mat-form-field>
          </div>
    
          <div class="address-row-2">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'forms.labels.zipCode' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'forms.labels.zipCode' | translate"
                formControlName="zipCode"
                />
    
              <app-valid-check
                [form]="topicsFormGroup"
                controlName="zipCode"
              ></app-valid-check>
    
              <mat-error>
                <app-form-field-error
                  [field]="topicsFormGroup.get('zipCode')"
                ></app-form-field-error>
              </mat-error>
            </mat-form-field>
    
            <mat-form-field appearance="outline">
              <mat-label>{{ 'forms.labels.city' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'forms.labels.city' | translate"
                formControlName="city"
                />
    
              <app-valid-check
                [form]="topicsFormGroup"
                controlName="city"
              ></app-valid-check>
    
              <mat-error>
                <app-form-field-error
                  [field]="topicsFormGroup.get('city')"
                ></app-form-field-error>
              </mat-error>
            </mat-form-field>
    
            <mat-form-field appearance="outline">
              <mat-label>{{ 'forms.labels.country' | translate }}</mat-label>
              <input
                matInput
                [placeholder]="'forms.labels.country' | translate"
                formControlName="country"
                />
    
              <app-valid-check
                [form]="topicsFormGroup"
                controlName="country"
              ></app-valid-check>
    
              <mat-error>
                <app-form-field-error
                  [field]="topicsFormGroup.get('country')"
                ></app-form-field-error>
              </mat-error>
            </mat-form-field>
          </div>
        </div>
      </div>
    
      @if (
        !(
        isLocationRequired === false && !!topicsFormGroup.get('online')?.value
        )
        ) {
        <div
          class="error-wrapper"
          >
          @if (coordinatesNotFound && anyAddressFieldIsDirty()) {
            <app-alert
              [title]="'validationErrors.coordinatesNotFoundTitle' | translate"
              [showIcon]="true"
              bgIcon="travel_explore"
              fgIcon="priority_high"
              >
              {{ 'validationErrors.coordinatesNotFound' | translate }}
            </app-alert>
          }
          @if (!coordinatesNotFound) {
            <app-spinner
              forId="load-coords"
              [noPadding]="true"
              [small]="true"
            ></app-spinner>
          }
        </div>
      }
    </form>`,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    form {
      display: flex;
      flex-direction: column;
      margin: 2em;
    }

    .fields {
      display: grid;
      gap: $spacing-8;
    }

    .field {
      position: relative;
    }

    .radio-options {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-4;
    }

    .address-row-1,
    .address-row-2 {
      display: flex;
      flex-direction: column;
      gap: $spacing-2;

      .mat-form-field {
        flex: 1 0 20%;
      }

      .mat-form-field:last-child {
        flex: 0 0 20%;
      }
    }

    .address-row-1 {
      .mat-form-field:first-child {
        flex: 0 0 40%;
      }

      .mat-form-field:last-child {
        flex: 0 0 35%;
      }
    }

    .address-row-2 {
      .mat-form-field:first-child {
        flex: 0 0 20%;
      }
    }

    .coordinates-error {
      display: grid;
      grid-template-columns: 7.2rem 1fr;
      gap: $spacing-4;
      padding: $spacing-2;
      border: 2px solid $bordeauxe;
      margin-bottom: 200px;
      .msg {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: $spacing-1;

        .title {
          color: $bordeauxe;
          font-weight: bold;
        }
      }
    }

    .online-checkbox-long {
      display: none;
    }

    @media screen and (min-width: 600px) {
      .address-row-1,
      .address-row-2 {
        flex-direction: row;
      }

      .online-checkbox-long {
        display: block;
      }
      .online-checkbox-short {
        display: none;
      }
    }
  `
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
