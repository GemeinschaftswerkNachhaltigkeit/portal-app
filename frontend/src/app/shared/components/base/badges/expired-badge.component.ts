
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-expired-badge',
  standalone: true,
  imports: [TranslateModule],
  template: `<div class="expired-badge">
      <span #ref><ng-content></ng-content></span>
      @if (!ref.hasChildNodes()) {
        {{
        (dan ? 'labels.expiredDanActivity' : 'labels.expiredActivity')
        | translate
        }}
      }
    </div>`,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .expired-badge {
      color: white;
      background-color: $blue-navy;
      transform: rotate(-5deg);
      padding: $spacing-2 $spacing-6;
      text-transform: uppercase;
      letter-spacing: 0.25rem;
    }
  `
})
export class ExpiredBadgeComponent {
  @Input() dan = false;
}
