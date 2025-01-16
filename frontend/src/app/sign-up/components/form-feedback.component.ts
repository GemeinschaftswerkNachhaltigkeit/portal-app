import { Component, Input } from '@angular/core';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { OrganisationStatus } from 'src/app/shared/models/organisation-status';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';

@Component({
  selector: 'app-form-feedback',
  standalone: true,
  imports: [OutlinedIconComponent],
  template: `
    @if (showFeedback() && org?.feedbackRequest) {
      <div class="form-feedback">
        <app-outlined-icon>help_outline</app-outlined-icon>
        <span>{{ org?.feedbackRequest }}</span>
      </div>
    }
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .form-feedback {
      padding: 2em;
      display: flex;
      align-items: center;
      color: white;
      background-color: $blue-navy;
      app-outlined-icon {
        margin-right: 2em;
      }
    }
  `
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
