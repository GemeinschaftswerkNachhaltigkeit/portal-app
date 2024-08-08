import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import Organisation from 'src/app/shared/models/organisation';
import { DirectusService } from 'src/app/shared/services/directus.service';

@Component({
  selector: 'app-biodiversity-badge',
  styles: [
    `
      @use 'theme' as *;
      @use 'palette' as *;
      .badge {
        display: flex;
        gap: $spacing-2;
        align-items: center;
        color: $biodiversity;
        font-weight: 600;
        font-size: 1.2rem;
        text-decoration: none;
        &:hover {
          & + .link {
            display: block;
          }
        }
        .icon {
          display: flex;
          align-items: center;
          img {
            width: 24px;
            height: 24px;
          }
        }
        .label {
          color: $blue-navy;
        }
      }
    `
  ],
  template: `
    <a class="badge" [href]="(externalLinks$ | async)?.biodiversity_page">
      <div class="icon">
        <img src="assets/img/biodiversity.png" />
      </div>
      <div class="label">
        {{ 'thematicFocus.BIODIVERSITY' | translate }}
      </div>
    </a>
  `,
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule]
})
export class BiodiversityBadgeComponent {
  @Input() organisation?: Organisation;

  externalLinks$ = this.directus.externalLinks$;

  constructor(private directus: DirectusService) {}
}
