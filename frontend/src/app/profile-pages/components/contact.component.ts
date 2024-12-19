import { Component, Input } from '@angular/core';
import { Contact } from 'src/app/shared/models/contact';
import LocationData from 'src/app/shared/models/location-data';
import { SocialMediaContact } from 'src/app/shared/models/social-media-contact';
import { ThematicFocus } from 'src/app/shared/models/thematic-focus';
import { ImgService } from 'src/app/shared/services/img.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ProfileUtilsService } from '../services/profile-utils.service';
import { MatomoTracker } from 'ngx-matomo-client';
import { MatomoTagManagerService } from 'src/app/matomo-tm.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { SocialMediaLinksComponent } from 'src/app/shared/components/base/social-media-links/social-media-links.component';
import { TopicComponent } from 'src/app/shared/components/base/topic.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule,
    MatIconModule,
    OutlinedIconComponent,
    SocialMediaLinksComponent,
    TopicComponent,
    RouterModule
  ],
  template: `
    <div class="contact-wrapper">
      <div
        class="inner-wrapper"
        [ngClass]="{
          orga: type === 'ORGANISATION',
          activity: type === 'ACTIVITY'
        }"
        >
        <div class="contact-information" [ngClass]="{ noImage: !contactImage }">
          @if (contactImage) {
            <div class="image">
              @if (contactImage) {
                <img
                  [src]="contactImage"
                  [alt]="profileUtils.contactString(contact)"
                  />
              }
            </div>
          }
          <div class="info">
            <h4 class="title">{{ 'profile.titles.contact' | translate }}</h4>
            <div class="info-row">
              <h4 class="subtitle">
                {{ 'profile.titles.contactPerson' | translate }}
              </h4>
              <p>{{ profileUtils.contactString(contact) }}</p>
            </div>
            @if (!showContact) {
              <button
                id="contact-now"
                class="show-contact-btn"
                (click)="toggleShowContact()"
                >
                {{ 'profile.buttons.contactNow' | translate }}
              </button>
            }
            @if (showContact) {
              <div class="info-row">
                <h4 class="subtitle">
                  {{ 'profile.titles.email' | translate }}
                </h4>
                <a [href]="'mailto:' + contact?.email">
                  <mat-icon>mail</mat-icon>
                  <span>{{ contact?.email }}</span>
                </a>
              </div>
              @if (contact?.phone) {
                <div class="info-row">
                  <h4 class="subtitle">
                    {{ 'profile.titles.phone' | translate }}
                  </h4>
                  <p>{{ contact?.phone }}</p>
                </div>
              }
            }
          </div>
        </div>
        <div class="further-information">
          <div class="info-row">
            <h4 class="subtitle">
              @if (type === 'ACTIVITY') {
                <span>
                  {{ 'profile.labels.activityLocation' | translate }}
                </span>
              }
              @if (type === 'ORGANISATION') {
                <span>
                  {{ 'profile.labels.address' | translate }}
                </span>
              }
            </h4>
            <div class="info-wrapper">
              <app-outlined-icon>pin_drop</app-outlined-icon>
              <div class="value-column">
                <div>{{ name }}</div>
                @if (profileUtils.addressString(location?.address)) {
                  <div>
                    {{ profileUtils.addressString(location?.address) }}
                  </div>
                }
                @if (profileUtils.cityString(location?.address)) {
                  <div>
                    {{ profileUtils.cityString(location?.address) }}
                  </div>
                }
                @if (location?.online) {
                  <span>
                    {{ 'profile.labels.online' | translate }}
                  </span>
                }
                @if (location?.url) {
                  <div class="link">
                    <a target="_blank" [href]="location?.url">{{
                      location?.url
                    }}</a>
                  </div>
                }
              </div>
            </div>
          </div>
          @if (impactArea) {
            <div class="info-row">
              <h4 class="subtitle">
                {{ 'profile.titles.impactArea' | translate }}
              </h4>
              <div class="info-wrapper">
                <app-outlined-icon>location_searching</app-outlined-icon>
                <div class="value-column">
                  <div>{{ 'impactArea.' + impactArea | translate }}</div>
                </div>
              </div>
            </div>
          }
          @if (socialMedia?.length) {
            <div class="info-row">
              <h4 class="subtitle">
                {{ 'profile.titles.socialMedia' | translate }}
              </h4>
              <div class="info-wrapper">
                <app-social-media-links
                  [socialMediaLinks]="socialMedia || []"
                ></app-social-media-links>
              </div>
            </div>
          }
        </div>
      </div>
      @if (type === 'ACTIVITY' && activityOrga && orgaId !== 0) {
        <div
          class="activity-orga"
          >
          <div class="info-row no-icon">
            <h4 class="subtitle">
              {{ 'profile.titles.relatedOrganisation' | translate }}
            </h4>
            <div class="info-wrapper">
              <a [routerLink]="['/', 'organisations', orgaId]">
                <div class="value-column link">
                  <div>{{ activityOrga }}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      }
      <div class="thematic-focus-wrapper">
        <h4 class="title">
          {{ 'profile.titles.thematicFocus' | translate }}
        </h4>
        <div class="thematic-focus">
          @for (topic of thematicFocus; track topic) {
            <app-topic>{{ 'thematicFocus.' + topic | translate }}</app-topic>
          }
        </div>
      </div>
    </div>
    `,
  styles: `
    @use '@angular/material' as mat;
    @use 'palette' as *;
    @use 'theme' as *;

    .contact-wrapper {
      position: relative;

      .title {
        font-size: 2.8rem;
        font-family: 'AzeretMono', monospace;
        font-weight: 800;
      }

      .info-row {
        display: grid;
        gap: $spacing-1;
        font-size: 1.2rem;

        a {
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          gap: $spacing-2;
          text-align: left;
        }

        .info-wrapper {
          display: grid;
          grid-template-columns: $spacing-8 1fr;
          gap: $spacing-2;
          color: white;

          a {
            text-decoration: none;
          }

          .value-column {
            display: grid;
            gap: $spacing-1;
            padding-top: 0.2rem;
            color: white;
          }
          .link {
            a {
              color: white;
            }
            &:hover {
              text-decoration: underline;
            }
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &.no-icon {
          .info-wrapper {
            grid-template-columns: 1fr;
          }
        }
      }

      .subtitle {
        color: $yellow;
        margin: 0;
        font-size: 1.4rem;
        line-height: 2.4rem;
        text-transform: uppercase;
      }

      .inner-wrapper {
        position: relative;
        padding: $spacing-6;
        color: white;

        &.orga {
          background-color: $orange;
        }
        &.activity {
          background-color: $dan-blue;
        }
        &.dan {
          background-color: $dan-blue;
        }

        .show-contact-btn {
          background-color: $yellow;
          height: 36px;
          padding: 0 16px;
          border: none;
          font-family: 'AzeretMono';
          color: $blue-navy;
          width: 100%;
          font-size: 14px;
          white-space: nowrap;
        }

        .contact-information {
          display: grid;
          grid-template-columns: 1fr;
          gap: $spacing-4;
          position: relative;
          left: 0;

          .image {
            width: 13.2rem;
            height: 15.7rem;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              height: 100%;
              width: 100%;
              object-fit: cover;
            }
          }
        }

        .further-information {
          margin-top: $spacing-4;
          display: grid;
          gap: $spacing-4;
        }
      }
      .activity-orga {
        background-color: $orange;
        padding: $spacing-6;
      }
      .thematic-focus-wrapper {
        background-color: $blue-light;
        padding: $spacing-6;

        .title {
          color: $blue-navy;
          margin-bottom: $spacing-4;
          &.organisation {
            color: $orange;
          }
          &.activity {
            color: $green;
          }
        }

        .thematic-focus {
          display: flex;
          gap: $spacing-2;
          flex-wrap: wrap;
        }
      }
    }

    @media screen and (min-width: $breakpoint-sm) {
      .contact-wrapper {
        left: $spacing-4;
        width: calc(100% - #{$spacing-4});

        .inner-wrapper {
          .contact-information {
            grid-template-columns: 13.2rem 1fr;
            left: -$spacing-10;

            &.noImage {
              left: 0;
              grid-template-columns: 1fr;
            }

            .image {
              width: 100%;
            }
          }
        }
      }
    }
  `
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
    this.showContact = true;
  }
}
