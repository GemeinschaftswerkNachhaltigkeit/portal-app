/*  eslint-disable  @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import qs from 'query-string';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export const directusAssetsPath = `${environment.directusBaseUrl}/assets`;

export type ExternalLinks = {
  projectn_winner_page?: string;
};

@Injectable({
  providedIn: 'root'
})
export class DirectusService {
  private externalLinks = new BehaviorSubject<ExternalLinks>({});
  externalLinks$ = this.externalLinks.asObservable();
  //siehe  https://github.com/directus/examples/tree/main/angular
  constructor(private translate: TranslateService, private http: HttpClient) {
    this.getExternalLinks();
  }

  getFileUrl(
    fileId: string,
    options: { [key: string]: string | number } = {}
  ): string {
    const params = qs.stringify(options);

    return `${environment.directusBaseUrl}assets/${fileId}?${params}`;
  }

  async getContentItems<T>(collection: string, queryString = ''): Promise<T[]> {
    const url = `${environment.directusBaseUrl}items/${collection}${queryString}`;
    const res = await lastValueFrom(this.http.get<{ data: T[] }>(url));
    const data = res.data;
    return Array.isArray(data) ? data : [data];
  }

  async getContentItem<T>(
    collection: string,
    queryString = ''
  ): Promise<T | null> {
    const res = await this.getContentItems<T>(collection, queryString);
    return res.length ? res[0] : null;
  }

  getContentItemsForCurrentLang<T>(
    collection: string,
    langFieldName = 'languages_code'
  ): Promise<T[]> {
    const lang = this.getLangIso();
    const params = new URLSearchParams();
    const filter = {
      [langFieldName]: lang
    };
    params.append('filter', JSON.stringify(filter));
    const queryString = `?${params.toString()}`;
    return this.getContentItems<T>(collection, queryString);
  }

  async getContentItemForCurrentLang<T>(
    collection: string,
    langFieldName = 'languages_code'
  ): Promise<T | null> {
    const res = await this.getContentItemsForCurrentLang<T>(
      collection,
      langFieldName
    );
    return res.length ? res[0] : null;
  }

  async getParticipationDeclarationUrl() {
    const res = await this.getContentItemForCurrentLang<{
      participation_declaration: string;
    }>('landingpage_translations', 'languages_id');
    if (res) {
      return `${environment.directusBaseUrl}assets/${res.participation_declaration}`;
    } else {
      return;
    }
  }

  async getExternalLinks(): Promise<void> {
    const res = await this.getContentItem<ExternalLinks>('external_links');
    if (res) {
      this.externalLinks.next(res);
    }
  }

  private getLangIso(): string {
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang;
    return currentLang === 'de' ? 'de-DE' : 'en-US';
  }
}
