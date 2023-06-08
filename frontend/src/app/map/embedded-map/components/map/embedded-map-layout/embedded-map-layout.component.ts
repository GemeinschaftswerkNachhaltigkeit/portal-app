import { Component } from '@angular/core';
import { EmbeddedMapFacade } from '../../../../map-facade.service';

@Component({
  selector: 'app-embedded-map-layout',
  templateUrl: './embedded-map-layout.component.html',
  styleUrls: ['./embedded-map-layout.component.scss']
})
export class EmbeddedMapLayoutComponent {
  showFullMap$ = this.facade.showFullMap$;

  constructor(private facade: EmbeddedMapFacade) {}

  hasDetail(): boolean {
    return this.facade.hasActiveCard();
  }
}
