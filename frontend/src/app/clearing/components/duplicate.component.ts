import { Component, Input } from '@angular/core';
import DuplicateDto from '../models/duplicate-dto';

import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { TranslateModule } from '@ngx-translate/core';
import { DuplicateEntryComponent } from './duplicate-entry.component';
import { LoadingIndicatorComponent } from 'src/app/shared/components/base/loading-indicator.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-duplicate',
  standalone: true,
  imports: [
    HeadingComponent,
    TranslateModule,
    DuplicateEntryComponent,
    LoadingIndicatorComponent,
    RouterModule
  ],
  template: `
    <div class="duplicates-wrapper">
      <div>
        <app-heading size="md" color="none">{{
          'clearing.titles.duplicates' | translate
        }}</app-heading>
        <div class="legend">
          <div class="icon">!</div>
          <div class="text">
            = {{ 'clearing.labels.duplicate' | translate }}
          </div>
        </div>
      </div>
      @if (duplicate) {
        <div class="duplicates-list">
          @for (dup of duplicate.duplicateListItems; track dup) {
            @if (dup.organisationWorkInProgress) {
              <a
                target="_blank"
                [href]="
                  'sign-up/organisation/' +
                  dup.organisationWorkInProgress.randomUniqueId
                "
                class="duplicate"
              >
                <app-duplicate-entry
                  [duplicateFields]="dup.duplicateForFields"
                  [duplicate]="dup.organisationWorkInProgress"
                ></app-duplicate-entry>
              </a>
            }
            @if (dup.organisation) {
              <a
                target="_blank"
                [href]="'organisations/' + dup.organisation.id"
                class="duplicate"
              >
                <app-duplicate-entry
                  [duplicateFields]="dup.duplicateForFields"
                  [duplicate]="dup.organisation"
                ></app-duplicate-entry>
              </a>
            }
          }
        </div>
      }
      @if (!duplicate) {
        <app-loading-indicator></app-loading-indicator>
      }
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .duplicates-wrapper {
      display: grid;
      gap: $spacing-10;
      .duplicates-list {
        display: grid;
        gap: $spacing-2;
        a {
          text-decoration: none;
        }
      }

      .legend {
        display: flex;
        align-items: center;
        gap: $spacing-2;

        .icon {
          width: $spacing-6;
          height: $spacing-6;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: $magenta;
          color: white;
          border-radius: 50%;
          font-weight: bold;
        }

        .text {
          color: $blue-navy;
          font-size: 1.2rem;
        }
      }
    }
  `
})
export class DuplicateComponent {
  @Input() duplicate: DuplicateDto | null = null;
}
