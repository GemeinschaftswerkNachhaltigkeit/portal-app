import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
<<<<<<< HEAD:frontend/src/app/map/components/details-link/details-link.component.ts
import SearchResult from '../../models/search-result';
import { CardService } from '../../services/card.service';
=======
import SearchResult from '../../../../shared/models/search-result';
import { CardService } from '../../../../services/card.service';
>>>>>>> add EmbeddedDetailsCardComponent:frontend/src/app/map/map/components/map/details-link/details-link.component.ts

@Component({
  selector: 'app-details-link',
  templateUrl: './details-link.component.html',
  styleUrls: ['./details-link.component.scss']
})
export class DetailsLinkComponent {
  @Input() currentResult?: SearchResult;
  contextPath = environment.contextPath;
  constructor(public card: CardService) {}
}
