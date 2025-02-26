import {} from '@angular/animations';

import { Component } from '@angular/core';
import { ProfileAnimation } from 'src/app/shared/components/animations/profile-animation';
import { ContentWrapperComponent } from 'src/app/shared/components/layout/content-wrapper.component';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [ContentWrapperComponent],
  animations: [ProfileAnimation],
  template: `
    <app-content-wrapper size="xl">
      <div class="profile" @slideIn>
        <header class="header">
          <section class="breadcrumbs">
            <ng-content select="[breadcrumbs]"></ng-content>
          </section>
          <section class="hero">
            <ng-content select="[hero]"></ng-content>
          </section>
        </header>
        <section class="body">
          <aside class="nav">
            <div class="nav-wrapper">
              <ng-content select="[nav]"></ng-content>
            </div>
          </aside>
          <main class="content">
            <div class="content-with-contact">
              <ng-content select="[content1]"></ng-content>

              <aside id="contact" class="contact">
                <ng-content select="[contact]"></ng-content>
              </aside>
            </div>
            <div class="content-no-contact">
              <ng-content select="[content2]"></ng-content>
            </div>
          </main>
        </section>
      </div>
    </app-content-wrapper>
  `,
  styles: `
    @use '@angular/material' as mat;
    @use 'palette' as *;
    @use 'theme' as *;

    $navColumn: 16.8rem;
    $contactColumn: 37.6rem;

    .profile {
      display: grid;
      gap: $spacing-18;

      .header {
        display: grid;
        gap: $spacing-4;
      }

      .body {
        display: grid;

        .content {
          display: grid;
          gap: $spacing-4;
          margin-top: $spacing-4;
          margin-bottom: $spacing-8;

          .content-with-contact {
            display: grid;
            gap: $spacing-4;
          }
        }
      }
    }

    @media screen and (min-width: $breakpoint-md) {
      .profile {
        .body {
          display: grid;
          grid-template-columns: $navColumn 1fr;
          gap: $spacing-20;
          position: relative;

          .nav {
            height: fit-content;
            position: sticky;
            top: calc(#{$top-nav-height} + #{$spacing-4});

            .nav-wrapper {
              position: relative;
              width: calc(3rem + 100%);
              left: -3rem;
            }
          }

          .content {
            display: grid;
            gap: $spacing-18;

            .content-with-contact {
              grid-template-columns: 1fr $contactColumn;
              gap: $spacing-8;
            }
          }
        }
      }
    }

    @media screen and (min-width: $breakpoint-md) {
      .profile {
        .body {
          .nav {
            .nav-wrapper {
              width: calc(6rem + 100%);
              left: -6rem;
            }
          }
        }
      }
    }
  `
})
export class ProfileLayoutComponent {}
