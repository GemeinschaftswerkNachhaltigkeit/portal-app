import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthenticatedDirective } from 'src/app/auth/directives/authenticated.directive';
import { ContentWrapperComponent } from 'src/app/shared/components/layout/content-wrapper.component';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [CommonModule, ContentWrapperComponent, AuthenticatedDirective],
  template: `
    <app-content-wrapper size="xl">
      <div class="profile">
        <section class="body">
          <aside class="nav">
            <ng-container *appAuthenticated>
              <div class="nav-wrapper">
                <ng-content select="[nav]"></ng-content>
              </div>
            </ng-container>
          </aside>
          <main class="content">
            <ng-content select="[content]"></ng-content>
          </main>
        </section>
      </div>
    </app-content-wrapper>
  `,
  styles: `
    @use 'palette' as *;
    @use 'theme' as *;

    $navColumn: 16.8rem;
    $rightColumn: 37.6rem;

    .profile {
      display: grid;
      gap: $spacing-18;

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

    @media screen and (min-width: $breakpoint-sm) {
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
        }
      }
    }
  `
})
export class AccountLayoutComponent {}
