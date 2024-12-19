import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Contact } from 'src/app/shared/models/contact';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatButtonModule, TranslateModule, RouterModule],
  template: `
    <div class="contact-wrapper">
      <div class="contact-person">
        <h4 class="title">
          {{ 'marketplace.titles.contactPerson' | translate }}
        </h4>
        <div class="name">{{ getName(contact) }}</div>
        @if (!showContact) {
          <button
            class="show-contact-btn"
            mat-flat-button
            (click)="toggleShowContact()"
            [attr.data-track]="type"
          >
            {{ 'profile.buttons.contactNow' | translate }}
          </button>
        }
        @if (showContact) {
          <div class="info-row">
            <h4 class="subtitle">
              {{ 'profile.titles.email' | translate }}
            </h4>
            <p>{{ contact.email }}</p>
          </div>
          @if (contact.phone) {
            <div class="info-row">
              <h4 class="subtitle">
                {{ 'profile.titles.phone' | translate }}
              </h4>
              <p>{{ contact.phone }}</p>
            </div>
          }
        }
      </div>
      <div class="orga">
        <div class="info-row no-icon">
          <h4 class="subtitle">
            {{ 'marketplace.titles.organisation' | translate }}
          </h4>
          <div class="info-wrapper">
            <a [routerLink]="['/', 'organisations', orga.id]">
              <div class="value-column link">
                <div>{{ orga.name }}</div>
              </div>
            </a>
          </div>
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

      .name {
        font-size: 2.8rem;
        font-weight: 800;
        line-height: 3rem;
        margin-bottom: $spacing-8;
      }

      .title {
        font-size: 1.4rem;
        text-transform: uppercase;
        color: $yellow;
        margin-bottom: $spacing-2;
      }

      .info-row {
        display: grid;
        gap: $spacing-1;
        font-size: 1.2rem;

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

      .contact-person {
        position: relative;
        padding: $spacing-6;
        background-color: $bordeauxe;
        color: white;

        .show-contact-btn {
          background-color: $yellow;
        }
      }

      .orga {
        background-color: $orange;
        padding: $spacing-6;
      }
    }

    @media screen and (min-width: $breakpoint-sm) {
      .contact-wrapper {
        .contact-person {
          .contact-information {
            grid-template-columns: 13.2rem 1fr;
            left: -$spacing-10;

            &.noImage {
              left: 0;
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
  @Input() contact!: Contact;
  @Input() type!: 'offer' | 'bestPractice';
  @Input() orga!: {
    id: number;
    name: string;
  };
  showContact = false;

  toggleShowContact(): void {
    this.showContact = true;
  }

  getName(contact: Contact): string {
    return `${contact.firstName} ${contact.lastName}`;
  }
}
