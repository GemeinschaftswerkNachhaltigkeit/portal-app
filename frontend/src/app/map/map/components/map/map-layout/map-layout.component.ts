import { Component } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts } from '@angular/router';
import { slideInAnimation } from '../../../animations';
import { MapFacadeService } from '../../../../map-facade.service';

@Component({
  selector: 'app-map-layout',
  templateUrl: './map-layout.component.html',
  styleUrls: ['./map-layout.component.scss'],
  animations: [slideInAnimation]
})
export class MapLayoutComponent {
  showFullMap$ = this.facade.showFullMap$;

  constructor(
    private facade: MapFacadeService,
    private contexts: ChildrenOutletContexts,
    private route: ActivatedRoute
  ) {}

  hasDetail(): boolean {
    return this.facade.hasActiveCard();
  }

  toggleMap(): void {
    this.facade.toggleMap();
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }
}
