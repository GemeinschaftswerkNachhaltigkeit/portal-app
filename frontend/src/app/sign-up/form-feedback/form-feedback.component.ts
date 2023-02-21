import { Component, Input } from '@angular/core';
import { OrganisationStatus } from 'src/app/shared/models/organisation-status';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';

@Component({
  selector: 'app-form-feedback',
  templateUrl: './form-feedback.component.html',
  styleUrls: ['./form-feedback.component.scss']
})
export class FormFeedbackComponent {
  @Input() org: OrganisationWIP | null = null;

  showFeedback() {
    if (
      this.org &&
      this.org.status === OrganisationStatus.RUECKFRAGE_CLEARING
    ) {
      return true;
    }
    return false;
  }
}
