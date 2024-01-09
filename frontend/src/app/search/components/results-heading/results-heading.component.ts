import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-results-heading',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './results-heading.component.html',
  styleUrl: './results-heading.component.scss'
})
export class ResultsHeadingComponent {
  @Input() searchTerm = '';
}
