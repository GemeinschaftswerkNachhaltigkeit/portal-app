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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LandingpageService } from 'src/app/shared/services/landingpage.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ImageType } from '../../../shared/models/image-type';
import {
  ContactControlsComponent,
  defaultContactGroupFields
} from 'src/app/shared/components/form/contact-controls/contact-controls.component';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';

import { UploadImageComponent } from 'src/app/shared/components/form/upload-image/upload-image.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ContactControlsComponent,
    UploadImageComponent,
    TranslateModule
],
  template: `
    <form [formGroup]="userFormGroup">
      <app-contact-controls formGroupName="contact"></app-contact-controls>
      @if (data && data.randomUniqueId && orgId === null && isActiveStep) {
        <div
          >
          <app-upload-image
            [config]="dzService.getImageConfig('contact', data.randomUniqueId)"
            [aspectRatio]="dzService.getAspectRatio('contact')"
            [labelTranslationKey]="'forms.labels.profileImage'"
            [disabled]="userFormGroup.disabled"
            [fileId]="data.contact?.image"
            style="width: 200px"
            [errorMsg]="'error.unknown' | translate"
          [info]="
            ('sign-up.upload.tooltip' | translate) +
            ', ' +
            ('sign-up.upload.logoWidthTooltipExt' | translate)
          "
            (delete)="deleteHandler(imageType.CONTACT)"
          ></app-upload-image>
        </div>
      }
      @if (data && data.randomUniqueId && orgId !== null) {
        <div>
          <app-upload-image
          [config]="
            dzService.getImageConfig('contact', orgId, data.randomUniqueId)
          "
            [aspectRatio]="dzService.getAspectRatio('contact')"
            [labelTranslationKey]="'forms.labels.profileImage'"
            [disabled]="userFormGroup.disabled"
            [fileId]="data.contact?.image"
            style="width: 200px"
            [errorMsg]="'error.unknown' | translate"
          [info]="
            ('sign-up.upload.tooltip' | translate) +
            ', ' +
            ('sign-up.upload.logoWidthTooltipExt' | translate)
          "
            (delete)="deleteHandler(imageType.CONTACT)"
          ></app-upload-image>
        </div>
      }
    </form>
    `,
  styles: `
    form {
      display: flex;
      flex-direction: column;
      margin: 2em;

      > div {
        // flex-direction: row;
        display: flex;
        gap: 2em;
        > .mat-form-field {
          flex: 1 1 50%;
        }
      }
    }
  `
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
