
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-paginator-wrapper',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="wrapper mat-elevation-z8">
      <div class="total">{{ total }} {{ 'paging.results' | translate }}</div>
      <div class="content"><ng-content></ng-content></div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      background-color: white;

      .total {
        padding-block: 0;
        padding-inline: $spacing-4;
        font-size: 1.2rem;
        border-bottom: 1px solid $blue-navy;
        border-color: $gray-light2;
        width: 100%;
      }
      .content {
        padding-inline: $spacing-4;
      }
      .noBreak {
        white-space: nowrap;
      }
    }
  `
})
export class PaginatorWrapperComponent {
  @Input() total?: number;
}
