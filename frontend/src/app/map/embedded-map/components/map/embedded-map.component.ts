import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil
} from 'rxjs';
import MarkerDto from '../../../models/markerDto';
import SearchResult from '../../../models/search-result';
import { MarkerService } from '../../../data/marker.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-embedded-map',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="map-container" #mapRef>
      <div class="map-frame">
        <div id="map"></div>
      </div>
      <button class="zoomOutBtn" (click)="zoomOutHandler()">
        <mat-icon>zoom_out_map</mat-icon>
      </button>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .map-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .map-frame {
      height: 100%;
    }

    #map {
      height: 100%;
      font-size: 1.4rem;
    }

    .zoomOutBtn {
      width: 33px;
      height: 33px;
      border-radius: 4px;
      position: absolute;
      right: 10px;
      bottom: 100px;
      z-index: 1000;
      background-color: white;
      border: 2px solid #aaaaaa;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      &:hover {
        background-color: #eeeeee;
        cursor: pointer;
      }
      mat-icon {
        transform: scale(0.8);
      }
    }
  `
})
export class EmbeddedMapComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  private marker = inject(MarkerService);

  @ViewChild('mapRef') mapRef: ElementRef<HTMLDivElement> | null = null;
  @Input() data: MarkerDto[] = [];
  @Input() center?: L.LatLngTuple;
  @Input() zoom?: number | undefined;
  @Output() mapMoved = new EventEmitter<string>();
  private map: L.Map | null = null;
  unsubscribe$ = new Subject();
  mapMoves = new BehaviorSubject<string>('');
  mapInitialized = false;

  constructor() {}

  private getScreenWidth(): number | undefined {
    return this.mapRef?.nativeElement?.offsetWidth;
  }

  private initMap(): void {
    const screenWidth = this.getScreenWidth();
    this.map = L.map('map', {
      center: this.center,
      zoom: this.zoom // in case zoom is provided in URL, use it. Otherwise set it depending on screenwidth.
        ? this.zoom
        : screenWidth && screenWidth < 1200
          ? 6
          : 7,
      maxZoom: 17
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    );
    this.map.zoomControl.setPosition('bottomright');

    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
    if (this.map) {
      const map = this.map;
      // const screenWidth = this.mapRef?.nativeElement?.offsetWidth;

      this.map.on('moveend', () => {
        this.marker.setExitingActiveMarker(map, this.data);
        if (this.marker.searchOnMove) {
          this.mapMoves.next(map.getBounds().toBBoxString());
          this.mapInitialized = true;
        }
      });

      if (!this.mapInitialized) {
        this.mapMoves.next(map.getBounds().toBBoxString());
        this.mapInitialized = true;
      }

      this.mapMoves
        .asObservable()
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((box: string) => {
          this.mapMoved.emit(box);
        });
    }
    this.marker.markerActivated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchResult: SearchResult) => {
        if (this.map) {
          this.marker.activateMarker(
            this.map,
            searchResult,
            this.data,
            this.mapRef?.nativeElement?.offsetWidth,
            false
          );
        }
      });
    this.marker.markerHovered$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((searchResult: SearchResult) => {
        if (this.map) {
          this.marker.hoverMarker(this.map, searchResult, this.data);
        }
      });
    this.marker.markerLeaved$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.map) {
          this.marker.clearMarkerIcons();
          this.marker.setExitingActiveMarker(this.map, this.data);
        }
      });
  }

  zoomOutHandler(): void {
    if (this.map && this.center) {
      this.map?.setView(this.center, 4);
    }
  }

  ngOnChanges(): void {
    if (this.map) {
      this.marker.makeMarkers(
        this.map,
        this.data,
        this.mapRef?.nativeElement?.offsetWidth,
        false
      );
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
