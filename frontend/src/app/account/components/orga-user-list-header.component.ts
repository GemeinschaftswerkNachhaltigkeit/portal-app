import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-orga-user-list-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <header class="user-list-header">
      <label>{{ 'account.labels.email' | translate }}</label>
      <label>{{ 'account.labels.userType' | translate }}</label>
      <label class="status">{{ 'account.labels.status' | translate }}</label>
      <label></label>
    </header>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .user-list-header {
      display: none;
      padding: $spacing-2;
    }

    @media screen and (min-width: $breakpoint-xs) {
      .user-list-header {
        width: 100%;
        position: relative;
        display: grid;
        grid-template-columns: 3fr 1fr 100px 100px;
        gap: $spacing-1;
        padding-bottom: $spacing-2;

        label {
          font-weight: bold;
        }

        .status {
          justify-self: flex-end;
        }
      }
    }
  `
})
export class OrgaUserListHeaderComponent {}
