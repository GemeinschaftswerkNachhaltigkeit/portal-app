import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AlertComponent } from 'src/app/shared/components/base/alert.component';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { ContentWrapperComponent } from 'src/app/shared/components/layout/content-wrapper.component';

@Component({
  selector: 'app-marketplace-layout',
  standalone: true,
  imports: [
    CommonModule,
    ContentWrapperComponent,
    AlertComponent,
    SpinnerComponent,
    TranslateModule,
    HeadingComponent
  ],
  template: `
    <app-content-wrapper size="xl">
      <div *ngIf="notAdmin()">
        <ng-content select="[banner]"></ng-content>
      </div>
      <div class="search-page">
        <aside class="sidebar">
          <ng-content select="[filters]"></ng-content>
        </aside>
        <main class="search-results">
          <header class="search">
            <div class="search-bar">
              <div class="search-input-wrapper">
                <ng-content select="[search-field]"> </ng-content>
              </div>
              <div class="total-wrapper">
                <ng-container *ngTemplateOutlet="totalResults"></ng-container>
              </div>
            </div>
            <div class="filter-bar">
              <ng-content select="[filter-bar]"></ng-content>
              <ng-container *ngTemplateOutlet="totalResults"></ng-container>
            </div>
          </header>
          <section class="result-list">
            <ng-content select="[results]" *ngIf="!loading"></ng-content>
            <app-spinner *ngIf="loading"></app-spinner>
            <app-alert
              *ngIf="total <= 0 && !loading"
              [title]="'map.titles.noData' | translate"
            >
              {{ 'map.texts.noData.0' | translate }}
            </app-alert>
          </section>
          <section class="slider">
            <ng-content select="[slider]"></ng-content>
          </section>
        </main>
      </div>
    </app-content-wrapper>

    <ng-template #totalResults
      ><app-heading size="xs"
        >{{ total }} {{ 'labels.total' | translate }}</app-heading
      ></ng-template
    >
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .search-page {
      display: grid;
      grid-template-columns: minmax(0, 1fr);

      .sidebar {
        display: none;
      }

      .search-results {
        .search {
          margin-bottom: $spacing-8;

          .filter-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 6rem;
          }
          .search-bar {
            height: 6rem;
            background-color: $gray-light;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: $spacing-4;
            padding: $spacing-4;

            .total-wrapper {
              display: none;
            }

            .search-input-wrapper {
              display: flex;
              flex-grow: 1;
              max-width: 100%;
            }
          }
        }
      }
      .slider {
        display: block;
        width: 100%;
        margin: $spacing-8 0;
      }
    }

    @media screen and (min-width: 1280px) {
      .search-page {
        grid-template-columns: 340px minmax(0, 1fr);
        gap: $spacing-8;

        .sidebar {
          display: grid;
          gap: $spacing-4;
          grid-auto-rows: min-content;
        }

        .search-results {
          .search {
            .search-bar {
              .total-wrapper {
                display: block;
              }
              .search-input-wrapper {
                max-width: 50rem;
              }
            }
            .filter-bar {
              display: none;
            }
          }
        }
      }
    }
  `
})
export class MarketplaceLayoutComponent {
  @Input() total!: number;
  @Input() loading: boolean | null = false;

  constructor(private auth: AuthService) {}

  notAdmin(): boolean {
    const user = this.auth.getUser();
    return user && this.auth.isRneAdmin(user) ? false : true;
  }
}
