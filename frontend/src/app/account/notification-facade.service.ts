import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { LoadingService } from '../shared/services/loading.service';
import { NotificationsApiService } from './api/notifications-api.service';

@Injectable({
  providedIn: 'root'
})
export class NotifiacationFacadeService {
  constructor(
    private loading: LoadingService,
    private notificationsApi: NotificationsApiService,
    private router: Router
  ) {}

  optOutFromAllMails(uuid: string, email: string): void {
    const optOutList = ['COMPANY_WIP_CONSENT', 'COMPANY_WIP_REMINDER'];
    this.notificationsApi
      .updateNotificationStatus(uuid, email, optOutList)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['/', 'account', 'notifications', 'completed'], {
            queryParams: {
              type: 'success'
            }
          });
        },
        error: () => {
          this.router.navigate(['/', 'account', 'notifications', 'completed'], {
            queryParams: {
              type: 'error'
            }
          });
        }
      });
  }
}
