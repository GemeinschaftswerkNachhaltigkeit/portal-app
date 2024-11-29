import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-new-badge',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `<span class="badge" [ngClass]="{ yellow: yellow }">
    {{ 'labels.new' | translate }}
  </span> `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    .badge {
      width: fit-content;
      background: $magenta;
      color: white;
      font-size: 10px;
      height: 1.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.8rem;
      margin-right: 4px;
      padding: 0 6px;
      font-weight: 500;
      text-transform: uppercase;

      &.yellow {
        background: $yellow;
        color: $blue-navy;
      }
    }
  `
})
export class NewBadgeComponent {
  @Input() yellow = false;
}
