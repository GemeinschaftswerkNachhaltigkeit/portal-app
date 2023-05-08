import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, Validators } from '@angular/forms';

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
  styleUrls: ['./contact-controls.component.scss']
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
