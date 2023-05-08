import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import { UserType } from 'src/app/shared/models/user-type';
import { OrgaFacadeService } from 'src/app/account/orga-facade.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-orga-user-form',
  templateUrl: './orga-user-form.component.html',
  styleUrls: ['./orga-user-form.component.scss']
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
