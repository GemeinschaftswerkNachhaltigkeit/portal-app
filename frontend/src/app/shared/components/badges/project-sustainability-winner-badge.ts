import { Component, Input } from '@angular/core';
import Organisation from '../../models/organisation';
import { DirectusService } from '../../services/directus.service';

@Component({
  selector: 'app-project-sustainability-winner-badge',
  styles: [
    `
      @use 'theme' as *;
      @use 'palette' as *;
      .winner-badge {
        display: flex;
        gap: $spacing-2;
        align-items: center;
        color: $project-n;
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
    <a
      class="winner-badge"
      [href]="(externalLinks$ | async)?.projectn_winner_page"
    >
      <div class="icon">
        <app-outlined-icon>workspace_premium</app-outlined-icon>
      </div>
      <div class="label">
        {{ 'labels.projectSustainabilityWinner' | translate }}
      </div>
    </a>
  `
})
export class ProjectSustainabilityWinnerBadgeComponent {
  @Input() organisation?: Organisation;

  externalLinks$ = this.directus.externalLinks$;

  constructor(private directus: DirectusService) {}
}
