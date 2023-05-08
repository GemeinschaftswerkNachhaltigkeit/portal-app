import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';
import Activity from '../models/actvitiy';
import LocationData from '../models/location-data';
import Organisation from '../models/organisation';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private translate: TranslateService) {}

  isExpiredActivity(period?: {
    start: string;
    end: string;
    permanent?: boolean;
  }): boolean {
    if (!period || period.permanent) {
      return false;
    }
    const nowTs = new Date().getTime();
    const { end } = period;
    const endTs = new Date(end).getTime();

    return nowTs - endTs > 0;
  }

  noLocation(location?: LocationData): boolean {
    return (
      !location ||
      !location.address ||
      Object.values(location.address).every((v) => {
        const value = !v || v === 'DE';
        return value;
      })
    );
  }

  abbreviation(name: string): string {
    const nameParts = name.split(' ');
    const firstTwo = nameParts?.slice(0, 2) || [];
    return firstTwo
      ?.map((entry) => entry.charAt(0))
      .join('')
      .toUpperCase();
  }

  locationString(location?: LocationData | null): string {
    if (location?.online) {
      return this.translate.instant('labels.online');
    }
    if (location?.privateLocation) {
      return this.translate.instant('labels.private');
    }
    if (!location || !location.address) {
      return '';
    }
    const city = location?.address?.city || '';
    const state = location?.address?.state || '';
    return state ? `${city}, ${state}` : city;
  }

  dateRangeString(period?: {
    start: string;
    end: string;
    permanent?: boolean;
  }): string {
    if (period) {
      if (period.permanent) {
        return this.translate.instant('labels.permanent');
      }
      const start = period?.start;
      const end = period?.end;
      const formattedStart = DateTime.fromISO(start)
        .setLocale(this.translate.currentLang)
        .toFormat('D');
      const formattedEnd = DateTime.fromISO(end)
        .setLocale(this.translate.currentLang)
        .toFormat('D');
      if (start === end) {
        return `${formattedStart}`;
      }

      return `${formattedStart} - ${formattedEnd}`;
    }
    return '';
  }

  limitedSdgs(sdgs: number[] = [], maxSdgs = 4): number[] {
    if (sdgs) {
      return sdgs.slice(0, maxSdgs);
    } else {
      return [];
    }
  }

  remainingSdgs(sdgs: number[] = [], maxSdgs = 4): number[] {
    const limitedLength = this.limitedSdgs(sdgs, maxSdgs).length;

    if (sdgs) {
      const remSdgs = sdgs.slice(limitedLength);
      return remSdgs;
    } else {
      return [];
    }
  }

  excerpt(html?: string, limit = 140): string {
    if (!html) {
      return '';
    }
    const ellipsis = '...';
    const limitedTextLengWithoutEllipses = limit - ellipsis.length;
    const text = UtilsService.stripHtml(html);

    if (text.length < limit) {
      return text;
    } else {
      let subStr = text.substring(0, limitedTextLengWithoutEllipses);
      const lastChar = subStr.charAt(subStr.length - 1);

      if (lastChar !== ' ') {
        subStr = subStr.split(' ').slice(0, -1).join(' ');
      } else {
        if (lastChar === ' ' || lastChar === ',') {
          subStr = subStr.slice(0, -1);
        }
        if (lastChar === ' ' || lastChar === ',') {
          subStr = subStr.slice(0, -1);
        }
      }
      return `${subStr}${ellipsis}`;
    }
  }

  static stripHtml(html: string): string {
    const withoutTags = html.replace(/<[^>]*>?/gm, '');
    let withoutSpecialHtmlChars = withoutTags.replace(/&[a-zA-Z]*;?/gm, '');
    withoutSpecialHtmlChars = withoutSpecialHtmlChars.replace(/&nbsp;/g, ' ');
    return withoutSpecialHtmlChars ? withoutSpecialHtmlChars.trim() : '';
  }

  public scrollToAnchor(anchor: string, wait = 100): void {
    const element = document.querySelector('#' + anchor);

    if (element) {
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }, wait);
    }
  }

  public scrollTop(): void {
    const contentContainer =
      document.querySelector('.mat-sidenav-content') || window;
    contentContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }

  asActivity(entity?: Organisation | Activity): Activity {
    return entity as Activity;
  }

  asOrga(entity?: Organisation | Activity): Organisation {
    return entity as Organisation;
  }
}
