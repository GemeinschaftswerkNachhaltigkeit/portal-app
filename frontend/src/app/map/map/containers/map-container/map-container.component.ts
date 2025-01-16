import {
  trigger,
  transition,
  style,
  animate,
  stagger,
  query
} from '@angular/animations';
import { Component, inject, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { DynamicFilters } from '../../../models/search-filter';
import SearchResult from '../../../models/search-result';
import { MarkerService } from '../../../data/marker.service';
import { MapZoomService } from 'src/app/map/data/map-zoom.service';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from '../../components/search-form.component';
import { MapLayoutComponent } from '../../components/map/map-layout.component';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { AlertComponent } from 'src/app/shared/components/base/alert.component';
import { MatButtonModule } from '@angular/material/button';
import { PaginatorWrapperComponent } from '../../components/map/paginator-wrapper.component';
import { BaseCardComponent } from 'src/app/shared/components/cards/base-card/base-card.component';
import { OrgaBadgesComponent } from 'src/app/shared/components/base/badges/orga-badges.component';
import { EventBadgesComponent } from 'src/app/shared/components/base/badges/event-badges.component copy';
import { MapComponent } from '../../components/map/map.component';
import { TranslateModule } from '@ngx-translate/core';
import { DetailsCardComponent } from '../details-card/details-card.component';
import { MapService } from 'src/app/map/data/map.service';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';

@Component({
  selector: 'app-map-container',
  standalone: true,
  imports: [
    CommonModule,
    SearchFormComponent,
    MapLayoutComponent,
    LoadingIndicatorComponent,
    AlertComponent,
    MatButtonModule,
    PaginatorWrapperComponent,
    MatPaginatorModule,
    BaseCardComponent,
    OrgaBadgesComponent,
    EventBadgesComponent,
    MapComponent,
    TranslateModule,
    DetailsCardComponent,
    SpinnerComponent
  ],
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss'],
  animations: [
    trigger('addRemove', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ transform: 'translateX(-200px)', opacity: 0 }),
            stagger(50, [
              animate('200ms cubic-bezier(0.35, 0, 0.25, 1)'),
              style({ transform: 'translateX(0px)', opacity: 1 })
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class MapContainerComponent implements OnInit {
  filtersService = inject(SecondaryFitlersService);
  mapService = inject(MapService);
  private route = inject(ActivatedRoute);
  private marker = inject(MarkerService);
  public subscription = inject(SubscriptionFacadeService);
  public utils = inject(UtilsService);
  private zoomService = inject(MapZoomService);
  loading = this.mapService.loading;

  constructor() {
    this.filtersService.setOpenFilters('map-filters', []);
  }

  /*
  Our client wants to have custom paging options for map search
  */
  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = [5, 10, 25, 100, 250, 500]; //defaultPaginatorOptions.pageSizeOptions;
  active = '';

  germanyCenter: L.LatLngTuple = [51.1642292, 10.4541194];
  searchResults = this.mapService.searchResults;
  searchPaging = this.mapService.searchResultsPaging;
  markers = this.mapService.markers;
  filters = this.mapService.filters;
  mapInitialised = this.mapService.mapInitialised;

  ngOnInit(): void {
    this.mapService.setEmbedded(false);
    this.mapService.setInitalFilters();
    this.mapService.search();

    this.route.queryParams.subscribe((params) => {
      this.mapService.setActiveCard({
        type: params['type'],
        id: +params['id']
      });
    });
  }

  searchChangedHandler(searchFilter: DynamicFilters): void {
    this.mapService.setActiveCard(undefined);
    this.mapService.search(searchFilter);
  }

  pageChangedHandler(event: PageEvent): void {
    this.mapService.changePage(event.pageIndex, event.pageSize);
  }

  mapMovedHandler(box: string): void {
    this.mapService.setBoundingBox(box);
    this.mapService.search();
  }

  isActive(result: SearchResult): boolean {
    return this.mapService.isActiveCard(result.resultType, result.id);
  }

  openCard(result: SearchResult): void {
    this.mapService.openCard(result.resultType, result.id);
    this.marker.triggerMarkerActivation(result);
  }

  cardHover(result: SearchResult): void {
    this.mapService.setHoveredCard({
      type: result?.resultType || '',
      id: result?.id
    });
    this.marker.triggerMarkerHovered(result);
  }
  clearHovered(): void {
    this.mapService.clearHoveredCard();
    this.marker.triggerMarkerLeaved();
  }
  resetZoomHandler(): void {
    this.zoomService.resetMapZoom();
  }
}
