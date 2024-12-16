import { Component, EventEmitter, Input, Output } from '@angular/core';
import UserListDto from '../models/user-list-dto';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OrgaUserListStatusComponent } from './orga-user-list-status.component';
import { OutlinedIconComponent } from 'src/app/shared/components/base/outlined-icon.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-orga-user-list-entry',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    OrgaUserListStatusComponent,
    OutlinedIconComponent,
    MatButtonModule
  ],
  template: `
    <div class="user-list-entry" *ngIf="user">
      <div class="col">
        <label>{{ 'account.labels.email' | translate }}</label>
        <div class="value">{{ user.email }}</div>
      </div>
      <div class="col">
        <label>{{ 'account.labels.userType' | translate }}</label>
        <div class="value">
          {{ 'account.labels.' + user.userType | translate }}
        </div>
      </div>
      <div class="col status">
        <label>{{ 'account.labels.status' | translate }}</label>
        <div class="value">
          <app-orga-user-list-status
            [status]="user.status"
          ></app-orga-user-list-status>
        </div>
      </div>
      <div class="col action">
        <label></label>
        <button class="desktop value" mat-button (click)="deleteHandler()">
          <app-outlined-icon>delete</app-outlined-icon>
        </button>
        <button class="mobile" mat-flat-button (click)="deleteHandler()">
          <app-outlined-icon>delete</app-outlined-icon>
          <span>{{ 'account.buttons.delete' | translate }}</span>
        </button>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .user-list-entry {
      position: relative;
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-1;

      align-items: center;
      padding: $spacing-2;
      border: 2px solid $blue-navy;

      .col {
        display: grid;
        grid-template-columns: 100px 1fr;
        gap: $spacing-1;

        label {
          font-weight: bold;
        }

        &.action {
          .mobile {
            grid-column: 1 / 3;
          }

          .desktop {
            display: none;
          }
        }
      }
    }

    @media screen and (min-width: $breakpoint-xs) {
      .user-list-entry {
        position: relative;
        display: grid;
        grid-template-columns: 3fr 1fr 100px 100px;
        gap: $spacing-1;
        border: none;
        border-bottom: 1px solid $blue-navy;
        height: 4rem;

        .col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: $spacing-1;

          label {
            font-weight: bold;
            display: none;
          }

          .value {
            grid-column: 1 / 3;
          }

          &.action {
            .desktop {
              display: block;
              justify-self: end;
            }
            .mobile {
              display: none;
            }
          }
        }
      }
    }
  `
})
export class OrgaUserListEntryComponent {
  @Input() user?: UserListDto;
  @Output() delete = new EventEmitter<void>();

  deleteHandler(): void {
    this.delete.emit();
  }
}
