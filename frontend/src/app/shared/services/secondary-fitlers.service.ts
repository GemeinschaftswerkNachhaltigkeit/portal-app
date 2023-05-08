import { Injectable } from '@angular/core';
import { SecondaryFilters } from '../components/form/filters/secondary-filters/secondary-filters.component';

@Injectable({
  providedIn: 'root'
})
export class SecondaryFitlersService {
  private ctx = '';
  private openFilters: { [key: string]: SecondaryFilters[] } = {};

  setOpenFilters(ctx: string, filters: SecondaryFilters[]): void {
    this.ctx = ctx;
    if (this.ctx) {
      this.openFilters[this.ctx] = filters;
    }
  }

  filterOpen(filter: SecondaryFilters): boolean {
    if (!this.ctx) {
      return false;
    }
    return this.openFilters[this.ctx].includes(filter);
  }
}
