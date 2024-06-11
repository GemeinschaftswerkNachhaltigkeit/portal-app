import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ImpactArea } from 'src/app/shared/models/impact-area';
import LocationData from 'src/app/shared/models/location-data';
import { GeoCoordinateLookupService } from 'src/app/shared/services/geo-coordinate-lookup.service';

@Component({
  selector: 'app-topics-form',
  templateUrl: './topics-form.component.html',
  styleUrls: ['./topics-form.component.scss']
})
export class TopicsFormComponent implements OnInit, OnDestroy {
  @Input() formGroupName!: string;
  @Input() descriptionPlaceholder = '';
  @Input() isDan = false;
  @Input() markedAsDan = false;
  form!: FormGroup;
  unsubscribe$ = new Subject();
  coordinatesNotFound = false;
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
    const coordinates = await this.geoService.getCoordinates(location);
    this.coordinatesNotFound = !coordinates;
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
