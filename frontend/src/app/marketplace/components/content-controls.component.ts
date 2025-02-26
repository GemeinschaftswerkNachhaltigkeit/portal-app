import {
  Component,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Editor } from '@tiptap/core';
import { NgxTiptapModule } from 'ngx-tiptap';
import { CharCountComponent } from 'src/app/shared/components/base/char-count.component';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { TiptapMenuBarComponent } from 'src/app/shared/components/form/tiptap-menu-bar.component';
import { ValidCheckComponent } from 'src/app/shared/components/form/valid-check.component';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { WysiwygService } from 'src/app/shared/services/wysiwyg.service';

@Component({
  selector: 'app-content-controls',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    FormFieldErrorComponent,
    CharCountComponent,
    TiptapMenuBarComponent,
    NgxTiptapModule,
    ValidCheckComponent,
    MatDatepickerModule
  ],
  template: `
    <ng-container [formGroup]="form">
      <div class="fields">
        <div class="field">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'forms.labels.title' | translate }}</mat-label>
            <input
              matInput
              [placeholder]="'forms.labels.title' | translate"
              formControlName="name"
            />
            <app-valid-check [form]="form" controlName="name"></app-valid-check>
            <mat-error>
              <app-form-field-error
                [field]="form.get('name')"
              ></app-form-field-error>
            </mat-error>
          </mat-form-field>
          <div class="char-count">
            <app-char-count
              [count]="currentChars('name')"
              [total]="100"
            ></app-char-count>
          </div>
        </div>

        <!-- WYSIWYG Input -->
        <div
          class="mat-form-field-appearance-outline wysiwyg-form-field"
          [class.ng-invalid]="
            form.get('description')?.invalid &&
            (form.get('description')?.dirty || form.get('description')?.touched)
          "
          [class.mat-form-field-disabled]="form.get('description')?.disabled"
        >
          @if (reload) {
            <div class="mat-form-field-wrapper tip-tap-wrapper">
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
              <div class="char-count"></div>
              <div class="mat-form-field-subscript-wrapper">
                <mat-error>
                  <app-form-field-error
                    [field]="form.get('description')"
                  ></app-form-field-error>
                </mat-error>
              </div>
            </div>
          }
        </div>

        <div class="field">
          <mat-form-field appearance="outline">
            <mat-label>{{
              urlLabel || 'forms.labels.url' | translate
            }}</mat-label>
            <input matInput formControlName="url" />
            <app-valid-check [form]="form" controlName="url"></app-valid-check>
            <mat-error>
              <app-form-field-error
                [field]="form.get('url')"
              ></app-form-field-error>
            </mat-error>
          </mat-form-field>
          <div class="char-count">
            <app-char-count
              [count]="currentChars('url')"
              [total]="1000"
            ></app-char-count>
          </div>
        </div>

        @if (form.get('endUntil')) {
          <div class="field">
            <!-- date -->

            <mat-form-field appearance="outline">
              <mat-label>
                {{ 'forms.labels.expireDate' | translate }}</mat-label
              >

              <input
                matInput
                [matDatepicker]="picker"
                formControlName="endUntil"
              />
              <mat-datepicker-toggle
                matSuffix
                [for]="picker"
              ></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </div>
        }
      </div>
    </ng-container>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .fields {
      display: flex;
      flex-direction: column;
      gap: $spacing-4;
      min-width: 0;
    }

    .field {
      position: relative;
      min-width: 0;
    }

    .char-count {
      position: absolute;
      bottom: -0rem;
      right: 1rem;
    }

    .wysiwyg-form-field {
      position: relative;
    }
  `
})
export class ContentControlsComponent implements OnInit, OnChanges {
  @Input() formGroupName!: string;
  @Input() urlLabel?: string = '';
  @Input() descriptionPlaceholder = '';
  form!: FormGroup;
  editor: Editor;
  reload = true;

  constructor(
    private rootFormGroup: FormGroupDirective,
    private wysiwygService: WysiwygService,
    private adapter: DateAdapter<LuxonDateAdapter>,
    private translate: TranslateService,
    @Inject(MAT_DATE_LOCALE) private locale: string,
    private zone: NgZone
  ) {
    this.editor = wysiwygService.getTipTapConfig(this.descriptionPlaceholder);
    this.translate.onLangChange.subscribe((event) => {
      this.changeDatePickerLang(event.lang);
    });
  }

  changeDatePickerLang(locale: string) {
    this.locale = locale;
    this.adapter.setLocale(this.locale);
  }

  currentCharsHtml(field: string): number {
    const desc = this.form.get(field)?.value || '';
    return UtilsService.stripHtml(desc).length;
  }

  currentChars(field: string): number {
    const value = this.form.get(field)?.value || '';
    return value.length;
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.editor = this.wysiwygService.getTipTapConfig(
      this.descriptionPlaceholder
    );
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
