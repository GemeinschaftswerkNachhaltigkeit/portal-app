import { Component, ContentChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-heading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-heading.component.html',
  styleUrl: './results-heading.component.scss'
})
export class ResultsHeadingComponent {
  @Input() searchTerm = '';
}
