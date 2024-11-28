import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-field-error',
  templateUrl: './form-field-error.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  styles: `
    span + span:before {
      content: ',';
      display: inline-block;
      margin-right: 0.5rem;
    }
  `
})
export class FormFieldErrorComponent {
  @Input() field: FormControl | AbstractControl | null | undefined = null;
  @Input() translationPrefix = 'validationErrors';
  @Input() translationSuffix = '';
  @Input() translationParams = {};

  getParams(error?: ValidationErrors | null) {
    return Object.keys(this.translationParams).length
      ? this.translationParams
      : error;
  }
}
