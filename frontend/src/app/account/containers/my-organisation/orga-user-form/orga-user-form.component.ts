import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { UserType } from 'src/app/shared/models/user-type';
import { OrgaFacadeService } from 'src/app/account/orga-facade.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldErrorComponent } from 'src/app/shared/components/form/form-field-error/form-field-error.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-orga-user-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    HeadingComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormFieldErrorComponent,
    MatSelectModule
  ],
  template: `
    <div class="form-wrapper">
      <app-heading size="sm" type="h2" color="none">{{
        'account.titles.orgaUserForm' | translate
      }}</app-heading>
      <p class="hint">{{ 'account.texts.addUserHint' | translate }}</p>
      <form
        class="add-user-form"
        novalidate
        [formGroup]="userForm"
        (submit)="submitHandler(formDirective)"
        #formDirective="ngForm"
        >
        <div class="names">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'account.labels.firstName' | translate }}</mat-label>
            <input matInput formControlName="firstName" />
    
            <mat-error>
              <app-form-field-error
                [field]="userForm.get('firstName')"
              ></app-form-field-error>
            </mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'account.labels.lastName' | translate }}</mat-label>
            <input matInput formControlName="lastName" />
    
            <mat-error>
              <app-form-field-error
                [field]="userForm.get('lastName')"
              ></app-form-field-error>
            </mat-error>
          </mat-form-field>
        </div>
        <div class="other-form-fields">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'account.labels.email' | translate }}</mat-label>
            <input matInput formControlName="email" />
    
            <mat-error>
              <app-form-field-error
                [field]="userForm.get('email')"
              ></app-form-field-error>
            </mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'account.labels.userType' | translate }}</mat-label>
            <mat-select formControlName="userType">
              @for (type of userTypes; track type) {
                <mat-option [value]="type">
                  {{ 'account.labels.' + type | translate }}
                </mat-option>
              }
            </mat-select>
            <mat-error>
              <app-form-field-error
                [field]="userForm.get('userType')"
              ></app-form-field-error>
            </mat-error>
          </mat-form-field>
          <div class="button-wrapper">
            <button
              class="submit-button"
              mat-flat-button
              color="accent"
              [disabled]="userForm.invalid || (isLoading$ | async) === true"
              >
              @if ((isLoading$ | async) === false) {
                <span>{{
                  'account.buttons.addNewUser' | translate
                }}</span>
              }
              @if ((isLoading$ | async) === true) {
                <span>{{
                  'btn.loading' | translate
                }}</span>
              }
            </button>
          </div>
        </div>
      </form>
    </div>
    `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .form-wrapper {
      .hint {
        margin-top: $spacing-2;
      }
      .add-user-form {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-2;
        margin-top: $spacing-4;
        .names {
          width: 100%;
          display: grid;
          gap: $spacing-2;
          grid-template-columns: 1fr;
        }
        .other-form-fields {
          width: 100%;
          display: grid;
          gap: $spacing-2;
          grid-template-columns: 1fr;
        }
      }

      .button-wrapper {
        .submit-button {
          width: 100%;
          height: 56px;
        }
      }
    }

    @media screen and (min-width: $breakpoint-xs) {
      .form-wrapper {
        .add-user-form {
          .names {
            grid-template-columns: 1fr 1fr;
          }
          .other-form-fields {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      }
    }
  `
})
export class OrgaUserFormComponent {
  @Input() orgId?: number;
  userForm: FormGroup;

  isLoading$ = this.loader.isLoading$('new-user');

  constructor(
    private fb: FormBuilder,
    private orgaFacade: OrgaFacadeService,
    private loader: LoadingService
  ) {
    this.userForm = this.fb.group({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      userType: this.fb.control(UserType.MEMBER)
    });
  }

  get userTypes(): string[] {
    return Object.keys(UserType);
  }

  private onAddUserFinished(form: FormGroupDirective): void {
    this.userForm.reset();
    form.resetForm();
  }

  submitHandler(form: FormGroupDirective): void {
    if (this.orgId) {
      this.orgaFacade.addUser(this.userForm.value, this.orgId, () =>
        this.onAddUserFinished(form)
      );
    }
  }
}
