import { Component, Input } from '@angular/core';

import { AllResultsLinkComponent } from '../all-results-link/all-results-link.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-no-results',
  standalone: true,
  imports: [AllResultsLinkComponent, TranslateModule],
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.scss'
})
export class NoResultsComponent {
  @Input() resultType: string;
  @Input() searchTerm: string;
}
