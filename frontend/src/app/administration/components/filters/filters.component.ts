import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DynamicFilters } from 'src/app/map/models/search-filter';

type SortTypes = 'oldestFirst' | 'newestFirst' | 'aToZ' | 'zToA';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Input() filters: DynamicFilters | null = {};
  @Output() filtersChanged = new EventEmitter<DynamicFilters>();
  @Output() sortChanged = new EventEmitter<string>();
  filterForm: FormGroup;

  sort: SortTypes = 'newestFirst';

  constructor(fb: FormBuilder) {
    this.filterForm = fb.group({
      query: fb.control(''),
      coordinates: false
    });
  }

  setSortHandler(sortType: SortTypes = 'oldestFirst'): void {
    this.sort = sortType;
    let sortParam = `createdAt,desc`;
    if (sortType === 'oldestFirst') {
      sortParam = `createdAt,asc`;
    }
    if (sortType === 'newestFirst') {
      sortParam = `createdAt,desc`;
    }
    if (sortType === 'aToZ') {
      sortParam = `name,asc`;
    }
    if (sortType === 'zToA') {
      sortParam = `name,desc`;
    }
    this.sortChanged.emit(sortParam);
  }

  clearQuery(): void {
    this.filterForm.get('query')?.reset();
  }

  private emitFilters(): void {
    const values = this.filterForm.value;
    this.filtersChanged.emit(values);
  }

  private setActiveFilters(): void {
    if (this.filters) {
      this.filterForm.patchValue(this.filters);
    }
  }

  ngOnInit(): void {
    this.setActiveFilters();
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.emitFilters();
      });
  }
}
