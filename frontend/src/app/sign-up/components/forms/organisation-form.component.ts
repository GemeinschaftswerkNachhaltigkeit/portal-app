/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
/*  eslint-disable  @typescript-eslint/no-explicit-any */

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Editor } from '@tiptap/core';
import { WysiwygService } from 'src/app/shared/services/wysiwyg.service';
import { DirectusService } from 'src/app/shared/services/directus.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ImageType } from '../../../shared/models/image-type';
import { wysiwygContentRequired } from 'src/app/shared/components/validator/wysiwyg-content-required.validator';
import { OrganisationType } from 'src/app/shared/models/organisation-type';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';
import {
  ImageMode,
  UploadImageComponent
} from 'src/app/shared/components/form/upload-image/upload-image.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { MatSelectModule } from '@angular/material/select';
import { ValidCheckComponent } from 'src/app/shared/components/form/valid-check.component';
import { TiptapMenuBarComponent } from 'src/app/shared/components/form/tiptap-menu-bar.component';
import { NgxTiptapModule } from 'ngx-tiptap';
import { CharCountComponent } from 'src/app/shared/components/base/char-count.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-organisation-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormFieldErrorComponent,
    MatSelectModule,
    ValidCheckComponent,
    TiptapMenuBarComponent,
    NgxTiptapModule,
    CharCountComponent,
    UploadImageComponent,
    MatCheckboxModule,
    TranslateModule
],
  template: `
    <form [formGroup]="organisationFormGroup">
      <!--  <p>{{orgId}}</p>
      <ng-template matStepLabel>Fill out your name</ng-template>-->
      <mat-form-field appearance="outline">
        <mat-label>{{ 'forms.labels.organisationName' | translate }}</mat-label>
        <input
          matInput
          [placeholder]="'forms.labels.organisationName' | translate"
          formControlName="name"
          />
    
        <app-valid-check
          [form]="organisationFormGroup"
          controlName="name"
        ></app-valid-check>
    
        <mat-error>
          <app-form-field-error
            [field]="organisationFormGroup.get('name')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>
    
      <mat-form-field appearance="outline">
        <mat-label>{{ 'forms.labels.organisationType' | translate }}</mat-label>
        <mat-select formControlName="organisationType">
          @for (orgType of orgTypeOpts; track orgType) {
            <mat-option [value]="orgType">
              {{ 'organisationType.' + orgType | translate }}
            </mat-option>
          }
        </mat-select>
        <mat-error>
          <app-form-field-error
            [field]="organisationFormGroup.get('organisationType')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>
    
      <!-- WYSIWYG Input -->
      <div
        class="mat-form-field-appearance-outline wysiwyg-form-field"
        [class.ng-invalid]="
          organisationFormGroup.get('description')?.invalid &&
          (organisationFormGroup.get('description')?.dirty ||
            organisationFormGroup.get('description')?.touched)
        "
        [class.mat-form-field-disabled]="
          organisationFormGroup.get('description')?.disabled
        "
        >
        <div class="mat-form-field-wrapper tip-tap-wrapper">
          <app-tiptap-menu-bar
            [editor]="editor"
            [disabled]="organisationFormGroup.get('description')?.disabled!"
            ><span
            >{{ 'forms.labels.organisationDescription' | translate }} *</span
            >
    
            <app-char-count
              counter
              [count]="currentChars()"
              [total]="1500"
            ></app-char-count>
          </app-tiptap-menu-bar>
          <tiptap-editor
            [editor]="editor"
            formControlName="description"
          ></tiptap-editor>
    
          <div class="mat-form-field-subscript-wrapper">
            <mat-error>
              <app-form-field-error
                [field]="organisationFormGroup.get('description')"
              ></app-form-field-error>
            </mat-error>
          </div>
        </div>
      </div>
    
      @if (org && org.randomUniqueId && isActiveStep) {
        <div
          class="file-uploads"
          >
          <app-upload-image
            [config]="dzService.getImageConfig('logo', org.randomUniqueId)"
            [aspectRatio]="dzService.getAspectRatio('logo')"
            [labelTranslationKey]="'forms.labels.organisationLogo'"
            [disabled]="organisationFormGroup.disabled"
            [fileId]="org.logo"
            style="width: 200px"
            [errorMsg]="'sign-up.upload.error' | translate"
          [info]="
            ('sign-up.upload.tooltip' | translate) +
            ', ' +
            ('sign-up.upload.logoWidthTooltipExt' | translate)
          "
            (delete)="deleteHandler(imageTypes.LOGO)"
          ></app-upload-image>
          <app-upload-image
            [imageTools]="true"
            [imageMode]="organisationFormGroup.get('bannerImageMode')?.value"
            [config]="dzService.getImageConfig('image', org.randomUniqueId)"
            [aspectRatio]="dzService.getAspectRatio('banner')"
            [labelTranslationKey]="'forms.labels.organisationImage'"
            [disabled]="organisationFormGroup.disabled"
            [fileId]="org.image"
            [errorMsg]="'sign-up.upload.error' | translate"
          [info]="
            ('sign-up.upload.tooltip' | translate) +
            ', ' +
            ('sign-up.upload.titleImageWidthTooltipExt' | translate)
          "
            (delete)="deleteHandler(imageTypes.TITLE)"
            (imageModeChanged)="imageModeHandler($event)"
          ></app-upload-image>
        </div>
      }
      <div>
        <mat-checkbox matInput formControlName="privacyConsent"
          ><span
            [innerHTML]="
              'forms.labels.privacyConsent'
                | translate
                  : {
                      participationdeclaration: participationDeclarationUrl
                    }
            "
        ></span
      ></mat-checkbox>
      <mat-error>
        <app-form-field-error
          [field]="organisationFormGroup.get('privacyConsent')"
        ></app-form-field-error>
      </mat-error>
    </div>
    </form>
    `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    ::ng-deep {
      label.mat-checkbox-layout {
        white-space: normal;
      }
    }

    .char-count {
      position: absolute;
      top: 4rem;
      right: 1rem;
    }

    .tip-tap-wrapper {
      position: relative;
    }

    form {
      display: flex;
      flex-direction: column;
      margin: 2em;
    }

    .file-uploads {
      display: flex;
      gap: 2em;
      flex-direction: column;
      margin-bottom: $spacing-4;
    }

    .wysiwyg-form-field {
      .mat-form-field-subscript-wrapper {
        position: static;
      }
      .mat-form-field-label {
        display: block;
        padding-left: 0.75em;
        top: 2.3em;
      }
    }

    @media screen and (min-width: $breakpoint-sm) {
      .file-uploads {
        flex-direction: row;
      }
    }
  `
})
export class OrganisationFormComponent implements OnInit, OnChanges, OnDestroy {
  imageTypes = ImageType;
  organisationFormGroup: FormGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    organisationType: ['', Validators.required],
    description: ['', [wysiwygContentRequired(100, 1500)]],
    privacyConsent: [false, [Validators.requiredTrue]]
  });
  formChangesSub: Subscription | null = null;
  unsubscribe$ = new Subject();

  @Input() org: OrganisationWIP | null = null;
  @Input() enableAutosave = true;
  @Input() isEditAllowed = true;
  @Input() isActiveStep = false;

  @Output() saveData = new EventEmitter<OrganisationWIP>();
  @Output() deleteImage = new EventEmitter<ImageType>();

  orgTypeOpts = Object.values(OrganisationType);

  editor: Editor;
  participationDeclarationUrl = '';

  constructor(
    public dzService: DropzoneService,
    private _formBuilder: FormBuilder,
    private wysiwygService: WysiwygService,
    public directusService: DirectusService,
    translate: TranslateService
  ) {
    this.editor = wysiwygService.getTipTapConfig();
    this.organisationFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      organisationType: ['', Validators.required],
      description: ['', [wysiwygContentRequired(100, 1500)]],
      privacyConsent: [false, [Validators.requiredTrue]],
      bannerImageMode: ['cover']
    });

    this.getParticipationUrl();
    translate.onLangChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.getParticipationUrl();
    });
  }

  ngOnInit(): void {
    if (this.org?.source === 'IMPORT') {
      this.organisationFormGroup.markAllAsTouched();
      this.organisationFormGroup.updateValueAndValidity();
    }
    this.formChangesSub = this.organisationFormGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe((values: Record<string, unknown>) => {
        this.saveFormData(values);
      });
  }

  deleteHandler(image: ImageType): void {
    this.deleteImage.emit(image);
  }

  imageModeHandler(imageMode: ImageMode) {
    const control = this.organisationFormGroup.get('bannerImageMode');
    control?.setValue(imageMode);
    control?.markAsDirty();
  }

  currentChars(): number {
    const desc = this.organisationFormGroup.get('description')?.value;
    return UtilsService.stripHtml(desc).length;
  }

  getParticipationUrl(): void {
    this.directusService.getParticipationDeclarationUrl().then((res) => {
      this.participationDeclarationUrl = res!;
    });
  }

  updateForm() {
    if (this.org) {
      this.organisationFormGroup.patchValue({
        name: this.org.name,
        organisationType: this.org.organisationType,
        description: this.wysiwygService.htmlDecode(this.org.description),
        privacyConsent: this.org.privacyConsent,
        bannerImageMode: this.org.bannerImageMode || 'cover'
      });
      this.organisationFormGroup.markAllAsTouched();

      if (this.isEditAllowed === false) {
        this.organisationFormGroup.disable();
      } else {
        this.organisationFormGroup.enable();
      }
    }
  }

  saveFormData(formVals: Record<string, unknown>) {
    if (
      this.org?.randomUniqueId &&
      this.organisationFormGroup.valid &&
      this.organisationFormGroup.dirty &&
      this.enableAutosave === true
    ) {
      this.saveData.emit(formVals);
    }
  }

  ngOnChanges(changes: any) {
    if (this.enableAutosave === false) {
      this.formChangesSub?.unsubscribe();
    }
    if (changes.org?.firstChange) {
      this.updateForm();
    }
  }

  ngOnDestroy() {
    this.formChangesSub?.unsubscribe();
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
