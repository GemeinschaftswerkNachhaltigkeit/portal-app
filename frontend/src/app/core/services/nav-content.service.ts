/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { FieldFilter } from '@directus/sdk';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { DirectusService } from 'src/app/shared/services/directus.service';

export type NavigationContent = {
  nav_item: NavItemContent[];
};

export type NavItemContent = {
  name: string;
  target?: string;
  new?: boolean;
  key?: string;
  submenu?: NavItemContent[];
};

@Injectable({
  providedIn: 'root'
})
export class NavContentService {
  navContent = new BehaviorSubject<NavItemContent[]>([]);
  navContent$ = this.navContent.asObservable();

  constructor(
    private translate: TranslateService,
    private directusService: DirectusService
  ) {
    translate.onLangChange.subscribe(() => {
      this.getNavContent();
    });
  }

  public async getNavContent() {
    let navItems: NavItemContent[] = [];
    try {
      const response = await this.directusService.directus
        .items('navigation_translations')
        .readByQuery({
          filter: {
            languages_code: this.getLangIso()
          }
        });
      if (response?.data && response?.data.length) {
        const navigationTranslations = response?.data[0] as NavigationContent;
        navItems = navigationTranslations.nav_item;
        this.navContent.next(navItems);
      }
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }

  private getLangIso(): FieldFilter<string> {
    const currentLang =
      this.translate.currentLang || this.translate.defaultLang;
    return currentLang === 'de' ? 'de-DE' : 'en-US';
  }
}
