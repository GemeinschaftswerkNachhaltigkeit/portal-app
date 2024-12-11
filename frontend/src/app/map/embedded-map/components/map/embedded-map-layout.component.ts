import { Component } from '@angular/core';
import { EmbeddedMapFacade } from '../../../map-facade.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-embedded-map-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="map-layout"
      [ngClass]="{
        'map-open': (showFullMap$ | async),
        'details-open': hasDetail()
      }"
    >
      <div class="content">
        <section class="map-wrapper">
          <div
            class="details"
            [ngClass]="{ clickable: hasDetail() }"
            *ngIf="hasDetail()"
          >
            <div class="outlet">
              <ng-content select="[detailsDesktop]"></ng-content>
            </div>
          </div>

          <ng-content select="[map]"></ng-content>
        </section>
      </div>
    </div>
  `
})
export class EmbeddedMapLayoutComponent {
  showFullMap$ = this.facade.showFullMap$;

  constructor(private facade: EmbeddedMapFacade) {}

  hasDetail(): boolean {
    return this.facade.hasActiveCard();
  }
}
