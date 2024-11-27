import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  constructor(private translate: TranslateService) {}

  getLang(): string {
    return this.translate.currentLang || this.translate.getDefaultLang();
  }
}
