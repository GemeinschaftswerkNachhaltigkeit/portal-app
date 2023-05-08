import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-address-controls',
  templateUrl: './address-controls.component.html',
  styleUrls: ['./address-controls.component.scss']
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
