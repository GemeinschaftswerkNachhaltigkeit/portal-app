import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import UserDataForm from '../../models/user-data-form';

@Component({
  selector: 'app-my-data-form',
  templateUrl: './my-data-form.component.html',
  styleUrls: ['./my-data-form.component.scss']
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
