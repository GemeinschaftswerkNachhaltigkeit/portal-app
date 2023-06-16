import { Component, Input } from '@angular/core';
import { Contact } from 'src/app/shared/models/contact';
import LocationData from 'src/app/shared/models/location-data';
import { SocialMediaContact } from 'src/app/shared/models/social-media-contact';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ProfileUtilsService } from '../../services/profile-utils.service';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { MatomoTagManagerService } from 'src/app/matomo-tm.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @Input() type?: 'ORGANISATION' | 'ACTIVITY' = 'ORGANISATION';
  @Input() dan = false;
  @Input() name? = '';
  @Input() activityOrga? = '';
  @Input() orgaId?: number = undefined;
  @Input() impactArea? = '';
  @Input() contact?: Contact = {};
  @Input() location?: LocationData = {};
  @Input() socialMedia?: SocialMediaContact[] = [];
  @Input() thematicFocus?: ThematicFocus[] = [];
  showContact = false;

  constructor(
    public utils: UtilsService,
    public profileUtils: ProfileUtilsService,
    private imgService: ImgService,
    private tracker: MatomoTracker,
    private tags: MatomoTagManagerService
  ) {}

  get contactImage(): string | null {
    return this.imgService.url(this.contact?.image);
  }

  toggleShowContact(): void {
    this.tracker.trackEvent(
      'ogranisation_profile',
      'button_click',
      'contact_now',
      1
    );
    this.showContact = true;
  }

  test(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.log('PUSH');
    this.tracker.trackEvent('CAT2', 'ACT', 'EVENT TEST', 100);
    this.showContact = true;
    this.tags.sendTag({
      event: 'MEIN_TEST_EVENT',
      test: 'TEST !!!!'
    });
  }
}
