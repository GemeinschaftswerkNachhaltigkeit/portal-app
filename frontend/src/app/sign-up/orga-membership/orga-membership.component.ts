import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ErrorService } from '../../shared/services/error.service';
import { MembershipService } from '../services/membership.service';

@Component({
  selector: 'app-orga-membership',
  templateUrl: './orga-membership.component.html',
  styleUrls: ['./orga-membership.component.scss']
})
export class OrgaMembershipComponent {
  constructor(
    route: ActivatedRoute,
    router: Router,
    membership: MembershipService,
    error: ErrorService
  ) {
    const uuid = route.snapshot.params['uuid'];

    if (uuid) {
      membership
        .finishMembership(uuid)
        .pipe(take(1))
        .subscribe({
          next: () => {
            router.navigate(['/', 'account', 'my-organisation']);
          },
          error: (e) => {
            router.navigate(['/']);
            error.handleErrors(e, [
              {
                status: 409,
                msg: 'user - is not allowed to join organisation.',
                feedbackKey: 'account.notifications.notAllwedToJoinOrga'
              }
            ]);
          }
        });
    }
  }
}
