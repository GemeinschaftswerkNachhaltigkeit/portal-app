import { Component, Input } from '@angular/core';
import {
  SignUpActivityContent,
  SignUpOrgContent
} from '../../services/directus-content.service';

import { HtmlWrapperComponent } from '../base/html-wrapper.component';

@Component({
  selector: 'app-form-step-description',
  standalone: true,
  imports: [HtmlWrapperComponent],
  template: `
    <div class="form-step-description">
      @if (
        content?.stepDescriptions &&
        content?.stepDescriptions !== null &&
        stepDescriptionId !== null &&
        content?.stepDescriptions?.[stepDescriptionId] !== undefined &&
        content?.stepDescriptions?.[stepDescriptionId]?.description !==
          undefined
      ) {
        <div class="description-content-wrapper">
          <app-html-wrapper
            [html]="
              content?.stepDescriptions?.[stepDescriptionId]?.description || ''
            "
          ></app-html-wrapper>
        </div>
      }
    </div>
  `,
  styles: `
    .form-step-description {
      padding: 2em;
      font-family: Verdana, sans-serif;
    }
  `
})
export class FormStepDescriptionComponent {
  @Input() content: SignUpOrgContent | SignUpActivityContent | null = null;
  @Input() stepDescriptionId: number | null = null;
}
