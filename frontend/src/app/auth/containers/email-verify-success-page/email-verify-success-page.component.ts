import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { EmailVerifySuccessService } from '../../services/email-verify-success.service';

import { NotificationPageComponent } from 'src/app/shared/components/layout/notification-page/notification-page.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-email-verify-success-page',
  standalone: true,
  imports: [
    NotificationPageComponent,
    TranslateModule,
    RouterModule
],
  templateUrl: './email-verify-success-page.component.html',
  styleUrls: ['./email-verify-success-page.component.scss']
})
export class EmailVerifySuccessPageComponent {
  goToPath = '';

  private otherParams: Params | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emailVerifyService: EmailVerifySuccessService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.goToPath = params['goTo'];
      this.otherParams = { ...params };

      this.otherParams['goTo'] = null;
      this.otherParams['forceRegistration'] = null;
    });
  }

  hideOrgaButton(goToPath: string): boolean {
    const doNotShowOrgaButtonsRoutes = ['organisation-membership'];

    return doNotShowOrgaButtonsRoutes.reduce((hide, path) => {
      if (goToPath.includes(path)) {
        hide = true;
      }
      return hide;
    }, false);
  }

  goTo() {
    this.emailVerifyService.verifySuccessPageVisited().then((resp) => {
      if (resp && this.goToPath) {
        this.router.navigate([this.goToPath], {
          queryParams: this.otherParams,
          queryParamsHandling: 'merge'
        });
      }
    });
  }
}
