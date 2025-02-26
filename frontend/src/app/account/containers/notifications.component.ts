import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifiacationFacadeService } from '../notification-facade.service';

import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [LoadingIndicatorComponent],
  template: ` <app-loading-indicator></app-loading-indicator> `
})
export class NotificationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationFacade: NotifiacationFacadeService
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.params['uuid'];
    const email = this.route.snapshot.queryParams['email'];

    if (uuid && email) {
      this.notificationFacade.optOutFromAllMails(uuid, email);
    } else {
      this.router.navigate(['/']);
    }
  }
}
