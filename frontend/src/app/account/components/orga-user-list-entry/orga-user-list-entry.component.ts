import { Component, EventEmitter, Input, Output } from '@angular/core';
import UserListDto from '../../models/user-list-dto';

@Component({
  selector: 'app-orga-user-list-entry',
  templateUrl: './orga-user-list-entry.component.html',
  styleUrls: ['./orga-user-list-entry.component.scss']
})
export class OrgaUserListEntryComponent {
  @Input() user?: UserListDto;
  @Output() delete = new EventEmitter<void>();

  deleteHandler(): void {
    this.delete.emit();
  }
}
