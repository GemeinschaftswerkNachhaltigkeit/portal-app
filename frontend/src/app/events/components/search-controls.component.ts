/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

export type SearchFields = {
  query: string | null;
  location: string | null;
};

@Component({
  selector: 'app-search-controls',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatButtonModule, TranslateModule],
  template: `
    <form [formGroup]="formGroup" class="search-form" (submit)="handleSubmit()">
      <div class="input-wrapper">
        <input
          class="search-field"
          [placeholder]="'forms.labels.query' | translate"
          formControlName="query"
        />
        <input
          class="search-field"
          [placeholder]="'forms.labels.location' | translate"
          formControlName="location"
        />
      </div>
      <button type="submit" class="button" mat-flat-button color="accent">
        {{ buttonText || 'btn.search' | translate }}
      </button>
    </form>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    :host {
      flex-shrink: 1;
      flex-grow: 1;
      display: flex;
    }

    .search-form {
      display: flex;
      gap: $spacing-1;
      flex-shrink: 1;
      flex-grow: 1;
      .input-wrapper {
        display: flex;
        gap: $spacing-2;
        flex-shrink: 1;
        flex-grow: 1;
        position: relative;
        .search-field {
          border: 1px solid $blue-navy;
          outline: none;
          height: 4rem;
          padding: $spacing-1 $spacing-2;
          color: $blue-navy;
          width: 100%;
          &:active,
          &:focus {
            box-shadow: 0 0 0 1px $blue-navy inset;
          }
        }
        .clear-btn {
          position: absolute;
          width: 3.6rem;
          height: 3.6rem;
          top: 0.2rem;
          right: 0.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          border: none;
          outline: none;
          color: $blue-navy;
        }
      }
      .button {
        height: 4rem;
        flex-shrink: 0;
      }
    }
  `,
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
