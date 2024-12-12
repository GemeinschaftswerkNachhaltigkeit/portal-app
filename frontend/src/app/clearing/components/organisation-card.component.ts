import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ContentRowComponent } from 'src/app/shared/components/base/content-row.component';
import { HtmlWrapperComponent } from 'src/app/shared/components/base/html-wrapper.component';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { OrganisationWIP } from 'src/app/shared/models/organisation-wip';

@Component({
  selector: 'app-organisation-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    OutlinedIconComponent,
    ContentRowComponent,
    HtmlWrapperComponent,
    TranslateModule
  ],
  template: `
    <div
      *ngIf="orgWIP"
      class="org-details card"
      [class.is-active]="active"
      [class.mat-elevation-z8]="elevation"
    >
      <header class="header">
        <span>
          <button
            mat-icon-button
            color="yellow"
            [class]="'feedbackHistoryToggle'"
            *ngIf="hasFeedbackHistory(orgWIP) && showFeedbackToggle"
            (click)="toggleFeedbackHistory.emit(true)"
          >
            <app-outlined-icon>help_outline</app-outlined-icon>
          </button>

          {{ orgWIP.modifiedAt | date: 'dd.MM.yyyy HH:mm' }}</span
        >
        <h3 class="title">{{ orgWIP.name }}</h3>
        <span>{{
          orgWIP.organisationType
            ? ('organisationType.' + orgWIP.organisationType | translate)
            : '-'
        }}</span>
      </header>
      <main class="body">
        <app-html-wrapper [html]="orgWIP.description || ''"></app-html-wrapper>

        <div class="info">
          <app-content-row
            *ngIf="orgWIP.location && orgWIP.location.address"
            [content]="
              orgWIP.location.address.city! +
              ' ,' +
              orgWIP.location.address.country!
            "
          ></app-content-row>

          <app-content-row
            *ngIf="orgWIP.impactArea"
            [content]="'impactArea.' + orgWIP.impactArea | translate"
            icon="location_searching"
          ></app-content-row>

          <a
            *ngIf="orgWIP.location?.url"
            [href]="orgWIP.location?.url"
            target="_blank"
          >
            <app-content-row
              *ngIf="orgWIP.location?.url"
              [content]="orgWIP.location?.url"
              icon="link"
            ></app-content-row
          ></a>
        </div>
      </main>

      <footer class="footer">
        <ng-content></ng-content>
      </footer>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    $text-color: mat.m2-get-color-from-palette($wpgwn-app-primary, 500);

    :host {
      height: 100%;
    }

    .card {
      background-color: #fff;
      padding: $spacing-4;
      .header {
        display: flex;
        gap: 0.8em;
        justify-content: space-between;
        align-items: center;
        height: 4em;
        .title {
          color: $text-color;
          margin: 0;
          font-weight: bold;
          font-size: 1.6rem;
          text-align: center;
        }
        > * {
          min-width: 200px;
        }
      }

      .body {
        display: flex;
        justify-content: space-between;
        gap: 2em;
        margin-bottom: 1.5em;
        p {
          flex: 0 1 100%;
        }
        .info {
          flex: 0 0 300px;
        }
      }

      .footer {
        display: flex;
        gap: 0.8em;
        justify-content: flex-end;
        .details-btn {
          margin-right: auto;
        }
      }
    }
    .card.is-active {
      transform: translate(2rem);
    }

    .feedbackHistoryToggle {
      margin-left: -1.6rem;
    }
  `
})
export class OrganisationCardComponent {
  @Input() orgWIP: OrganisationWIP | null = null;
  @Input() active = false;
  @Input() elevation = true;

  @Input() showFeedbackToggle = true;
  @Output() toggleFeedbackHistory = new EventEmitter<boolean>();

  hasFeedbackHistory(orgWIP: OrganisationWIP) {
    if (orgWIP?.feedbackHistory?.length) {
      return orgWIP.feedbackHistory.length > 0;
    } else {
      return false;
    }
  }
}
