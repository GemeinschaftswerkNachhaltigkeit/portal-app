import { Component, Input } from '@angular/core';
import { Color } from '../../models/color';

import { LabelComponent } from './label.component';
import { TranslateModule } from '@ngx-translate/core';

export enum CategoryType {
  OFFER = 'OFFER',
  BEST_PRACTISE = 'BEST_PRACTISE',
  ACTIVITY = 'ACTIVITY',
  DAN = 'DAN'
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [LabelComponent, TranslateModule],
  template: `
    <div class="category">
      @if (type && category) {
        <app-label [color]="typeColor(type)">
          {{ category | translate }}
        </app-label>
      }
    </div>
    `,
  styles: [
    `
      @use 'theme' as *;
      @use 'palette' as *;

      .category {
        height: 4rem;
        display: flex;
        align-items: center;
      }
    `
  ]
})
export class CategoryComponent {
  @Input() type?: CategoryType;
  @Input() category = '';

  typeColor(type: string): Color {
    switch (type) {
      case CategoryType.OFFER:
        return 'bordeauxe';
      case CategoryType.BEST_PRACTISE:
        return 'yellow';
      case CategoryType.ACTIVITY:
        return 'green';
      case CategoryType.DAN:
        return 'blue';
      default:
        return 'primary';
    }
  }
}
