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
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { ValidCheckComponent } from 'src/app/shared/components/form/valid-check.component';
import { urlPattern } from 'src/app/shared/components/validator/url.validator';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { SocialMediaContact } from 'src/app/shared/models/social-media-contact';
import { SocialMediaType } from 'src/app/shared/models/social-media-type';

@Component({
  selector: 'app-external-links-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ValidCheckComponent,
    FormFieldErrorComponent,
    TranslateModule
  ],
  template: `
    <form [formGroup]="linksFormGroup">
      <mat-form-field appearance="outline">
        <mat-label>{{ 'forms.labels.url' | translate }}</mat-label>
        <input
          matInput
          [placeholder]="'forms.labels.url' | translate"
          formControlName="url"
        />
        <app-valid-check
          [form]="linksFormGroup"
          controlName="url"
        ></app-valid-check>
        <mat-error>
          <app-form-field-error
            [field]="linksFormGroup.get('url')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>

      @for (type of socialMediaTypes; track type) {
        <mat-form-field appearance="outline">
          <mat-label>{{ 'forms.labels.' + type | translate }}</mat-label>
          <input
            matInput
            [placeholder]="'forms.labels.' + type | translate"
            [formControlName]="type"
          />
          <app-valid-check
            [form]="linksFormGroup"
            [controlName]="type"
          ></app-valid-check>
          <mat-error>
            <app-form-field-error
              [field]="linksFormGroup.get(type)"
            ></app-form-field-error>
          </mat-error>
        </mat-form-field>
      }
    </form>
  `,
  styles: `
    form {
      display: flex;
      flex-direction: column;
      margin: 2em;
    }
  `
})
export class ExternalLinksFormComponent implements OnChanges, OnDestroy {
  linksFormGroup: FormGroup;

  formChangesSub: Subscription;

  @Input() data: OrganisationWIP | ActivityWIP | null = null;
  @Input() enableAutosave = true;
  @Input() isEditAllowed = true;
  @Input() isActiveStep = false;
  @Output() saveData = new EventEmitter<OrganisationWIP | ActivityWIP>();

  socialMediaTypes = Object.values(SocialMediaType);

  constructor(private _formBuilder: FormBuilder) {
    this.linksFormGroup = this._formBuilder.group({
      url: ['', [Validators.maxLength(1000), urlPattern()]]
    });

    this.socialMediaTypes.forEach((type) => {
      this.linksFormGroup.addControl(
        type as string,
        new FormControl('', [Validators.maxLength(1000), urlPattern()])
      );
    });

    this.formChangesSub = this.linksFormGroup.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged() //   switchMap((value: any) => of(value))
      )
      .subscribe((values) => {
        this.saveFormData(values);
      });
  }

  updateForm() {
    if (this.data) {
      this.linksFormGroup.patchValue({
        url: this.data.location?.url
      });
      this.linksFormGroup.markAllAsTouched();

      if (
        this.data.socialMediaContacts &&
        this.data.socialMediaContacts?.length > 0
      ) {
        this.socialMediaTypes.forEach((type) => {
          this.linksFormGroup.patchValue({
            [type]: this.data?.socialMediaContacts?.find(
              (entry) => entry.type === type
            )?.contact
          });
        });
      }

      if (this.isEditAllowed === false) {
        this.linksFormGroup.disable();
      } else {
        this.linksFormGroup.enable();
      }
    }
  }

  saveFormData(formVals: { [x: string]: string; url: string }) {
    const socialMedia: SocialMediaContact[] = [];

    this.socialMediaTypes.forEach((type) => {
      if (this.linksFormGroup.get(type)?.valid && formVals[type]?.length > 0) {
        socialMedia.push({
          type: type,
          contact: formVals[type]
        });
      }
    });

    if (
      this.data &&
      this.data.randomUniqueId &&
      this.linksFormGroup.valid &&
      this.linksFormGroup.dirty &&
      this.enableAutosave === true
    ) {
      this.saveData.emit({
        location: { ...this.data?.location, url: formVals.url },
        socialMediaContacts: socialMedia
      });
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
