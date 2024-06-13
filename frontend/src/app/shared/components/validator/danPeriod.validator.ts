/* eslint no-useless-escape: "off" */
import { inject } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';
import { FeatureService } from '../feature/feature.service';

/**
 * Add the validator to the end date
 * @returns
 */
export function danPeriodValidator(startDateName: string): ValidatorFn {
  const translateService = inject(TranslateService);
  const featureService = inject(FeatureService);

  return (
    control: AbstractControl
  ): { [key: string]: { [key: string]: string } } | null => {
    const endDateValue = control.value as DateTime;
    const startDateValue = control.parent?.get(startDateName)
      ?.value as DateTime;

    const feature = featureService.getFeature('dan-range');

    if (!feature || !feature.start || !feature.end) return null;
    const featureStart = DateTime.fromISO(feature.start);
    const featureEnd = DateTime.fromISO(feature.end);
    const inDanPeriod =
      featureStart <= endDateValue && featureEnd >= startDateValue;
    const locale = translateService.currentLang;
    const formattedStart = featureStart.setLocale(locale).toFormat('D');
    const formattedEnd = featureEnd.setLocale(locale).toFormat('D');
    const periodText = `${formattedStart} - ${formattedEnd}`;

    let error = null;
    error = !inDanPeriod ? { notInDanPeriod: { period: periodText } } : error;
    return error;
  };
}
