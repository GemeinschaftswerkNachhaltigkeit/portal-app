import { Component, OnInit } from '@angular/core';
import { AccountFacadeService } from '../../account-facade.service';
import UserData from '../../models/user-data';
import UserDataForm from '../../models/user-data-form';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { PageWithHeaderLayoutComponent } from 'src/app/shared/components/layout/page-with-header-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { MyDataFormComponent } from '../../components/my-data-form.component';

@Component({
  selector: 'app-my-data',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    PageWithHeaderLayoutComponent,
    TranslateModule,
    MyDataFormComponent
  ],
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.scss']
})
export class MyDataComponent implements OnInit {
  userData?: UserData;
  constructor(private accountFacade: AccountFacadeService) {}

  ngOnInit(): void {
    this.userData = this.accountFacade.getUserData();
  }

  submitHandler(userFormData: UserDataForm): void {
    this.accountFacade.changeMyData({
      ...this.userData,
      ...userFormData
    });
  }
  deleteAccountHandler(): void {
    this.accountFacade.deleteAccount();
  }
}
