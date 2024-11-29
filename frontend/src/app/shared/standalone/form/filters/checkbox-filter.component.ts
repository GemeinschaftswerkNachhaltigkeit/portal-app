import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import FilterOption from 'src/app/shared/models/filter-options';

@Component({
  selector: 'app-checkbox-filter',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, TranslateModule, FormsModule],
  template: `
    <ul class="filter-checkbox-entries">
      <li class="entry" *ngFor="let fv of filterValues">
        <mat-checkbox
          color="primary"
          [(ngModel)]="fv.checked"
          (ngModelChange)="checkBoxValueChangedHandler()"
        >
          <span class="label"
            ><span class="prefix" *ngIf="fv.labelPrefix">{{
              fv.labelPrefix
            }}</span
            >{{ fv.labelKey | translate }}</span
          >
        </mat-checkbox>
      </li>
    </ul>
  `,
  styles: `
    @use 'theme' as *;
    .filter-checkbox-entries {
      display: grid;
      gap: 0;
      padding: 0;
      margin: 0;

      .entry {
        list-style-type: none;
        width: 100%;
        .label {
          display: block;
          width: 230px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          @media screen and (min-width: 550px) {
            width: 400px;
          }
          @media screen and (min-width: 700px) {
            width: 500px;
          }
          @media screen and (min-width: 800px) {
            width: 600px;
          }
          @media screen and (min-width: 900px) {
            width: auto;
          }

          .prefix {
            margin-right: $spacing-2;
          }
        }
      }
    }
  `
})
export class CheckboxFilterComponent implements OnInit, OnChanges {
  @Input() options: FilterOption[] = [];
  @Output() valueChanged = new EventEmitter<FilterOption[]>();
  allComplete = false;
  filterValues: FilterOption[] = [];

  checkBoxValueChangedHandler() {
    this.valueChanged.emit(this.checkedValues());
  }

  private checkedValues(): FilterOption[] {
    return this.filterValues.filter((v) => v.checked);
  }

  private updateValues(key: string): FilterOption[] {
    const updatedOptionIndex = this.options.findIndex((o) => o.key === key);
    if (updatedOptionIndex !== -1) {
      const updatedOptions = [...this.options];
      updatedOptions[updatedOptionIndex] = {
        ...updatedOptions[updatedOptionIndex],
        checked: !updatedOptions[updatedOptionIndex]
      };
      return updatedOptions;
    } else {
      return this.options;
    }
  }

  ngOnInit(): void {
    this.filterValues = [...this.options];
  }

  ngOnChanges(): void {
    this.filterValues.forEach((fv) => {
      fv.checked = !!this.options.find((o) => o.key == fv.key)?.checked;
    });
  }
}
