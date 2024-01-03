import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-all-results-link',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './all-results-link.component.html',
  styleUrl: './all-results-link.component.scss'
})
export class AllResultsLinkComponent {
  @Input() resultType: string;
}
