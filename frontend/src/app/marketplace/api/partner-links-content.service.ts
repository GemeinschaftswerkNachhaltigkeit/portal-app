/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { FieldFilter } from '@directus/sdk';
import { from, Observable } from 'rxjs';
import { DirectusService } from 'src/app/shared/services/directus.service';
import { PartnerLink } from '../models/partner-link';

export type SignUpOrgContent = {
  advantages: string;
  completedMessage: string;
  completedMessageTitle?: string;
  completedMessageVerifyContact: string;
  completedMessageVerifyContactTitle?: string;
  stepDescriptions: { description: string }[];
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
export class PartnerLinksContentService {
  constructor(private directusService: DirectusService) {}

  getPartnerLinks(currentLang: string): Observable<PartnerLink[]> {
    return from(this.load(currentLang));
  }

  private async load(currentLang: string): Promise<PartnerLink[]> {
    const linkData = await this.directusService.directus
      .items('marketplace_parnter_links')
      .readByQuery({
        limit: -1
      });

    const linkTranslationData = await this.directusService.directus
      .items('marketplace_parnter_links_translations')
      .readByQuery({
        filter: {
          languages_code: this.getLangIso(currentLang) //'en-US'
        }
      });
    const links: PartnerLink[] = (linkData.data as PartnerLink[]) || [];
    const linkTranslations =
      (linkTranslationData.data as {
        title: string;
        marketplace_parnter_links_id: number;
      }[]) || [];
    return links.map((link: PartnerLink) => {
      const translated = linkTranslations.find(
        (trans) => trans.marketplace_parnter_links_id === link.id
      );
      link.title = translated ? translated.title : '';
      link.logo = this.directusService.getFileUrl(link.logo, {
        width: 200
      });
      return link;
    });
  }

  private getLangIso(currentLang: string): FieldFilter<string> {
    return currentLang === 'de' ? 'de-DE' : 'en-US';
  }
}
