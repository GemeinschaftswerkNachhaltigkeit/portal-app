import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { Subject, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { OrgaUserDto } from 'src/app/shared/models/organisation-user';
import { LoadingService } from '../../../services/loading.service';
import { UserSelectApiService } from './api/user-select-api.service';

@Component({
  selector: 'app-user-select-control',
  templateUrl: './user-select-control.component.html',
  styleUrls: ['./user-select-control.component.scss']
})
export class UserSelectControlComponent implements OnInit {
  @Input() controlName!: string;
  @Input() label?: string = '';
  users: OrgaUserDto[] = [];

  formControl!: FormControl;

  loading$ = this.loader.isLoading$();
  unsubscribe$ = new Subject();

  constructor(
    private rootFormGroup: FormGroupDirective,
    auth: AuthService,
    userSelectApi: UserSelectApiService,
    private loader: LoadingService
  ) {
    const orgaId = auth.getUser()?.orgId;
    if (orgaId) {
      const loadingId = this.loader.start();
      userSelectApi
        .getUsers(orgaId)
        .pipe(take(1))
        .subscribe({
          next: (users) => {
            this.users = users;
            this.loader.stop(loadingId);
          },
          error: () => {
            this.loader.stop(loadingId);
            this.formControl.markAllAsTouched();
            this.formControl.setErrors({ loadingOptionsError: true });
          }
        });
    }
  }

  ngOnInit(): void {
    this.formControl = this.rootFormGroup.control.get(
      this.controlName
    ) as FormControl;
  }

  getFormattedUser(user: OrgaUserDto): string {
    return `${user.firstName} ${user.lastName}, ${user.email}`;
  }

  compareFn(c1: OrgaUserDto, c2: OrgaUserDto): boolean {
    return c1 && c2 ? c1.email === c2.email : c1 === c2;
  }
}
