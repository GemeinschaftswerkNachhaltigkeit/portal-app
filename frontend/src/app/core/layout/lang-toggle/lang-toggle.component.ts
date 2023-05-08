import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from '../../services/coockie.service';

const LP_LANG_COOKIE = 'i18n_redirected';

@Component({
  selector: 'app-lang-toggle',
  templateUrl: './lang-toggle.component.html',
  styleUrls: ['./lang-toggle.component.scss']
})
export class LangToggleComponent implements OnInit {
  selectedLang = this.translate.currentLang || this.translate.getDefaultLang();
  availableLangs = [
    { key: 'de', name: 'Deutsch' },
    { key: 'en', name: 'Englisch' }
  ];

  constructor(
    private translate: TranslateService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    const lpLang = this.cookieService.getCookie(LP_LANG_COOKIE)?.value;
    if (lpLang && this.availableLangs.map((l) => l.key).includes(lpLang)) {
      this.translate.use(lpLang);
      this.selectedLang = lpLang;
    }
  }

  selectLang(lang: string): void {
    this.selectedLang = lang;
    this.translate.use(lang);
    this.cookieService.setCookie(LP_LANG_COOKIE, lang);
  }
}
