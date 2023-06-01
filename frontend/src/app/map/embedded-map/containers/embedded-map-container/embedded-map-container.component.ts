import { Component, OnInit } from '@angular/core';
import { EmbeddedMapFacade } from '../../../map-facade.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-embedded-map-container',
  templateUrl: './embedded-map-container.component.html',
  styleUrls: ['./embedded-map-container.component.scss']
})
export class EmbeddedMapContainerComponent implements OnInit{
  zoom: number | undefined;
  center: L.LatLngTuple = [0,0];

  constructor(
    private mapFacade: EmbeddedMapFacade,
    private readonly route: ActivatedRoute,
  ) { }

  markers$ = this.mapFacade.markers$;


  ngOnInit() {
    // get center from url and trim spaces. If it does not exist use Germanys center point.
    const centerFromURL = <L.LatLngTuple | undefined>this.route.snapshot.queryParamMap.get('center')?.split(',').map((item: string) => item.trim());
    const germanyCenter: L.LatLngTuple = [51.1642292,10.4541194];
    this.center = centerFromURL ? centerFromURL : germanyCenter;

    // get zoom level from url
    this.zoom = <number | undefined>(this.route.snapshot.queryParamMap.get('zoom') as unknown);

    this.mapFacade.setEmbedded(true);
    this.mapFacade.setInitalFilters();
    this.mapFacade.search();
  }

  mapMovedHandler(box: string): void {
    this.mapFacade.setBoundingBox(box);
  }


}
