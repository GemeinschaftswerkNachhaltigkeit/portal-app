import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
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
import { SharedMarkerService } from '../../../services/marker.service';
import { MapZoomService } from 'src/app/map/services/map-zoom.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapRef') mapRef: ElementRef<HTMLDivElement> | null = null;
  @Input() data: MarkerDto[] = [];
  @Input() center?: L.LatLngTuple;
  @Output() mapMoved = new EventEmitter<string>();
  private map: L.Map | null = null;
  unsubscribe$ = new Subject();
  mapMoves = new BehaviorSubject<string>('');
  mapInitialized = false;

  constructor(
    private marker: SharedMarkerService,
    private zoomService: MapZoomService
  ) {}

  private getScreenWidth(): number | undefined {
    return this.mapRef?.nativeElement?.offsetWidth;
  }

  private initMap(): void {
    const screenWidth = this.getScreenWidth();
    this.map = L.map('map', {
      center: this.center,
      zoom:
        screenWidth && screenWidth < 1200 ? this.zoomService.defaultZoom : 8,
      // minZoom: 4,
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
    this.zoomService.mapZoomResetted
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.zoomOutHandler();
      });

    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
    if (this.map) {
      const map = this.map;
      const screenWidth = this.mapRef?.nativeElement?.offsetWidth;
      if (screenWidth && screenWidth > 1199) {
        this.map.fitBounds(this.map.getBounds(), {
          paddingTopLeft: [800, 10]
        });
      }

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
          const screenWidth = this.getScreenWidth();

          console.log('>> screenWidth', screenWidth);
          if (screenWidth && screenWidth < 1200) {
            box = 'mobile';
          }
          console.log('>> BOX', box);

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
            true
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
      const screenWidth = this.getScreenWidth();
      const zoom =
        screenWidth && screenWidth < 1200 ? this.zoomService.defaultZoom : 6;
      this.map?.setView(this.center, zoom);
    }
  }

  ngOnChanges(): void {
    if (this.map) {
      this.marker.makeMarkers(
        this.map,
        this.data,
        this.mapRef?.nativeElement?.offsetWidth,
        true
      );
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
