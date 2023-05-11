import { Component } from '@angular/core';
import { MapFacadeService } from '../../../map-facade.service';

@Component({
  selector: 'app-embedded-map-container',
  templateUrl: './embedded-map-container.component.html',
  styleUrls: ['./embedded-map-container.component.scss']
})
export class EmbeddedMapContainerComponent {

  constructor(
    private mapFacade: MapFacadeService,
  ) { }

  markers$ = this.mapFacade.markers$;
  germanyCenter: L.LatLngTuple = [51.1642292, 10.4541194];

  mapMovedHandler(box: string): void {
    this.mapFacade.setBoundingBox(box);
  }


}
