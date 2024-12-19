
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeadingComponent } from '../base/heading.component';
import { TextBlockComponent } from '../base/text-block.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HeadingComponent, TextBlockComponent],
  template: `
    <header header class="header">
      <div>
        @if (hello()) {
          <app-heading type="h4" size="xs" color="none">{{
            hello()
          }}</app-heading>
        }
        <app-heading type="h1">{{ title }}</app-heading>
      </div>
      <app-text-block>
        <ng-content></ng-content>
      </app-text-block>
    </header>
    <div class="action">
      <ng-content select="[action]"></ng-content>
    </div>
    `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    .header {
      display: grid;
      gap: $spacing-8;
    }

    .action {
      padding: $spacing-8 0;
    }
  `
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
