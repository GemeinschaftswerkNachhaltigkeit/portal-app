import { Component, EventEmitter, Input, Output } from '@angular/core';
import UserListDto from '../models/user-list-dto';
import { CommonModule } from '@angular/common';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';
import { TranslateModule } from '@ngx-translate/core';
import { OrgaUserListEntryComponent } from './orga-user-list-entry.component';
import { OrgaUserListHeaderComponent } from './orga-user-list-header.component';

@Component({
  selector: 'app-orga-user-list',
  standalone: true,
  imports: [
    CommonModule,
    HeadingComponent,
    TranslateModule,
    OrgaUserListComponent,
    OrgaUserListEntryComponent,
    OrgaUserListHeaderComponent
  ],
  template: `
    <div class="user-list">
      <app-heading size="sm" type="h2" color="none">{{
        'account.titles.orgaUserList' | translate
      }}</app-heading>
      <div class="list">
        <app-orga-user-list-header></app-orga-user-list-header>
        <div class="list-row" *ngFor="let user of users">
          <app-orga-user-list-entry
            [user]="user"
            (delete)="deleteHandler(user)"
          >
          </app-orga-user-list-entry>
        </div>
      </div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;

    .user-list {
      .list {
        margin-top: $spacing-4;
        display: grid;
        gap: $spacing-1;
      }
    }
  `
})
export class OrgaUserListComponent {
  @Input() users: UserListDto[] = [];
  @Output() deleteUser = new EventEmitter<UserListDto>();

  deleteHandler(user: UserListDto): void {
    this.deleteUser.emit(user);
  }
}
