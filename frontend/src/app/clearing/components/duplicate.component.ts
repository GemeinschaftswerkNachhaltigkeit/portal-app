import { Component, Input } from '@angular/core';
import DuplicateDto from '../models/duplicate-dto';
import { CommonModule } from '@angular/common';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { TranslateModule } from '@ngx-translate/core';
import { DuplicateEntryComponent } from './duplicate-entry.component';
import { SpinnerComponent } from 'src/app/shared/components/base/spinner.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-duplicate',
  standalone: true,
  imports: [
    CommonModule,
    HeadingComponent,
    TranslateModule,
    DuplicateEntryComponent,
    SpinnerComponent,
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
      <ng-container *ngIf="duplicate">
        <div class="duplicates-list">
          <ng-container *ngFor="let dup of duplicate?.duplicateListItems">
            <a
              target="_blank"
              *ngIf="dup.organisationWorkInProgress"
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
            <a
              target="_blank"
              *ngIf="dup.organisation"
              [href]="'organisations/' + dup.organisation.id"
              class="duplicate"
            >
              <app-duplicate-entry
                [duplicateFields]="dup.duplicateForFields"
                [duplicate]="dup.organisation"
              ></app-duplicate-entry>
            </a>
          </ng-container>
        </div>
      </ng-container>
      <app-spinner *ngIf="!duplicate"></app-spinner>
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
