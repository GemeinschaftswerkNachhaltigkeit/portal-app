import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordPolicy(minLength = 8, maxLength = 32): ValidatorFn {
  return (
    control: AbstractControl
  ): { [key: string]: { value: string } } | null => {
    const pw = control.value || '';

    const numberPatter = /[0-9]/;
    const capitalLetterPattern = /[A-Z]/;
    const lowerCaseLetterPattern = /[a-z]/;
    const symbolPattern = /[!@#$%^&+=\-_]/;

    const longEnough = pw.length >= minLength;
    const shortEnough = pw.length <= maxLength;
    const hasNumber = !!numberPatter.exec(pw);
    const hasCapitalLetter = !!capitalLetterPattern.exec(pw);
    const hasLowerCaseLetter = !!lowerCaseLetterPattern.exec(pw);
    const hasSymbol = !!symbolPattern.exec(pw);

    let error = null;
    error = !longEnough ? { passwordLength: { value: control.value } } : error;
    error = !shortEnough ? { maxlength: { value: control.value } } : error;
    error = !hasNumber ? { passwordNumber: { value: control.value } } : error;
    error = !hasCapitalLetter
      ? { passwordCapitalLetter: { value: control.value } }
      : error;
    error = !hasLowerCaseLetter
      ? { passwordLowercaseLetter: { value: control.value } }
      : error;
    error = !hasSymbol ? { passwordSymbol: { value: control.value } } : error;
    return error;
  };
}
