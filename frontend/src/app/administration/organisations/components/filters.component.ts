
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DynamicFilters } from 'src/app/map/models/search-filter';

type SortTypes = 'oldestFirst' | 'newestFirst' | 'aToZ' | 'zToA';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    TranslateModule,
    MatMenuModule
],
  template: `
    <div class="filters">
      <form [formGroup]="filterForm" class="filter-form">
        <mat-form-field appearance="outline" color="primary" class="no-sub">
          <mat-label>{{ 'administration.labels.query' | translate }}</mat-label>
          <input matInput formControlName="query" />
          @if (filterForm.get('query')?.value) {
            <button
              matSuffix
              mat-icon-button
              aria-label="Clear"
              (click)="clearQuery()"
              type="button"
              >
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>
        <div class="additional-filters">
          <mat-checkbox formControlName="coordinates">{{
            'forms.labels.onlyNoCoordinates' | translate
          }}</mat-checkbox>
          <div>
            <button
              mat-flat-button
              [matMenuTriggerFor]="menu"
              aria-label="Sort menu button"
              >
              @if (sort === 'newestFirst') {
                <div class="sort-btn-content">
                  <mat-icon>sort</mat-icon>
                  <div>
                    {{ 'administration.buttons.newestFirst' | translate }}
                  </div>
                </div>
              }
              @if (sort === 'oldestFirst') {
                <div class="sort-btn-content">
                  <mat-icon>sort</mat-icon>
                  <div>
                    {{ 'administration.buttons.oldestFirst' | translate }}
                  </div>
                </div>
              }
              @if (sort === 'aToZ') {
                <div class="sort-btn-content">
                  <mat-icon>sort</mat-icon>
                  <div>{{ 'administration.buttons.aToZ' | translate }}</div>
                </div>
              }
              @if (sort === 'zToA') {
                <div class="sort-btn-content">
                  <mat-icon>sort</mat-icon>
                  <div>{{ 'administration.buttons.zToA' | translate }}</div>
                </div>
              }
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="setSortHandler('newestFirst')">
                <span>{{
                  'administration.buttons.newestFirst' | translate
                }}</span>
              </button>
              <button mat-menu-item (click)="setSortHandler('oldestFirst')">
                <span>{{
                  'administration.buttons.oldestFirst' | translate
                }}</span>
              </button>
              <button mat-menu-item (click)="setSortHandler('aToZ')">
                <span>{{ 'administration.buttons.aToZ' | translate }}</span>
              </button>
              <button mat-menu-item (click)="setSortHandler('zToA')">
                <span>{{ 'administration.buttons.zToA' | translate }}</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </form>
    </div>
    `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    .filters {
      display: flex;

      width: 100%;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: $spacing-8;
      gap: $spacing-2;
      align-items: center;

      .filter-form {
        flex-grow: 1;
        width: 100%;
      }

      .sort-btn-content {
        display: flex;
        align-items: center;
        gap: $spacing-2;
      }
    }

    @media screen and (min-width: $breakpoint-xs) {
      .filters {
        flex-direction: row;
        gap: $spacing-8;
        align-items: center;
        margin-bottom: $spacing-4;

        .filter-form {
          width: auto;
        }

        .additional-filters {
          display: flex;
          align-items: center;
          margin-top: $spacing-2;
          gap: $spacing-2;
          .sort-btn-content {
            display: flex;
            align-items: center;
            gap: $spacing-2;
          }
        }
      }
    }
  `
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
