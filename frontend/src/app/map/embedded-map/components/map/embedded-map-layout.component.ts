import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from 'src/app/map/data/map.service';

@Component({
  selector: 'app-embedded-map-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="map-layout"
      [ngClass]="{
        'map-open': showFullMap(),
        'details-open': hasDetail()
      }"
    >
      <div class="content">
        <section class="map-wrapper">
          @if (hasDetail()) {
            <div class="details" [ngClass]="{ clickable: hasDetail() }">
              <div class="outlet">
                <ng-content select="[detailsDesktop]"></ng-content>
              </div>
            </div>
          }

          <ng-content select="[map]"></ng-content>
        </section>
      </div>
    </div>
  `
})
export class EmbeddedMapLayoutComponent {
  private mapService = inject(MapService);
  showFullMap = this.mapService.showFullMap;

  constructor() {}

  hasDetail(): boolean {
    return this.mapService.hasActiveCard();
  }
}
