/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslateModule
],
  template: `
    <form class="search-form" (submit)="handleSubmit()">
      <div class="input-wrapper">
        <input
          class="search-field large"
          [placeholder]="placeholder"
          [value]="value"
          (keyup)="handleChange($event)"
          name="query"
          />
        @if (value) {
          <button
            type="button"
            class="clear-btn"
            (click)="handleClear()"
            >
            <mat-icon>clear</mat-icon>
          </button>
        }
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
      }
    }
  `
})
export class SearchInputComponent {
  @Input() placeholder = '';
  @Input() withButton = true;
  @Input() buttonText = '';
  @Input() value = '';

  @Output() search = new EventEmitter<string>();
  @Output() searchValueChanged = new EventEmitter<string>();

  handleClear(): void {
    this.searchValueChanged.emit('');
    this.search.emit('');
  }

  handleSubmit(): void {
    this.search.emit(this.value);
  }

  handleChange($event: any): void {
    this.searchValueChanged.emit($event.target.value);
  }
}
