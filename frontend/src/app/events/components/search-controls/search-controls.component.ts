/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

export type SearchFields = {
  query: string | null;
  location: string | null;
};

@Component({
  selector: 'app-search-controls',
  templateUrl: './search-controls.component.html',
  styleUrls: ['./search-controls.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SearchControlsComponent
    }
  ]
})
export class SearchControlsComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = '';
  @Input() withButton = true;
  @Input() buttonText = '';

  disabled = false;
  isTouched = false;
  onChange: (value: SearchFields) => void = () => {};
  onTouched: () => void = () => {};

  @Output() search = new EventEmitter<void>();

  unsubscribe$ = new Subject();

  formGroup = new FormGroup({
    query: new FormControl<string>(''),
    location: new FormControl<string>('')
  });

  handleSubmit(): void {
    this.search.emit();
  }

  markAsTouched(): void {
    if (!this.isTouched) {
      this.isTouched = true;
      this.onTouched();
    }
  }

  ngOnInit(): void {
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.onChange({
          query: this.formGroup.value.query || '',
          location: this.formGroup.value.location || ''
        });
      }
    });
  }

  writeValue(value: SearchFields): void {
    this.formGroup.patchValue(value);
  }
  registerOnChange(fn: (value: SearchFields) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
