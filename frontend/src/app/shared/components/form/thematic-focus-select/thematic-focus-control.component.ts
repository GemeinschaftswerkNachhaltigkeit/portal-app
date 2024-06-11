/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ThematicFocus } from '../../../models/thematic-focus';

@Component({
  selector: 'app-thematic-focus-control',
  templateUrl: './thematic-focus-control.component.html',
  styleUrls: ['./thematic-focus-control.component.scss']
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
