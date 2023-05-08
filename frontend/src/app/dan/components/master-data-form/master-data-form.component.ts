/*  eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Editor } from '@tiptap/core';
import { ActivityType } from 'src/app/shared/models/activity-type';
import { UtilsService } from 'src/app/shared/services/utils.service';

import { WysiwygService } from 'src/app/shared/services/wysiwyg.service';

@Component({
  selector: 'app-master-data-form',
  templateUrl: './master-data-form.component.html',
  styleUrls: ['./master-data-form.component.scss']
})
export class MasterDataFormComponent implements OnInit, OnChanges {
  @Input() formGroupName!: string;
  @Input() descriptionPlaceholder = '';
  form!: FormGroup;
  activityTypeOpts = [ActivityType.DAN];
  editor: Editor;
  reload = true;

  constructor(
    private rootFormGroup: FormGroupDirective,
    private wysiwygService: WysiwygService
  ) {
    this.editor = wysiwygService.getTipTapConfig();
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
