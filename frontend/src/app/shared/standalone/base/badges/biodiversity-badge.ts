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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-sprout"
        >
          <path d="M7 20h10" />
          <path d="M10 20c5.5-2.5.8-6.4 3-10" />
          <path
            d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"
          />
          <path
            d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"
          />
        </svg>
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
