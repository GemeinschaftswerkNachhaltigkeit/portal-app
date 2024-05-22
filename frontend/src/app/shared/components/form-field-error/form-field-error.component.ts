import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.scss']
})
export class FormFieldErrorComponent {
  @Input() field: FormControl | AbstractControl | null | undefined = null;
  @Input() translationPrefix = 'validationErrors';
  @Input() translationSuffix = '';
  @Input() translationParams = {};

  getParams(error?: ValidationErrors | null) {
    console.log('Field', error);
    return Object.keys(this.translationParams).length
      ? this.translationParams
      : error;
  }
}
