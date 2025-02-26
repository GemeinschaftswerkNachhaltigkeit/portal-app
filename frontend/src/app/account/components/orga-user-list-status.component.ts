import { Component, Input } from '@angular/core';
import { UserStatus } from '../../shared/models/user-status';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-orga-user-list-status',
  standalone: true,
  imports: [MatIconModule],
  template: `
    @if (status === 'ACCEPTED') {
      <div class="icon accepted">
        <mat-icon class="material-icons-outlined">check</mat-icon>
      </div>
    }
    @if (status === 'OPEN') {
      <div class="icon open">
        <mat-icon class="material-icons-outlined">hourglass_empty</mat-icon>
      </div>
    }
    @if (status === 'EXPIRED') {
      <div class="icon expired">
        <mat-icon class="material-icons-outlined">auto_delte</mat-icon>
      </div>
    }
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .icon {
      display: flex;
      align-items: center;
      &.accepted {
        color: $green;
      }
      &.open {
        color: $magenta;
      }
      &.expired {
        color: $orange;
      }
    }

    @media screen and (min-width: $breakpoint-xs) {
      .icon {
        justify-content: flex-end;
      }
    }
  `
})
export class OrgaUserListStatusComponent {
  @Input() status?: UserStatus;
}
