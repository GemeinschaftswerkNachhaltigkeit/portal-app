import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldErrorComponent } from '../form-field-error/form-field-error.component';
import { ValidCheckComponent } from '../valid-check.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-address-controls',
  templateUrl: './address-controls.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormFieldErrorComponent,
    ValidCheckComponent,
    TranslateModule
  ],
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .address {
      display: grid;
      .address-row-1,
      .address-row-2 {
        display: grid;
        gap: $spacing-2;
      }
    }

    @media screen and (min-width: 600px) {
      .address-row-1 {
        grid-template-columns: 4fr 2fr 2fr;
      }
      .address-row-2 {
        grid-template-columns: 2fr 4fr 2fr;
      }
    }
  `
})
export class AddressControlsComponent implements OnInit {
  @Input() withNameField = false;
  @Input() nameFieldLabel = 'forms.labels.addressName';
  @Input() formGroupName!: string;
  form!: FormGroup;

  constructor(private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
}
