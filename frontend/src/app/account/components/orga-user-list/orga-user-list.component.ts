import { Component, EventEmitter, Input, Output } from '@angular/core';
import UserListDto from '../../models/user-list-dto';

@Component({
  selector: 'app-orga-user-list',
  templateUrl: './orga-user-list.component.html',
  styleUrls: ['./orga-user-list.component.scss']
})
export class OrgaUserListComponent {
  @Input() users: UserListDto[] = [];
  @Output() deleteUser = new EventEmitter<UserListDto>();

  deleteHandler(user: UserListDto): void {
    this.deleteUser.emit(user);
  }
}
