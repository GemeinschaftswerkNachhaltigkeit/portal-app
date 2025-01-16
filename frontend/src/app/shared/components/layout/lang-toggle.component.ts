import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'src/app/shared/services/coockie.service';

const LP_LANG_COOKIE = 'i18n_redirected';

@Component({
  selector: 'app-lang-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="lang-switch">
    @for (lang of availableLangs; track lang) {
      @if (lang.key !== selectedLang) {
        <a title="lang.name" class="lang-option" (click)="selectLang(lang.key)">
          <div [ngClass]="['flag', lang.key]"></div>
        </a>
      }
    }
  </div>`,
  styles: `
    .lang-option {
      display: flex;
      gap: 0.2rem;
      align-items: center;

      .flag {
        width: 22px;
        height: 15px;
        overflow: hidden;
        margin-right: 0.5em;
      }

      .germany,
      .flag.de {
        background: linear-gradient(
          to bottom,
          black calc(100% / 3),
          #dd0000 calc(100% / 3),
          #dd0000 calc(100% / 3 * 2),
          #ffce00 calc(100% / 3 * 2)
        );
      }

      .the-united-kingdom,
      .flag.en {
        background: #00247d;
        background-size: 100px 100px;
        position: relative;
      }
      .the-united-kingdom:before,
      .flag.en:before {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        background:
          linear-gradient(
            to bottom,
            transparent 40%,
            #cc142b 40%,
            #cc142b 60%,
            transparent 60%
          ),
          linear-gradient(
            to right,
            transparent 45%,
            #cc142b 45%,
            #cc142b 55%,
            transparent 55%
          ),
          linear-gradient(
            to bottom,
            transparent 35%,
            white 35%,
            white 65%,
            transparent 65%
          ),
          linear-gradient(
            to right,
            transparent 40%,
            white 40%,
            white 60%,
            transparent 60%
          ),
          linear-gradient(
              146deg,
              transparent 50%,
              #cc142b 50%,
              #cc142b 53%,
              transparent 53%
            ) -65px 45px,
          linear-gradient(
              146deg,
              transparent 50%,
              #cc142b 50%,
              #cc142b 53%,
              transparent 53%
            )
            55px -45px,
          linear-gradient(
              34deg,
              transparent 50%,
              #cc142b 50%,
              #cc142b 53%,
              transparent 53%
            ) -75px -43px,
          linear-gradient(
              34deg,
              transparent 50%,
              #cc142b 50%,
              #cc142b 53%,
              transparent 53%
            )
            70px 46px,
          linear-gradient(
            146deg,
            transparent 45%,
            white 45%,
            white 55%,
            transparent 55%
          ),
          linear-gradient(
            34deg,
            transparent 45%,
            white 45%,
            white 55%,
            transparent 55%
          );
        width: 22px;
        height: 15px;
        background-repeat: no-repeat;
      }
    }
  `
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
