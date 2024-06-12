import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { environment } from 'src/environments/environment';
import { ContactInviteService } from '../services/contact-invite.service';
import { DirectusContentService } from '../../shared/services/directus-content.service';

@Component({
  selector: 'app-contact-invite',
  templateUrl: './contact-invite.component.html',
  styleUrls: ['./contact-invite.component.scss']
})
export class ContactInviteComponent {
  inviteId = null;
  action: 'ALLOW' | 'DENY' = 'ALLOW';

  public content$ = this.directusContentService.contactInvite$;
  orgName = '';
  invalid = false;

  loading$ = this.loading.isLoading$('contactInvite');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private directusContentService: DirectusContentService,
    private translate: TranslateService,
    private contactInviteService: ContactInviteService,
    private loading: LoadingService
  ) {
    this.route.params.subscribe((params) => {
      this.inviteId = params['inviteId'];
      if (this.inviteId) {
        this.contactInviteService.getInvite(this.inviteId).then((invite) => {
          this.orgName =
            invite?.organisationWorkInProgress?.name ||
            invite?.organisation?.name ||
            '';
          this.directusContentService.getContactInviteTranslations({
            orgname: this.orgName
          });
        });
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.action = params['action'];
      if (this.action === 'ALLOW') {
        this.accept();
      } else if (this.action === 'DENY') {
        this.deny();
      }
    });
    this.translate.onLangChange.subscribe(() => {
      this.directusContentService.getContactInviteTranslations({
        orgname: this.orgName
      });
    });
    this.directusContentService.getContactInviteTranslations({
      orgname: this.orgName
    });
  }

  goToLandingpage() {
    location.href = environment.landingPageUrl;
  }

  registerUser() {
    /**
     * redirectUri must use AuthGuard, see openUri in app-auth.config.ts
     */
    this.router.navigate(['/account'], {
      queryParams: {
        forceRegistration: ''
      }
    });
  }

  accept() {
    const loadingId = this.loading.start('contactInvite');
    if (this.inviteId) {
      this.contactInviteService.acceptInvite(this.inviteId).then((resp) => {
        if (resp) {
          console.debug('accepted invite');
        } else {
          this.invalid = true;
        }
        this.loading.stop(loadingId);
      });
    }
  }

  deny() {
    const loadingId = this.loading.start('contactInvite');
    if (this.inviteId) {
      this.contactInviteService.denyInvite(this.inviteId).then((resp) => {
        if (resp) {
          console.debug('denied invite');
        } else {
          this.invalid = true;
        }
        this.loading.stop(loadingId);
      });
    }
  }
}
