import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

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
}
