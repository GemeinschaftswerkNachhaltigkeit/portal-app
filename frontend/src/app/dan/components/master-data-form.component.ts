/*  eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';
import { Editor } from '@tiptap/core';
import { ActivityType } from 'src/app/shared/models/activity-type';
import { UtilsService } from 'src/app/shared/services/utils.service';

import { WysiwygService } from 'src/app/shared/services/wysiwyg.service';
import { Subject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidCheckComponent } from 'src/app/shared/components/form/valid-check.component';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { TiptapMenuBarComponent } from 'src/app/shared/components/form/tiptap-menu-bar.component';
import { NgxTiptapModule } from 'ngx-tiptap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { CharCountComponent } from 'src/app/shared/components/base/char-count.component';

@Component({
  selector: 'app-master-data-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ValidCheckComponent,
    FormFieldErrorComponent,
    TiptapMenuBarComponent,
    NgxTiptapModule,
    TranslateModule,
    MatDatepickerModule,
    MatIconModule,
    CharCountComponent
  ],
  template: `
    <ng-container [formGroup]="form">
      <!-- name -->

      <mat-form-field appearance="outline">
        <mat-label>{{ 'forms.labels.danName' | translate }}</mat-label>
        <input
          matInput
          [placeholder]="'forms.labels.danName' | translate"
          formControlName="name"
        />
        <app-valid-check [form]="form" controlName="name"></app-valid-check>

        <mat-error>
          <app-form-field-error
            [field]="form.get('name')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>

      <!-- WYSIWYG Input -->

      <div
        class="mat-form-field-appearance-outline wysiwyg-form-field"
        [class.ng-invalid]="
          form.get('description')?.invalid &&
          (form.get('description')?.dirty || form.get('description')?.touched)
        "
        [class.mat-form-field-disabled]="form.get('description')?.disabled"
      >
        <div class="description">
          {{ 'dan.texts.wizard.description' | translate }}
        </div>
        <div class="mat-form-field-wrapper tip-tap-wrapper" *ngIf="reload">
          <app-tiptap-menu-bar
            [editor]="editor"
            [disabled]="form.get('description')?.disabled!"
            ><span>{{ 'forms.labels.description' | translate }} *</span>
            <app-char-count
              counter
              [count]="currentCharsHtml('description')"
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
                [field]="form.get('description')"
              ></app-form-field-error>
            </mat-error>
          </div>
        </div>
      </div>

      <!-- date -->

      <mat-form-field appearance="outline">
        <mat-label> {{ 'forms.labels.periodDan' | translate }}</mat-label>
        <mat-date-range-input [rangePicker]="picker">
          <input
            matStartDate
            [placeholder]="'forms.labels.start' | translate"
            formControlName="start"
          />
          <input
            matEndDate
            [placeholder]="'forms.labels.end' | translate"
            formControlName="end"
          />
        </mat-date-range-input>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-date-range-picker #picker></mat-date-range-picker>
        <mat-hint>{{ danContent?.period_hint }}</mat-hint>
        <mat-error>
          <app-form-field-error
            [field]="form.get('start')"
          ></app-form-field-error>

          <span
            *ngIf="
              form.get('start')?.invalid &&
              form.get('end')?.invalid &&
              (form.get('start')?.dirty || form.get('start')?.touched) &&
              (form.get('end')?.dirty || form.get('end')?.touched)
            "
            >,
          </span>
          <app-form-field-error
            [field]="form.get('end')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>

      <!-- Link zur Anmeldung -->

      <mat-form-field appearance="outline">
        <mat-label>{{ 'forms.labels.registerUrl' | translate }}</mat-label>
        <input
          matInput
          [placeholder]="'forms.labels.registerUrl' | translate"
          formControlName="registerUrl"
        />
        <div matSuffix><mat-icon>language</mat-icon></div>
        <app-valid-check
          [form]="form"
          controlName="registerUrl"
        ></app-valid-check>

        <mat-error>
          <app-form-field-error
            [field]="form.get('registerUrl')"
          ></app-form-field-error>
        </mat-error>
      </mat-form-field>
    </ng-container>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .char-count {
      position: absolute;
      top: 4rem;
      right: 1rem;
    }

    .tip-tap-wrapper {
      position: relative;
    }

    .description {
      font-weight: bold;
      margin-bottom: $spacing-2;
    }
  `
})
export class MasterDataFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() formGroupName!: string;
  @Input() descriptionPlaceholder = '';
  @Input() danContent: {
    completed_message?: string;
    period_hint?: string;
  } | null = {};
  form!: FormGroup;
  activityTypeOpts = [ActivityType.DAN];
  editor: Editor;
  reload = true;

  unsubscribe$ = new Subject();

  constructor(
    private rootFormGroup: FormGroupDirective,
    private wysiwygService: WysiwygService,
    private _adapter: DateAdapter<LuxonDateAdapter>,
    private translate: TranslateService,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {
    this.editor = wysiwygService.getTipTapConfig();
    this.translate.onLangChange.subscribe((event) => {
      this.changeDatePickerLang(event.lang);
    });
  }

  currentCharsHtml(field: string): number {
    const desc = this.form.get(field)?.value || '';
    return UtilsService.stripHtml(desc).length;
  }

  currentChars(field: string): number {
    const value = this.form.get(field)?.value || '';
    return value.length;
  }

  changeDatePickerLang(locale: string) {
    this._locale = locale;
    this._adapter.setLocale(this._locale);
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.editor = this.wysiwygService.getTipTapConfig(
      this.descriptionPlaceholder
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['descriptionPlaceholder']) {
      setTimeout(() => (this.reload = false));
      this.editor = this.wysiwygService.getTipTapConfig(
        this.descriptionPlaceholder
      );
      setTimeout(() => (this.reload = true));
    }
  }
}
