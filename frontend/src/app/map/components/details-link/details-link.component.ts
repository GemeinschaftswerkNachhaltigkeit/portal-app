import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import SearchResult from '../../models/search-result';
import { CardService } from '../../services/card.service';

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
