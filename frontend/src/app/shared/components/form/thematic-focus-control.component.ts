/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ThematicFocus } from '../../models/thematic-focus';

import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormFieldErrorComponent } from './form-field-error/form-field-error.component';

@Component({
  selector: 'app-thematic-focus-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormFieldErrorComponent
],
  template: `
    <div class="select-wrapper">
      <mat-form-field appearance="outline">
        <mat-label>{{ label }}</mat-label>
        <mat-select [formControl]="formControl" multiple>
          @for (thema of thematicFocusOpts; track thema) {
            <mat-option
              [value]="thema"
              [disabled]="setOptionDisabled(thema)"
              >
              {{ 'thematicFocus.' + thema | translate }}
            </mat-option>
          }
        </mat-select>
        <mat-error>
          <app-form-field-error [field]="formControl"></app-form-field-error>
        </mat-error>
      </mat-form-field>
    </div>
    `,
  styles: `
    :host {
      width: 100%;
      display: block;
    }
  `
})
export class ThematicFocusControlComponent implements OnInit {
  thematicFocusOpts = Object.values(ThematicFocus);
  @Input() controlName!: string;
  @Input() maxSelectable? = this.thematicFocusOpts.length;
  @Input() label = this.thematicFocusOpts.length;
  selectedValues = new Set();

  formControl!: FormControl;

  unsubscribe$ = new Subject();

  onChange: (selectedValue: string[] | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.formControl = this.rootFormGroup.control.get(
      this.controlName
    ) as FormControl;
    this.selectedValues.clear();
    this.addValues(this.formControl.value);
    this.formControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((values: ThematicFocus[]) => {
        this.selectedValues.clear();
        this.addValues(values);
      });
  }

  private addValues(values: ThematicFocus[]): void {
    values.forEach((v) => this.selectedValues.add(v));
  }

  setOptionDisabled(value: ThematicFocus): boolean {
    if (!this.maxSelectable) return false;
    return (
      this.selectedValues.size >= this.maxSelectable &&
      !this.selectedValues.has(value)
    );
  }
}
