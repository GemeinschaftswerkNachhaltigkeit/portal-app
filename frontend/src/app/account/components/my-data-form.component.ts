import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import UserDataForm from '../models/user-data-form';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-data-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormFieldErrorComponent,
    MatButtonModule,
    TranslateModule
],
  template: `
    <form
      class="form"
      novalidate
      (submit)="submitHandler()"
      [formGroup]="userForm"
    >
      <mat-form-field appearance="outline">
        <mat-label>{{ 'account.labels.firstName' | translate }}</mat-label>
        <input formControlName="firstName" matInput />
        <mat-error
          ><app-form-field-error
            [field]="userForm.get('firstName')"
          ></app-form-field-error
        ></mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>{{ 'account.labels.lastName' | translate }}</mat-label>
        <input formControlName="lastName" matInput />
        <mat-error
          ><app-form-field-error
            [field]="userForm.get('lastName')"
          ></app-form-field-error
        ></mat-error>
      </mat-form-field>
      <footer class="footer">
        <button type="submit" mat-flat-button color="accent">
          {{ 'account.buttons.saveUserData' | translate }}
        </button>

        <button
          type="button"
          mat-button
          color="accent"
          (click)="deleteHandler()"
        >
          {{ 'account.buttons.deleteAccount' | translate }}
        </button>
      </footer>
    </form>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    .form {
      max-width: 60rem;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 60rem;
    }
  `
})
export class MyDataFormComponent implements OnInit {
  @Input() userData: UserDataForm = {
    firstName: '',
    lastName: ''
  };
  @Output() submitted = new EventEmitter<UserDataForm>();
  @Output() delete = new EventEmitter<void>();
  userForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  submitHandler(): void {
    this.submitted.emit(this.userForm.value);
  }

  deleteHandler(): void {
    this.delete.emit();
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: this.fb.control(this.userData.firstName, [
        Validators.required
      ]),
      lastName: this.fb.control(this.userData.lastName, [Validators.required])
    });
  }
}
