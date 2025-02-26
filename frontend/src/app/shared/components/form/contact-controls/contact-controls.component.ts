import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidCheckComponent } from '../valid-check.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldErrorComponent } from '../form-field-error/form-field-error.component';

export const defaultContactGroupFields = {
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  position: [''],
  phone: ['']
};

@Component({
  selector: 'app-contact-controls',
  templateUrl: './contact-controls.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ValidCheckComponent,
    TranslateModule,
    FormFieldErrorComponent
  ],
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .contact-form {
      display: grid;
      gap: $spacing-2;
      .row {
        display: grid;
        gap: $spacing-2;
        grid-template-columns: 1fr;
        &.cols-2 {
          grid-template-columns: 1fr 1fr;
        }
      }
    }
  `
})
export class ContactControlsComponent implements OnInit {
  @Input() formGroupName!: string;
  @Input() position = true;
  @Input() translationOverrides: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    position?: string;
  } = {};
  contactFormGroup!: FormGroup;

  constructor(private rootFormGroup: FormGroupDirective) {}
  ngOnInit(): void {
    this.contactFormGroup = this.rootFormGroup.control.get(
      this.formGroupName
    ) as FormGroup;
  }
}
