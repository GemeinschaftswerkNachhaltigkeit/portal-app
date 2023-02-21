/*  eslint-disable  @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Directus, FieldFilter } from '@directus/sdk';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import qs from 'query-string';

export const directusAssetsPath = `${environment.directusBaseUrl}/assets`;

@Injectable({
  providedIn: 'root'
})
export class DirectusService {
  directus: Directus<Record<string, any>>;
  //siehe  https://github.com/directus/examples/tree/main/angular
  constructor(private translate: TranslateService) {
    this.directus = new Directus<Record<string, any>>(
      environment.directusBaseUrl
    );
  }

  getFileUrl(
    fileId: string,
    options: { [key: string]: string | number } = {}
  ): string {
    const params = qs.stringify(options);

    return `${environment.directusBaseUrl}/assets/${fileId}?${params}`;
  }

  async getParticipationDeclarationUrl() {
    const res = await this.directus
      .items('landingpage_translations')
      .readByQuery({
        fields: ['participation_declaration', 'languages_id'],
        filter: {
          languages_id: this.getLangIso() //'en-US'
        }
      });
    if (res.data) {
      return `${environment.directusBaseUrl}/assets/${res.data[0].participation_declaration}`;
    } else {
      return;
    }
  }

  private getLangIso(): FieldFilter<string> {
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang;
    return currentLang === 'de' ? 'de-DE' : 'en-US';
  }
}
