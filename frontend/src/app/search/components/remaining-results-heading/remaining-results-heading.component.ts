import { Component, Input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-remaining-results-heading',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './remaining-results-heading.component.html',
  styleUrl: './remaining-results-heading.component.scss'
})
export class RemainingResultsHeadingComponent {
  @Input() searchTerm = '';
}
