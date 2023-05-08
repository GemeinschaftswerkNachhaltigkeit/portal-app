/*  eslint-disable @typescript-eslint/no-non-null-assertion */
/*  eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ImageType } from '../../../shared/models/image-type';
import { defaultContactGroupFields } from 'src/app/shared/components/form/contact-controls/contact-controls.component';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnChanges, OnDestroy {
  imageType = ImageType;
  userFormGroup: FormGroup;
  formChangesSub: Subscription;

  @Input() data: OrganisationWIP | ActivityWIP | null = null;
  @Input() enableAutosave = true;
  @Input() isEditAllowed = true;
  @Input() orgId: string | null = null;
  @Input() isActiveStep = false;
  @Output() saveData = new EventEmitter<OrganisationWIP | ActivityWIP>();
  @Output() deleteImage = new EventEmitter<ImageType>();

  constructor(
    private _formBuilder: FormBuilder,
    public dzService: DropzoneService,
    public lpService: LandingpageService,
    private authService: AuthService
  ) {
    this.userFormGroup = this._formBuilder.group({
      contact: this._formBuilder.group(defaultContactGroupFields)
    });

    this.formChangesSub = this.userFormGroup.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((values) => {
        this.saveFormData(values);
      });
  }

  deleteHandler(image: ImageType): void {
    this.deleteImage.emit(image);
  }

  updateForm() {
    const contactData = {
      contact: {
        email: this.data?.contact?.email || this.authService.getEmail() || '',
        firstName:
          this.data?.contact?.firstName ||
          this.authService.getFirstName() ||
          '',
        lastName:
          this.data?.contact?.lastName || this.authService.getLastName() || '',
        position: this.data?.contact?.position || '',
        phone: this.data?.contact?.phone || ''
      }
    };

    this.userFormGroup.patchValue(contactData);
    this.userFormGroup.markAllAsTouched();
    this.saveData.emit({
      contact: { ...this.userFormGroup.getRawValue() }
    });

    this.userFormGroup.updateValueAndValidity();

    if (this.isEditAllowed === false) {
      this.userFormGroup.disable();
    } else {
      this.userFormGroup.enable();
    }
  }

  saveFormData(formVals: {
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    phone: string;
    privacyConsent: boolean;
  }) {
    if (
      this.data?.randomUniqueId &&
      this.userFormGroup.valid &&
      this.enableAutosave === true
    ) {
      this.saveData.emit(formVals);
    }
  }

  ngOnDestroy() {
    this.formChangesSub.unsubscribe();
  }

  ngOnChanges(changes: any) {
    if (this.enableAutosave === false) {
      this.formChangesSub.unsubscribe();
    }
    if (changes.data?.firstChange) {
      this.updateForm();
    }
  }
}
