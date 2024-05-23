/* eslint no-useless-escape: "off" */
import { inject } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DateTime, DurationUnit } from 'luxon';

/**
 * Add the validator to the end date
 * @returns
 */
export function durationValidator(
  startDateName: string,
  maxDuration: number,
  unit: DurationUnit
): ValidatorFn {
  const translateService = inject(TranslateService);

  return (
    control: AbstractControl
  ): { [key: string]: { [key: string]: string } } | null => {
    const endDateValue = control.value as DateTime;
    const startDateValue = control.parent?.get(startDateName)
      ?.value as DateTime;
    if (!startDateValue || !endDateValue) return null;
    console.log('END', endDateValue);
    const duration = endDateValue.diff(startDateValue, unit).as(unit);
    let error = null;
    const normalizedUnit = unit.endsWith('s') ? unit.slice(0, -1) : unit;
    const dateUnitText =
      maxDuration === 1
        ? translateService.instant('labels.dateUnits.' + normalizedUnit)
        : translateService.instant('labels.dateUnits.' + normalizedUnit + 's');
    const maxDurationText = `${maxDuration} ${dateUnitText}`;
    error =
      duration > maxDuration
        ? { invalidDuration: { duration: maxDurationText } }
        : error;
    console.log('Error', error);

    return error;
  };
}
