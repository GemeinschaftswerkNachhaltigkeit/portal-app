import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-remaining-results-heading',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './remaining-results-heading.component.html',
  styleUrl: './remaining-results-heading.component.scss'
})
export class RemainingResultsHeadingComponent {
  @Input() searchTerm = '';
}
