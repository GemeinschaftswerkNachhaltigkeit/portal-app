import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DynamicFilters } from '../../map/models/search-filter';

@Injectable({
  providedIn: 'root'
})
export class PersistFiltersService {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  setFiltersToUrl(
    filters: {
      [key: string]: string | number | boolean | string[] | number[];
    },
    path: string[] = []
  ): void {
    this.router.navigate(path, {
      queryParams: {
        ...filters
      },
      replaceUrl: true,
      relativeTo: this.route
    });
  }

  getFiltersFromUrl(lists: string[] = []): DynamicFilters {
    const queryParams: ParamMap = this.route.snapshot.queryParamMap;
    const filters: DynamicFilters = {};
    queryParams.keys.forEach((key) => {
      const values = queryParams.getAll(key);
      let value: string | string[] | boolean =
        values.length > 1 ? values : values[0];
      if (value === 'true' || value === 'false') {
        value = value === 'true';
      }
      lists.forEach((l) => {
        if (key === l) {
          if (value && typeof value === 'string') {
            value = [value as string];
          }
          if (!value) {
            value = [];
          }
        }
      });
      filters[key] = value || '';
    });

    return filters;
  }
}
