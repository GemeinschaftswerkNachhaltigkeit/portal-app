/*  eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Editor } from '@tiptap/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { wysiwygContentRequired } from 'src/app/shared/components/validator/wysiwyg-content-required.validator';
import { ActivityType } from 'src/app/shared/models/activity-type';
import { ActivityWIP } from 'src/app/shared/models/activity-wip';
import { DropzoneService } from 'src/app/shared/services/dropzone.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { WysiwygService } from 'src/app/shared/services/wysiwyg.service';
import { ImageType } from '../../../shared/models/image-type';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnChanges, OnDestroy {
  imageTypes = ImageType;

  activityFormGroup: FormGroup;
  unsubscribe$ = new Subject();

  @Input() activity: ActivityWIP | null = null;
  @Input() enableAutosave = true;
  @Input() isEditAllowed = true;
  @Input() orgId = '';
  @Input() isActiveStep = false;

  @Output() saveData = new EventEmitter<ActivityWIP>();
  @Output() deleteImage = new EventEmitter<ImageType>();

  activityTypeOpts = Object.values(ActivityType);

  editor: Editor;

  constructor(
    public dzService: DropzoneService,
    private _formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private translateService: TranslateService,
    private wysiwygService: WysiwygService
  ) {
    this.editor = wysiwygService.getTipTapConfig();
    this.activityFormGroup = this._formBuilder.group({
      name: _formBuilder.control('', [
        Validators.required,
        Validators.maxLength(100)
      ]),
      activityType: _formBuilder.control(
        { disabled: true, value: ActivityType.EVENT },
        [Validators.required]
      ),
      description: _formBuilder.control('', [
        wysiwygContentRequired(100, 1500)
      ]),

      start: _formBuilder.control('', [Validators.required]),
      end: _formBuilder.control('', [Validators.required]),
      permanent: _formBuilder.control(false, [])
    });
    this.updateDateSelect();
    this.activityFormGroup.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((values) => {
        this.saveFormData(values);
      });

    this.translateService.onLangChange.subscribe((event) => {
      this.changeDatePickerLang(event.lang);
    });
  }
  updateForm() {
    if (this.activity) {
      this.activityFormGroup.patchValue({
        name: this.activity.name,
        activityType: ActivityType.EVENT,
        description: this.wysiwygService.htmlDecode(this.activity.description),
        start: this.activity.period?.start,
        end: this.activity.period?.end,
        permanent: this.activity.period?.permanent
      });
      this.activityFormGroup.markAllAsTouched();

      if (this.isEditAllowed === false) {
        this.activityFormGroup.disable();
      } else {
        this.activityFormGroup.enable();
        this.activityFormGroup.get('activityType')?.disable();
      }
    }
    this.handleIsPermanent(this.activity?.period?.permanent || false);
  }

  saveFormData(formVals: {
    name: string;
    activityType: string;
    description: string;
    start: string;
    end: string;
    permanent: boolean;
  }) {
    if (
      this.activity?.randomUniqueId &&
      this.activityFormGroup.valid &&
      this.activityFormGroup.dirty &&
      this.enableAutosave === true
    ) {
      this.saveData.emit({
        name: formVals.name,
        activityType: ActivityType.EVENT,
        description: formVals.description,
        period: {
          start: formVals.start,
          end: formVals.end,
          permanent: formVals?.permanent
        }
      });
    }
  }

  deleteHandler(image: ImageType): void {
    this.deleteImage.emit(image);
  }

  ngOnChanges(changes: any) {
    if (changes.activity?.firstChange) {
      this.updateForm();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  updateDateSelect() {
    if (this.activityFormGroup) {
      this.activityFormGroup
        .get('permanent')
        ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
        .subscribe((isPermanent: boolean) => {
          this.handleIsPermanent(isPermanent);
        });
    }
  }

  handleIsPermanent(isPermanent: boolean): void {
    if (isPermanent) {
      this.activityFormGroup.get('start')?.clearValidators();
      this.activityFormGroup.get('start')?.setValue('');
      this.activityFormGroup.get('start')?.disable();
      this.activityFormGroup.get('end')?.clearValidators();
      this.activityFormGroup.get('end')?.setValue('');
      this.activityFormGroup.get('end')?.disable();
    } else {
      this.activityFormGroup.get('start')?.setValidators([Validators.required]);
      this.activityFormGroup.get('start')?.enable();
      this.activityFormGroup.get('end')?.setValidators([Validators.required]);
      this.activityFormGroup.get('end')?.enable();
    }
  }

  currentChars(): number {
    const desc = this.activityFormGroup.get('description')?.value;
    return UtilsService.stripHtml(desc).length;
  }

  changeDatePickerLang(locale: string) {
    this._locale = locale;
    this._adapter.setLocale(this._locale);
  }
}
