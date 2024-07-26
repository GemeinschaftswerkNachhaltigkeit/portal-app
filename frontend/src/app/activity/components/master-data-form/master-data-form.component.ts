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
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Editor } from '@tiptap/core';
import { UtilsService } from 'src/app/shared/services/utils.service';

import { WysiwygService } from 'src/app/shared/services/wysiwyg.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-master-data-form',
  templateUrl: './master-data-form.component.html',
  styleUrls: ['./master-data-form.component.scss']
})
export class MasterDataFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() formGroupName!: string;
  @Input() descriptionPlaceholder = '';
  @Input() danContent: {
    completed_message?: string;
    period_hint?: string;
  } | null = {};
  @Input() isDan = false;
  @Input() inDanPeriod = false;
  @Input() danPeriodParams = {
    url: ''
  };
  form!: FormGroup;
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
