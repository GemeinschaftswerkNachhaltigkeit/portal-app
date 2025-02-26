import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { ContentWrapperComponent } from 'src/app/shared/components/layout/content-wrapper.component';

@Component({
  selector: 'app-calendar-layout',
  standalone: true,
  imports: [
    CommonModule,
    ContentWrapperComponent,
    TranslateModule,
    HeadingComponent
  ],
  template: `
    <app-content-wrapper size="xl">
      <div class="layout">
        <aside class="sidebar">
          <ng-content select="[filters]"></ng-content>
        </aside>
        <main class="search-results">
          <header class="search">
            <div class="calendar">
              <ng-content select="[calendar]"> </ng-content>
            </div>
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
            <ng-content select="[results]"></ng-content>
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

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr);

      .sidebar {
        display: none;
      }

      .search-results {
        .search {
          margin-bottom: $spacing-8;
          .calendar {
            max-width: 40rem;
          }
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

    @media screen and (min-width: $breakpoint-md) {
      .layout {
        grid-template-columns: 340px minmax(0, 1fr);
        gap: $spacing-8;

        .sidebar {
          display: grid;
          gap: $spacing-4;
          grid-auto-rows: min-content;
        }

        .search-results {
          .search {
            .calendar {
              display: none;
            }
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
export class CalendarLayoutComponent {
  @Input() total!: number;
}
