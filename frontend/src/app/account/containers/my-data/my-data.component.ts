import { Component, OnInit } from '@angular/core';
import { AccountFacadeService } from '../../account-facade.service';
import UserData from '../../models/user-data';
import UserDataForm from '../../models/user-data-form';

@Component({
  selector: 'app-my-data',
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
