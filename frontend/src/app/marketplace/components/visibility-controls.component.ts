import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { ValidCheckComponent } from 'src/app/shared/components/form/valid-check.component';

@Component({
  selector: 'app-visibility-controls',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ValidCheckComponent,
    FormFieldErrorComponent,
    MatInputModule
  ],
  template: `
    <ng-container [formGroup]="form">
      <div class="address">
        <mat-checkbox matInput formControlName="featured"
          ><span>{{
            'marketplace.labels.featured' | translate
          }}</span></mat-checkbox
        >
        <mat-form-field
          appearance="outline"
          *ngIf="form.get('featured')?.value"
        >
          <mat-label>{{
            'marketplace.labels.featuredText' | translate
          }}</mat-label>
          <input matInput formControlName="featuredText" />
          <app-valid-check
            [form]="form"
            controlName="featuredText"
          ></app-valid-check>

          <mat-error>
            <app-form-field-error
              [field]="form.get('featuredText')"
            ></app-form-field-error>
          </mat-error>
        </mat-form-field>
      </div>
    </ng-container>
  `
})
export class VisibilityControlsComponent implements OnInit, OnDestroy {
  @Input() formGroupName!: string;
  form!: FormGroup;
  unsubscribe = new Subject();

  constructor(private rootFormGroup: FormGroupDirective) {}

  handleVisibilityChange(): void {
    this.form
      .get('featured')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe))
      .subscribe((val) => {
        if (!val) {
          this.form.get('featuredText')?.setValue(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.handleVisibilityChange();
  }
}
