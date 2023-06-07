import { AbstractControl, ValidatorFn } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';

export function wysiwygContentRequired(
  minLength = 100,
  maxLength = 1000
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const text = UtilsService.stripHtml(control.value || '');
    const textLen = text.length;

    const inRange = textLen >= minLength && textLen <= maxLength;

    let error = null;
    if (!text) {
      error = { required: true };
    }
    if (!error && !inRange) {
      error = { invalidWysiwygContentLength: true };
    }

    return error;
  };
}
