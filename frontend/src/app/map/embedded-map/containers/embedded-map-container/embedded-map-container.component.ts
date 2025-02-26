import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmbeddedMapLayoutComponent } from '../../components/map/embedded-map-layout.component';
import { EmbeddedDetailsCardComponent } from '../embedded-details-card/embedded-details-card.component';
import { EmbeddedMapComponent } from '../../components/map/embedded-map.component';
import { MapService } from 'src/app/map/data/map.service';

@Component({
  selector: 'app-embedded-map-container',
  standalone: true,
  imports: [
    CommonModule,
    EmbeddedMapLayoutComponent,
    EmbeddedDetailsCardComponent,
    EmbeddedMapComponent
  ],
  templateUrl: './embedded-map-container.component.html',
  styleUrls: ['./embedded-map-container.component.scss']
})
export class EmbeddedMapContainerComponent implements OnInit {
  private mapService = inject(MapService);
  private route = inject(ActivatedRoute);

  zoom: number | undefined;
  center: L.LatLngTuple = [0, 0];

  constructor() {}

  markers = this.mapService.markers;

  ngOnInit() {
    // get center from url and trim spaces. If it does not exist use Germanys center point.
    const centerFromURL = <L.LatLngTuple | undefined>(
      this.route.snapshot.queryParamMap
        .get('center')
        ?.split(',')
        .map((item: string) => item.trim())
    );
    const germanyCenter: L.LatLngTuple = [51.1642292, 10.4541194];
    this.center = centerFromURL ? centerFromURL : germanyCenter;

    // get zoom level from url
    this.zoom = <number | undefined>(
      (this.route.snapshot.queryParamMap.get('zoom') as unknown)
    );

    this.mapService.setEmbedded(true);
    this.mapService.setInitalFilters();
    this.mapService.search();
  }

  mapMovedHandler(box: string): void {
    this.mapService.setBoundingBox(box);
  }
}
