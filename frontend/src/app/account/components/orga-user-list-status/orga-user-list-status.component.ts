import { Component, Input } from '@angular/core';
import { UserStatus } from '../../../shared/models/user-status';

@Component({
  selector: 'app-orga-user-list-status',
  templateUrl: './orga-user-list-status.component.html',
  styleUrls: ['./orga-user-list-status.component.scss']
})
export class OrgaUserListStatusComponent {
  @Input() status?: UserStatus;
}
