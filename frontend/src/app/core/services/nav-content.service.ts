/*  eslint-disable  @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
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
    translate: TranslateService,
    private directusService: DirectusService
  ) {
    translate.onLangChange.subscribe(() => {
      this.getNavContent();
    });
  }

  public async getNavContent() {
    let navItems: NavItemContent[] = [];
    try {
      const navItemsResponse =
        await this.directusService.getContentItemForCurrentLang<{
          nav_item: NavItemContent[];
        }>('navigation_translations');
      if (navItemsResponse) {
        navItems = navItemsResponse.nav_item;
        this.navContent.next(navItems);
      }
    } catch (e) {
      console.error('loadError', e);
      return;
    }
  }
}
