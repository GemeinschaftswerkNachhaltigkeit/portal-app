/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { FieldFilter } from '@directus/sdk';
import { from, Observable } from 'rxjs';
import { DirectusService } from 'src/app/shared/services/directus.service';

export type DanHelpModalContent = {
  title: string;
  subtitle: string;
  entries: { text: string }[];
  image: string;
};

export type SignUpActivityContent = {
  advantages: string;
  completedMessage: string;
  stepDescriptions: { description: string }[];
};

export type ImportOrgContent = {
  description: string;
  denyCompleteMessage: string;
};

export type ContactInviteContent = {
  allowed: string;
  denied: string;
  invalid: string;
};

@Injectable({
  providedIn: 'root'
})
export class AccountContentApiService {
  constructor(private directusService: DirectusService) {}

  getDanHelpModalContent(
    currentLang: string
  ): Observable<DanHelpModalContent | null> {
    return from(this.loadDanHelpModalContent(currentLang));
  }

  private async loadDanHelpModalContent(
    currentLang: string
  ): Promise<DanHelpModalContent | null> {
    const translationResponse = await this.directusService.directus
      .items('dan_help_modal_translations')
      .readByQuery({
        filter: {
          languages_code: this.getLangIso(currentLang) //'en-US'
        }
      });
    const content = translationResponse?.data
      ? (translationResponse?.data[0] as DanHelpModalContent)
      : null;
    if (content && content.image) {
      content.image = this.directusService.getFileUrl(content.image, {
        width: 300,
        fit: 'contain'
      });
    }
    return content;
  }

  private getLangIso(currentLang: string): FieldFilter<string> {
    return currentLang === 'de' ? 'de-DE' : 'en-US';
  }
}
