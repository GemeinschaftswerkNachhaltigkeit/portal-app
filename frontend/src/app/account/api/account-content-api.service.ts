/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { DirectusService } from 'src/app/shared/services/directus.service';

export type DanHelpModalContent = {
  title: string;
  subtitle: string;
  entries: { text: string }[];
  image: string;
};

@Injectable({
  providedIn: 'root'
})
export class AccountContentApiService {
  constructor(private directusService: DirectusService) {}

  getDanHelpModalContent(): Observable<DanHelpModalContent | null> {
    return from(this.loadDanHelpModalContent());
  }

  private async loadDanHelpModalContent(): Promise<DanHelpModalContent | null> {
    const content =
      await this.directusService.getContentItemForCurrentLang<DanHelpModalContent>(
        'dan_help_modal_translations'
      );

    if (content && content.image) {
      content.image = this.directusService.getFileUrl(content.image, {
        width: 300,
        fit: 'contain'
      });
    }
    return content;
  }
}
