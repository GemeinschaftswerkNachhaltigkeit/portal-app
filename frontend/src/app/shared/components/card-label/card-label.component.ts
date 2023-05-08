import { Component, Input } from '@angular/core';
import { CardService } from '../../../map/services/card.service';

@Component({
  selector: 'app-card-label',
  templateUrl: './card-label.component.html',
  styleUrls: ['./card-label.component.scss']
})
export class CardLabelComponent {
  @Input() type?: string;
  @Input() organisationTypeLabel? = '';
  @Input() activityTypeLabel? = '';
  @Input() limitedWidth? = false;
  @Input() dan? = false;

  constructor(public card: CardService) {}
}
