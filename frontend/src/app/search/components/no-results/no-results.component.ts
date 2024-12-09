import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllResultsLinkComponent } from '../all-results-link/all-results-link.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-no-results',
  standalone: true,
  imports: [CommonModule, AllResultsLinkComponent, TranslateModule],
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.scss'
})
export class NoResultsComponent {
  @Input() resultType: string;
  @Input() searchTerm: string;
}
