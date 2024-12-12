import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContentRowComponent } from 'src/app/shared/components/base/content-row.component';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { HtmlWrapperComponent } from 'src/app/shared/components/base/html-wrapper.component';
import Organisation from 'src/app/shared/models/organisation';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';

@Component({
  selector: 'app-duplicate-entry',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DatePipe,
    HeadingComponent,
    ContentRowComponent,
    HtmlWrapperComponent
  ],
  template: `
    <div class="duplicate" *ngIf="duplicate">
      <div class="title-wrapper">
        <div
          class="title"
          [ngClass]="{ duplicateField: isDuplicateField('NAME') }"
        >
          <app-heading size="sm" color="none">{{ duplicate.name }}</app-heading>
        </div>
        <div class="title-info">
          <p>
            {{ duplicate.modifiedAt | date: 'dd.MM.yyyy HH:mm' }}
          </p>
          <p>
            {{
              duplicate
                ? ('organisationType.' + duplicate.organisationType | translate)
                : '-'
            }}
          </p>
        </div>
      </div>
      <div class="meta-infos">
        <div class="column">
          <p
            [ngClass]="{
              noValue: !duplicate.location?.url,
              duplicateField: isDuplicateField('URL')
            }"
          >
            {{
              duplicate.location?.url || 'clearing.labels.noWebsite' | translate
            }}
          </p>
          <p [ngClass]="{ duplicateField: isDuplicateField('EMAIL') }">
            {{ duplicate.contact?.email }}
          </p>
        </div>

        <div
          class="column info"
          [ngClass]="{ duplicateField: isDuplicateField('ADDRESS') }"
        >
          <app-content-row
            *ngIf="duplicate.location && duplicate.location.address"
            [content]="
              duplicate.location.address.city! +
              ' ,' +
              duplicate.location.address.country!
            "
          ></app-content-row>

          <app-content-row
            *ngIf="duplicate.impactArea"
            [content]="'impactArea.' + duplicate.impactArea | translate"
            icon="location_searching"
          ></app-content-row>

          <a
            *ngIf="duplicate.location?.url"
            [href]="duplicate.location?.url"
            target="_blank"
          >
            <app-content-row
              *ngIf="duplicate.location?.url"
              [content]="duplicate.location?.url"
              icon="link"
            ></app-content-row
          ></a>
        </div>
      </div>
      <app-html-wrapper [html]="duplicate.description || ''"></app-html-wrapper>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .duplicate {
      display: grid;
      gap: $spacing-2;
      border-bottom: 1px solid $blue-navy;
      margin-bottom: $spacing-4;

      .title-wrapper {
        width: 100%;
        display: grid;
        gap: $spacing-2;
        grid-template-columns: 1fr 1fr;

        .title {
          height: fit-content;
        }

        .title-info {
          font-size: 1.2rem;
          text-align: right;

          p {
            margin-bottom: 2px;
          }
        }
      }

      .meta-infos {
        width: 100%;
        display: grid;
        gap: $spacing-2;
        grid-template-columns: 1fr 1fr;
        padding: $spacing-4 0;

        .noValue {
          opacity: 0.5;
          font-style: italic;
        }

        .info {
          display: grid;
          gap: $spacing-1;
          justify-self: flex-end;
        }

        p {
          margin-bottom: 2px;
        }
      }
    }

    .duplicateField {
      display: flex;
      width: fit-content;
      padding: $spacing-1 $spacing-2;
      border: 2px solid $magenta;
      position: relative;
      &::after {
        content: '!';
        position: absolute;
        right: -$spacing-3;
        top: -$spacing-3;
        background: $magenta;
        color: white;
        width: $spacing-6;
        height: $spacing-6;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $spacing-6;
        font-weight: bold;
      }
    }
  `
})
export class DuplicateEntryComponent {
  @Input() duplicateFields: string[] = [];
  @Input() duplicate: OrganisationWIP | Organisation | null = null;

  isDuplicateField(field: string): boolean {
    return this.duplicateFields.includes(field);
  }
}
