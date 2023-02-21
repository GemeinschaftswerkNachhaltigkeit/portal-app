import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title = '';
  @Input() firstName? = '';

  constructor(private translate: TranslateService) {}

  hello(): string {
    const hello = this.translate.instant('account.labels.hello');
    return this.firstName ? `${hello} ${this.firstName}` : '';
  }
}
