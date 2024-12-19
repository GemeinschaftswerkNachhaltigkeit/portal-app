import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import SearchResult from '../models/search-result';
import { CardService } from '../services/card.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-details-link',
  standalone: true,
  imports: [RouterModule],
  template: `
    <a
      rel="noopener"
      [href]="
        card.isOrga(currentResult?.resultType)
          ? contextPath + 'organisations/' + currentResult?.id
          : contextPath +
            'organisations/' +
            currentResult?.organisation?.id +
            '/' +
            currentResult?.id
      "
      target="_blank"
    >
      <ng-content></ng-content>
    </a>
  `,
  styles: `
    :host {
      position: relative;
      z-index: 1;
      a {
        text-decoration: none;
      }
    }
  `
})
export class DetailsLinkComponent {
  @Input() currentResult?: SearchResult;
  contextPath = environment.contextPath;
  constructor(public card: CardService) {}
}
