import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';

@Component({
  selector: 'app-organisation-card',
  templateUrl: './organisation-card.component.html',
  styleUrls: ['./organisation-card.component.scss']
})
export class OrganisationCardComponent {
  @Input() orgWIP: OrganisationWIP | null = null;
  @Input() active = false;
  @Input() elevation = true;

  @Input() showFeedbackToggle = true;
  @Output() toggleFeedbackHistory = new EventEmitter<boolean>();

  hasFeedbackHistory(orgWIP: OrganisationWIP) {
    if (orgWIP?.feedbackHistory?.length) {
      return orgWIP.feedbackHistory.length > 0;
    } else {
      return false;
    }
  }
}
