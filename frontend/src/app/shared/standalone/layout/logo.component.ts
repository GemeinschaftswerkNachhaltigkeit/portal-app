import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a href="/" aria-current="page" title="Home" id="header-logo" class="logo">
      <img
        src="assets/img/logo_{{ getLang() }}.svg"
        alt="Logo"
        loading="eager"
      />
    </a>
  `,
  styles: `
    .logo {
      width: 14rem;
      display: block;

      img {
        width: 100%;
        display: block;
      }
    }
  `
})
export class LogoComponent {
  constructor(private translate: TranslateService) {}

  getLang(): string {
    return this.translate.currentLang || this.translate.getDefaultLang();
  }
}
