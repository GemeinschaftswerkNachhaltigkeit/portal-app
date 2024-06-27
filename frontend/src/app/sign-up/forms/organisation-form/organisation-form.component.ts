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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Editor } from '@tiptap/core';
import { WysiwygService } from 'src/app/shared/services/wysiwyg.service';
import { DirectusService } from 'src/app/shared/services/directus.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ImageType } from '../../../shared/models/image-type';
import { wysiwygContentRequired } from 'src/app/shared/components/validator/wysiwyg-content-required.validator';
import { OrganisationType } from 'src/app/shared/models/organisation-type';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';
import { ImageMode } from 'src/app/shared/components/form/upload-image/upload-image.component';

@Component({
  selector: 'app-organisation-form',
  templateUrl: './organisation-form.component.html',
  styleUrls: ['./organisation-form.component.scss']
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
        bannerImageMode: this.org.bannerImageMode
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
