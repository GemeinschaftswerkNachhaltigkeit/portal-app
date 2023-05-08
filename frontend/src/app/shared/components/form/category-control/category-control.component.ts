/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ElementRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { LabeledKey } from '../../../models/labeled-key';

@Component({
  selector: 'app-category-control',
  templateUrl: './category-control.component.html',
  styleUrls: ['./category-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CategoryControlComponent
    }
  ]
})
export class CategoryControlComponent implements ControlValueAccessor {
  @Input() options: LabeledKey<string>[] = [];

  selectedOption: LabeledKey<string> | null = null;
  disabled = false;
  isTouched = false;
  onChange: (value: string) => void = (value) => {};
  onTouched: () => void = () => {};

  constructor(private elRef: ElementRef) {}

  selected(option: LabeledKey<string>): boolean {
    return option.key === this.selectedOption?.key;
  }

  setOption(option: LabeledKey<string>): void {
    this.markAsTouched();
    this.selectedOption = option;
    this.onChange(option.key);
  }

  markAsTouched(): void {
    if (!this.isTouched) {
      this.isTouched = true;
      this.onTouched();
    }
  }

  writeValue(value: string): void {
    this.selectedOption = this.options.find((o) => o.key === value) || null;
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
