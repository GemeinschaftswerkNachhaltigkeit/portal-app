/* eslint no-useless-escape: "off" */
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function urlPattern(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const url = control.value || '';

    /**
     * The patter was changed due to security issues (sonarqube)
     * https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
     */
    const urlPattern =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]+\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

    const isUrl = !!urlPattern.exec(url);

    let error = null;
    error = !isUrl && url ? { invalidUrl: true } : error;

    return error;
  };
}
