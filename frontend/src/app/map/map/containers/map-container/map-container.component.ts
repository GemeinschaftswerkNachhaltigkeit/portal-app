import {
  trigger,
  transition,
  style,
  animate,
  stagger,
  query
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionFacadeService } from 'src/app/shared/components/subscription/subscription-facade.service';
import { defaultPaginatorOptions } from 'src/app/shared/models/paging';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SecondaryFitlersService } from 'src/app/shared/services/secondary-fitlers.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InternalMapFacade } from '../../../map-facade.service';
import { DynamicFilters } from '../../../models/search-filter';
import SearchResult from '../../../models/search-result';
import { SharedMarkerService } from '../../../services/marker.service';

@Component({
  selector: 'app-map-container',
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
  loading$ = this.loading.isLoading$('map-search');

  constructor(
    private mapFacade: InternalMapFacade,
    private loading: LoadingService,
    private route: ActivatedRoute,
    private marker: SharedMarkerService,
    public subscription: SubscriptionFacadeService,
    public utils: UtilsService,
    filtersService: SecondaryFitlersService
  ) {
    filtersService.setOpenFilters('map-filters', []);
  }

  /*
  Our client wants to have custom paging options for map search
  */
  pageSize = defaultPaginatorOptions.pageSize;
  pageSizeOptions = [5, 10, 25, 100, 250, 500]; //defaultPaginatorOptions.pageSizeOptions;
  active = '';

  germanyCenter: L.LatLngTuple = [51.1642292, 10.4541194];
  searchResults$ = this.mapFacade.searchResults$;
  searchPaging$ = this.mapFacade.searchPaging$;
  markers$ = this.mapFacade.markers$;
  filters$ = this.mapFacade.filters$;
  mapInitialised$ = this.mapFacade.mapInitialised$;

  ngOnInit(): void {
    this.mapFacade.setEmbedded(false);
    this.mapFacade.setInitalFilters();
    this.mapFacade.search();

    this.route.queryParams.subscribe((params) => {
      this.mapFacade.setActiveCard({
        type: params['type'],
        id: +params['id']
      });
    });
  }

  searchChangedHandler(searchFilter: DynamicFilters): void {
    this.mapFacade.setActiveCard(undefined);
    this.mapFacade.search(searchFilter);
  }

  pageChangedHandler(event: PageEvent): void {
    this.mapFacade.changePage(event.pageIndex, event.pageSize);
  }

  mapMovedHandler(box: string): void {
    this.mapFacade.setBoundingBox(box);
  }

  isActive(result: SearchResult): boolean {
    return this.mapFacade.isActiveCard(result.resultType, result.id);
  }

  openCard(result: SearchResult): void {
    this.mapFacade.openCard(result.resultType, result.id);
    this.marker.triggerMarkerActivation(result);
  }

  cardHover(result: SearchResult): void {
    this.mapFacade.setHoveredCard({
      type: result?.resultType || '',
      id: result?.id
    });
    this.marker.triggerMarkerHovered(result);
  }
  clearHovered(): void {
    this.mapFacade.clearHoveredCard();
    this.marker.triggerMarkerLeaved();
  }
}
