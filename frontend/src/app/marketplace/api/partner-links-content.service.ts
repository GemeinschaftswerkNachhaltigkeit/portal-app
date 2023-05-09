/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class PartnerLinksContentService {
  constructor(private directusService: DirectusService) {}

  getPartnerLinks(): Observable<PartnerLink[]> {
    return from(this.load());
  }

  private async load(): Promise<PartnerLink[]> {
    const links = await this.directusService.getContentItems<PartnerLink>(
      'marketplace_parnter_links'
    );

    const linkTranslations =
      await this.directusService.getContentItemsForCurrentLang<{
        title: string;
        marketplace_parnter_links_id: number;
      }>('marketplace_parnter_links_translations');

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
}
