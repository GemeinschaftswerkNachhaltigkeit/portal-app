import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSustainabilityWinnerBadgeComponent } from './project-sustainability-winner-badge';
import Organisation from 'src/app/shared/models/organisation';
import { InitiatorBadgeComponent } from './initiator-badge.component';

@Component({
  selector: 'app-orga-badges',
  styles: [
    `
      @use 'theme' as *;
      @use 'palette' as *;
      .badges {
        display: flex;
        gap: $spacing-2;
        flex-wrap: wrap;
      }
    `
  ],
  template: `
    @if (organisation) {
      <div class="badges">
        @if (organisation.initiator) {
          <app-initiator-badge></app-initiator-badge>
        }
        @if (organisation.projectSustainabilityWinner) {
          <app-project-sustainability-winner-badge></app-project-sustainability-winner-badge>
        }
      </div>
    }
  `,
  standalone: true,
  imports: [
    CommonModule,
    InitiatorBadgeComponent,
    ProjectSustainabilityWinnerBadgeComponent
  ]
})
export class OrgaBadgesComponent {
  @Input() organisation?: Organisation;
}
