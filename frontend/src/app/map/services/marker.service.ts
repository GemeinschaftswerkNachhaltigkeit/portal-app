/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import SearchResult from '../models/search-result';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { MapFacadeService } from '../map-facade.service';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import MarkerDto from '../models/markerDto';

const getIcon = (type: string, isActive = false, isHovered = false) => {
  const defaultIcon = L.divIcon({
    className: 'custom-pin',
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<div class="map-marker default ${
      isActive ? 'highlighted active' : ''
    } ${isHovered ? 'highlighted' : ''}"></div>`
  });

  const orgaIcon = L.divIcon({
    className: 'custom-pin',
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<div class="map-marker orga ${
      isActive ? 'highlighted active' : ''
    } ${isHovered ? 'highlighted' : ''}" >
      <div class="inner"></div>
    </div>`
  });

  const activityIcon = L.divIcon({
    className: 'custom-pin',
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<div class="map-marker activity ${
      isActive ? 'highlighted active ' : ''
    } ${isHovered ? 'highlighted' : ''}" >
      <div class="inner"></div>
    </div>`
  });

  if (type === 'ORGANISATION') {
    return orgaIcon;
  }
  if (type === 'ACTIVITY') {
    return activityIcon;
  }
  return defaultIcon;
};

const getClusterIcon = (
  count: number,
  type: string,
  highlightedClusterType: string
) => {
  const isHighlighted = type === highlightedClusterType;
  return L.divIcon({
    html: `<span class="cluster-marker ${type} ${
      isHighlighted ? 'highlighted' : ''
    }">
       ${count}
      </span>`,
    iconSize: new L.Point(40, 40)
  });
};

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  searchOnMove = true;
  organisationMarkers: L.MarkerClusterGroup | null = null;
  activityMarkers: L.MarkerClusterGroup | null = null;
  markers: {
    [key: string]: {
      marker: L.Marker;
      data: SearchResult;
    };
  } = {};
  markerActivated$ = new BehaviorSubject<SearchResult>({ resultType: '' });
  markerHovered$ = new BehaviorSubject<SearchResult>({
    resultType: ''
  });
  markerLeaved$ = new BehaviorSubject(null);

  constructor(
    private mapFacade: MapFacadeService,
    private utils: UtilsService
  ) {}

  makeMarkers(map: L.Map, data: MarkerDto[], mapWidth?: number): void {
    this.organisationMarkers?.clearLayers();
    this.activityMarkers?.clearLayers();
    const markerData = this.getMarkerData(data);

    this.activityMarkers = L.markerClusterGroup({
      iconCreateFunction: function (cluster) {
        return getClusterIcon(cluster.getChildCount(), 'ACTIVITY', '');
      },
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false
    });
    this.organisationMarkers = L.markerClusterGroup({
      iconCreateFunction: function (cluster: L.MarkerCluster) {
        return getClusterIcon(cluster.getChildCount(), 'ORGANISATION', '');
      },
      showCoverageOnHover: false,
      disableClusteringAtZoom: 12,
      spiderfyOnMaxZoom: false
    });

    for (const c of markerData) {
      const icon = getIcon(c.data.resultType);

      if (c.lat && c.lon) {
        const lon = c.lon;
        const lat = c.lat;
        const marker = L.marker([lat, lon], {
          icon: icon
        });
        marker.on('click', () =>
          this.markerClickHandler(map, c.data, data, mapWidth)
        );

        if (c.data.resultType === 'ACTIVITY') {
          this.activityMarkers.addLayer(marker);
        }
        if (c.data.resultType === 'ORGANISATION') {
          this.organisationMarkers.addLayer(marker);
        }
        this.markers[this.makerKey(c.data)] = {
          marker: marker,
          data: c.data
        };
      }
    }

    this.activityMarkers.addTo(map);
    this.organisationMarkers.addTo(map);
    this.setExitingActiveMarker(map, data);
  }

  makerKey(res: MarkerDto): string {
    return `${res.resultType}-${res.id}`;
  }

  getMarker(res: MarkerDto): { marker: L.Marker; data: SearchResult } | null {
    const m = this.markers[this.makerKey(res)];
    return m || null;
  }

  makeColoredMarkers(map: L.Map, data: MarkerDto[]): void {
    const markerData = this.getMarkerData(data);
    for (const c of markerData) {
      if (c.lat && c.lon) {
        const lon = c.lon;
        const lat = c.lat;
        const marker = L.marker([lat, lon]);
        marker.addTo(map);
      }
    }
  }

  triggerMarkerActivation(searchResult: SearchResult): void {
    this.markerActivated$.next(searchResult);
  }

  triggerMarkerHovered(searchResult: SearchResult): void {
    this.markerHovered$.next(searchResult);
  }

  triggerMarkerLeaved(): void {
    this.markerLeaved$.next(null);
  }

  markerClickHandler(
    map: L.Map,
    marker: MarkerDto,
    markers: MarkerDto[],
    mapWidth?: number
  ): void {
    this.mapFacade.openCard(marker.resultType, marker.id);
    // this.scrollToCard(marker.resultType, marker.id);

    this.activateMarker(map, marker, markers, mapWidth);
  }

  activateMarker(
    map: L.Map,
    res: SearchResult,
    markers: MarkerDto[],
    mapWidth?: number,
    move = true
  ): void {
    const marker = this.findMarker(markers, res);
    if (marker) {
      this.handleActiveMarker(
        map,
        this.getSingleMarkerData(marker),
        mapWidth,
        move
      );
    }
  }

  findMarker(markers: MarkerDto[], card?: SearchResult): MarkerDto | undefined {
    if (card) {
      return markers.find((m) => {
        if (card.resultType === 'ORGANISATION') {
          return m.resultType === 'ORGANISATION' && m.id === card.id;
        }
        if (card.resultType === 'ACTIVITY') {
          return m.resultType === 'ACTIVITY' && m.id === card.id;
        }
        return undefined;
      });
    }
    return;
  }

  setExitingActiveMarker(map: L.Map, markers: MarkerDto[]): void {
    const card = this.mapFacade.getActiveResult();
    const marker = this.findMarker(markers, card);
    if (card && marker) {
      this.handleActiveMarker(
        map,
        this.getSingleMarkerData(marker),
        undefined,
        false
      );
    }
  }
  hoverMarker(
    map: L.Map,
    searchResult: SearchResult,
    markers: MarkerDto[]
  ): void {
    const marker = this.findMarker(markers, searchResult);
    if (marker) {
      this.handlerHoveredMarker(map, this.getSingleMarkerData(marker).data);
    }
  }

  clearMarkerIcons(): void {
    Object.keys(this.markers).forEach((key) => {
      const marker = this.markers[key];

      if (marker) {
        const res = marker.data;
        const orgaCluster: any = this.organisationMarkers?.getVisibleParent(
          marker.marker
        );
        const actiCluster: any = this.activityMarkers?.getVisibleParent(
          marker.marker
        );
        if (
          orgaCluster &&
          orgaCluster.getChildCount &&
          res.resultType === 'ORGANISATION'
        ) {
          orgaCluster.setIcon(
            getClusterIcon(
              (orgaCluster as any).getChildCount(),
              'ORGANISATION',
              ''
            )
          );
        } else if (
          actiCluster &&
          actiCluster.getChildCount &&
          res.resultType === 'ACTIVITY'
        ) {
          actiCluster.setIcon(
            getClusterIcon((actiCluster as any).getChildCount(), 'ACTIVITY', '')
          );
        } else {
          const inactiveIcon = getIcon(marker.data.resultType);

          marker.marker.setIcon(inactiveIcon);
        }
      }
    });
  }

  setActiveMarkerIcon(res: MarkerDto, active = true, hover = false): void {
    this.clearMarkerIcons();
    const marker = this.getMarker(res)?.marker;
    if (marker) {
      const orgaCluster: any =
        this.organisationMarkers?.getVisibleParent(marker);
      const actiCluster: any = this.activityMarkers?.getVisibleParent(marker);
      if (
        orgaCluster &&
        orgaCluster.getChildCount &&
        res.resultType === 'ORGANISATION'
      ) {
        orgaCluster.setIcon(
          getClusterIcon(
            (orgaCluster as any).getChildCount(),
            'ORGANISATION',
            res.resultType
          )
        );
      } else if (
        actiCluster &&
        actiCluster.getChildCount &&
        res.resultType === 'ACTIVITY'
      ) {
        actiCluster.setIcon(
          getClusterIcon(
            (actiCluster as any).getChildCount(),
            'ACTIVITY',
            res.resultType
          )
        );
      } else {
        const activeIcon = getIcon(res.resultType, active, hover);

        marker?.setIcon(activeIcon);
      }
    }
  }

  // setHoveredMarkerIcon(res: SearchResult): void {
  //   this.clearMarkerIcons();
  //   const m = this.findMarker(res);
  //   const marker = this.getMarker(res)?.marker;
  //   const activeIcon = getIcon(res.resultType, true, true);
  //   marker?.setIcon(activeIcon);
  // }

  handlerHoveredMarker(map: L.Map, hoverdMarkerData: MarkerDto): void {
    if (hoverdMarkerData) {
      this.setActiveMarkerIcon(hoverdMarkerData, false, true);
    } else {
      this.clearMarkerIcons();
    }
  }

  handleActiveMarker(
    map: L.Map,
    activeMarker: { lon?: number; lat?: number; data: MarkerDto },
    mapWidth?: number,
    move = true
  ): void {
    this.setActiveMarkerIcon(activeMarker.data);
    if (move && activeMarker && activeMarker.lat && activeMarker.lon) {
      this.searchOnMove = false;
      const nextZoomLevel = map.getZoom();
      const lon = activeMarker.lon;
      const lat = activeMarker.lat;

      let f = map.getZoom() > 12 ? 0.0095 : 0.3;
      switch (map.getZoom()) {
        case 4:
          f = 84;
          break;
        case 5:
          f = 40;
          break;
        case 6:
          f = 20;
          break;
        case 7:
          f = 9.8;
          break;
        case 8:
          f = 5;
          break;
        case 9:
          f = 2.5;
          break;
        case 10:
          f = 1.2;
          break;
        case 11:
          f = 0.6;
          break;
        case 12:
          f = 0.3;
          break;
        case 13:
          f = 0.15;
          break;
        case 14:
          f = 0.08;
          break;
        case 15:
          f = 0.038;
          break;
        case 16:
          f = 0.018;
          break;
        case 17:
          f = 0.0095;
          break;
        default:
          f = 0;
      }

      const factor = mapWidth && mapWidth < 1200 ? 0 : f;

      const offset = -0.75 * factor;

      const newLon = lon + offset;

      map.setView([lat, newLon], nextZoomLevel);
      setTimeout(() => {
        this.searchOnMove = true;
      }, 1000);
      // this.scrollToCard(activeMarker.data.resultType, activeMarker.data.id);
    }
  }

  scrollToCard(type: string, id?: number) {
    this.utils.scrollToAnchor(`card-${type}${id}`, 200);
  }

  private getMarkerData(
    data: MarkerDto[]
  ): { lon?: number; lat?: number; data: MarkerDto }[] {
    return data.map((d) => {
      return this.getSingleMarkerData(d);
    });
  }

  getSingleMarkerData(marker: MarkerDto): {
    lon?: number;
    lat?: number;
    data: MarkerDto;
  } {
    let coordinates = {};
    if (marker && marker.coordinate && marker.coordinate.coordinates) {
      coordinates = {
        lon: marker.coordinate?.coordinates[1],
        lat: marker.coordinate?.coordinates[0]
      };
    }
    return {
      data: marker,
      ...coordinates
    };
  }
}
