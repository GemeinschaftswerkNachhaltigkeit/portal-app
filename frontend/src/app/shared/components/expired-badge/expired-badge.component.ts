import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expired-badge',
  templateUrl: './expired-badge.component.html',
  styleUrls: ['./expired-badge.component.scss']
})
export class ExpiredBadgeComponent {
  @Input() dan = false;
}
