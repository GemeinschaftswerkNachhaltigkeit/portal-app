import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() route: string[] | undefined = undefined;
  @Input() extUrl: string | undefined = undefined;
  @Input() withTitle = true;
  @Input() minHeight = 'none';
  @Input() noPadding = false;
  @Input() noHover = false;
  @Input() new? = false;
}
