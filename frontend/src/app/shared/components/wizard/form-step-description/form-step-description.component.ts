import { Component, Input } from '@angular/core';
import {
  SignUpActivityContent,
  SignUpOrgContent
} from '../../../../sign-up/services/directus-content.service';

@Component({
  selector: 'app-form-step-description',
  templateUrl: './form-step-description.component.html',
  styleUrls: ['./form-step-description.component.scss']
})
export class FormStepDescriptionComponent {
  @Input() content: SignUpOrgContent | SignUpActivityContent | null = null;
  @Input() stepDescriptionId: number | null = null;
}
