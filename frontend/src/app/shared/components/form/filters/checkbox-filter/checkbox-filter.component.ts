import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import FilterOption from 'src/app/shared/models/filter-options';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.scss']
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
