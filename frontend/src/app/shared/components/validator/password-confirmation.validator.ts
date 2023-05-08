import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordConfirmationValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const confirmPassword = control.parent?.get('passwordConfirm')?.value || '';
    const password = control.parent?.get('password')?.value || '';

    let error = null;
    error =
      password && confirmPassword && password !== confirmPassword
        ? { passwordMismatch: true }
        : error;
    return error;
  };
}
