import { Component, Input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-results-heading',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './results-heading.component.html',
  styleUrl: './results-heading.component.scss'
})
export class ResultsHeadingComponent {
  @Input() searchTerm = '';
}
