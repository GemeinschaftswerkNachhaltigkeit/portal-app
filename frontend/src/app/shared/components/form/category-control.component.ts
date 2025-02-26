/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ElementRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LabeledKey } from '../../models/labeled-key';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OutlinedIconComponent } from '../base/outlined-icon.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-category-control',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    OutlinedIconComponent,
    MatFormFieldModule,
    TranslateModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CategoryControlComponent
    }
  ],
  template: `
    <div class="category-select">
      @for (option of options; track option) {
        <button
          type="button"
          mat-stroked-button
          color="warn"
          class="option"
          [ngClass]="{ selected: selected(option) }"
          [disabled]="disabled"
          (click)="setOption(option)"
        >
          <div class="button-wrapper">
            <span class="text">{{ option.label | translate }}</span>
            @if (selected(option)) {
              <app-outlined-icon>check</app-outlined-icon>
            }
          </div>
        </button>
      }
    </div>
    @if (isTouched && !selectedOption) {
      <div class="error">
        <mat-error>
          <span>{{ 'validationErrors.required' | translate }}</span>
        </mat-error>
      </div>
    }
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .category-select {
      display: flex;
      gap: $spacing-2;
      flex-wrap: wrap;
      .option {
        width: fit-content;
        border: 2px solid $bordeauxe;
        white-space: normal;
        text-align: left;

        .button-wrapper {
          display: flex;
          align-items: center;
          gap: $spacing-1;

          .text {
            margin-top: 2px;
          }
        }

        &.selected,
        &:hover {
          background-color: $bordeauxe;
          color: white;
        }

        mat-icon {
          margin-left: $spacing-2;
        }
      }
    }
    .error {
      margin-top: $spacing-2;
    }
  `
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
