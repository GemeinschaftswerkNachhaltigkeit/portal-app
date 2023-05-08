import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifiacationFacadeService } from '../../notification-facade.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
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
