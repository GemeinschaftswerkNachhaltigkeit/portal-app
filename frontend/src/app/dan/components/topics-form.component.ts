
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AlertComponent } from 'src/app/shared/components/base/alert.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { AddressControlsComponent } from 'src/app/shared/components/form/address-control/address-controls.component';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { ThematicFocusControlComponent } from 'src/app/shared/components/form/thematic-focus-control.component';
import { ImpactArea } from 'src/app/shared/models/impact-area';
import LocationData from 'src/app/shared/models/location-data';
import { GeoCoordinateLookupService } from 'src/app/shared/services/geo-coordinate-lookup.service';

@Component({
  selector: 'app-topics-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormFieldErrorComponent,
    ThematicFocusControlComponent,
    MatSelectModule,
    MatRadioModule,
    AddressControlsComponent,
    AlertComponent,
    SpinnerComponent,
    TranslateModule
],
  template: `
    <ng-container [formGroup]="form">
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
            [field]="form.get('sustainableDevelopmentGoals')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>
    
      <app-thematic-focus-control
        controlName="thematicFocus"
        [maxSelectable]="3"
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
            [field]="form.get('impactArea')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>
    
      <div class="fields">
        <div class="field">
          <mat-radio-group
            aria-label="Select an option"
            formControlName="location"
            >
            <div class="radio-options">
              <mat-radio-button value="ADDRESS">
                {{ 'forms.labels.onSite' | translate }}</mat-radio-button
                >
                <mat-radio-button value="ONLINE">
                  {{ 'forms.labels.onlineLong' | translate }}</mat-radio-button
                  >
                  <mat-radio-button value="PRIVATE">
                    {{ 'forms.labels.private' | translate }}</mat-radio-button
                    >
                  </div>
                </mat-radio-group>
              </div>
              <div class="field">
                <app-address-controls
                  [withNameField]="true"
                  [nameFieldLabel]="'forms.labels.addressNameDan' | translate"
                  formGroupName="address"
                ></app-address-controls>
              </div>
            </div>
            @if (form.get('location')?.value === 'ADDRESS') {
              <div
                class="error-wrapper"
                >
                @if (coordinatesNotFound === 'NOT_FOUND') {
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
          </ng-container>
    `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .fields {
      display: grid;
      gap: $spacing-8;
    }

    .field {
      position: relative;
    }

    .image-upload {
      position: relative;
      top: -18px;
    }

    .char-count {
      position: absolute;
      bottom: -0rem;
      right: 1rem;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
    }

    .radio-options {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-4;
    }

    .error-wrapper {
      margin: $spacing-4 0;
    }
  `
})
export class TopicsFormComponent implements OnInit, OnDestroy {
  @Input() formGroupName!: string;
  @Input() descriptionPlaceholder = '';
  form!: FormGroup;
  unsubscribe$ = new Subject();
  coordinatesNotFound: 'NOT_FOUND' | 'FOUND' | undefined = undefined;
  sdgOptions = Array.from({ length: 17 }, (_, i) => i + 1);
  impactAreaOpts = Object.values(ImpactArea);

  constructor(
    private rootFormGroup: FormGroupDirective,
    private geoService: GeoCoordinateLookupService
  ) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.handleAddressState();
    this.checkLocation();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  anyAddressFieldIsDirty(): boolean {
    return !!(
      this.form.get('address.street')?.dirty ||
      this.form.get('address.streetNo')?.dirty ||
      this.form.get('address.supplement')?.dirty ||
      this.form.get('address.zipCode')?.dirty ||
      this.form.get('address.city')?.dirty ||
      this.form.get('address.country')?.dirty
    );
  }

  async checkLocation(): Promise<void> {
    const formValues = this.form.get('address')?.value;

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
    if (
      location.address?.city &&
      location.address?.street &&
      location.address?.streetNo &&
      location.address?.zipCode
    ) {
      const coordinates = await this.geoService.getCoordinates(location);
      this.coordinatesNotFound = !coordinates ? 'NOT_FOUND' : 'FOUND';
    }
  }

  private handleAddressState(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.checkLocation();
      });
    this.form
      .get('location')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value !== 'ADDRESS') {
          this.form.get('address')?.disable();
        } else {
          this.form.get('address')?.enable();
          this.form.get('address.country')?.disable();
        }
        this.form.updateValueAndValidity();
      });
  }
}
