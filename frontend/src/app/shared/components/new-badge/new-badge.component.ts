import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-new-badge',
  templateUrl: './new-badge.component.html',
  styleUrls: ['./new-badge.component.scss']
})
export class NewBadgeComponent {
  @Input() yellow = false;
}
