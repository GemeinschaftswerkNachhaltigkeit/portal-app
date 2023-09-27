import {
  Component,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Editor } from '@tiptap/core';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { WysiwygService } from 'src/app/shared/services/wysiwyg.service';

@Component({
  selector: 'app-content-controls',
  templateUrl: './content-controls.component.html',
  styleUrls: ['./content-controls.component.scss']
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
