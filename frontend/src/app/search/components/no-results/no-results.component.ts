import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllResultsLinkComponent } from '../all-results-link/all-results-link.component';

@Component({
  selector: 'app-no-results',
  standalone: true,
  imports: [CommonModule, SharedModule, AllResultsLinkComponent],
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.scss'
})
export class NoResultsComponent {
  @Input() resultType: string;
  @Input() searchTerm: string;
}
