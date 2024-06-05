import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSustainabilityWinnerBadgeComponent } from './project-sustainability-winner-badge';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { InitiatorBadgeComponent } from './initiator-badge.component';
import { BiodiversityBadgeComponent } from './biodiversity-badge';
import Activity from 'src/app/shared/models/actvitiy';

@Component({
  selector: 'app-event-badges',
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
    @if (activity) {
      <div>
        @if (isBiodiversityTopic(activity)) {
          <app-biodiversity-badge />
        }
      </div>
    }
  `,
  standalone: true,
  imports: [
    CommonModule,
    InitiatorBadgeComponent,
    ProjectSustainabilityWinnerBadgeComponent,
    BiodiversityBadgeComponent
  ]
})
export class EventBadgesComponent {
  @Input() activity?: Activity;

  isBiodiversityTopic(activity: Activity) {
    return activity.thematicFocus?.includes(ThematicFocus.BIODIVERSITY);
  }
}
