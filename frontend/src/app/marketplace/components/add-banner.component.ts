import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-banner',
  standalone: true,
  imports: [MatButtonModule, TranslateModule],
  template: `
    <div>{{ 'marketplace.titles.add' | translate }}</div>
    <button type="button" class="action" mat-flat-button (click)="add.emit()">
      {{ 'btn.add' | translate }}
    </button>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    :host {
      background-color: $blue-navy;
      color: white;
      font-size: 2rem;
      line-height: 110%;
      font-weight: bold;
      text-transform: uppercase;
      padding: $spacing-10;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-4;
      flex-wrap: wrap;
      margin-bottom: $spacing-12;
    }

    .action {
      background-color: $yellow !important;
      color: $blue-navy;
      flex-shrink: 0;
    }

    @media screen and (min-width: $breakpoint-sm) {
      :host {
        gap: $spacing-60;
        flex-wrap: nowrap;
      }
    }
  `
})
export class AddBannerComponent {
  @Output() add = new EventEmitter();
}
