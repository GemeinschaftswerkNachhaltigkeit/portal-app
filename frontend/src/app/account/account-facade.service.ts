import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { MyDataApiService } from './api/my-data-api.service';
import UserData from './models/user-data';
import { UserPermission } from '../auth/models/user-role';
import { environment } from '../../environments/environment';
import { FeedbackService } from '../shared/components/feedback/feedback.service';

@Injectable({
  providedIn: 'root'
})
export class AccountFacadeService {
  constructor(
    private auth: AuthService,
    private myDataApi: MyDataApiService,
    private feedback: FeedbackService,
    private translate: TranslateService
  ) {}

  // My Data

  changeMyData(data: UserData): void {
    this.myDataApi
      .changeMyData(data)
      .pipe(take(1))
      .subscribe(async () => {
        await this.auth.refreshToken();
        this.getUserData();
        this.feedback.showFeedback(
          this.translate.instant('account.notifications.mydataUpdateSuccess'),
          'success'
        );
      });
  }

  deleteAccount(): void {
    this.auth.deleteAccount();
  }

  getUserData(): UserData {
    const user = this.auth.getUser();
    return {
      id: user?.sub || '',
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    };
  }

  isAdminUser(): boolean {
    const currentUser = this.auth.getUser();
    if (currentUser) {
      return this.auth.hasAnyPermission(currentUser, [
        UserPermission.RNE_ADMIN
      ]);
    } else {
      return false;
    }
  }

  // https://wpgwn-auth.exxeta.info/realms/wpgwn -> https://wpgwn-auth.exxeta.info/admin/wpgwn/console
  getKeycloakConsoleUrl() {
    const issuer = environment.keycloak.issuer;
    return issuer.replace('realms', 'admin') + '/console';
  }
}
