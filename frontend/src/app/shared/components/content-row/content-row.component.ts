import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-row',
  templateUrl: './content-row.component.html',
  styleUrls: ['./content-row.component.scss']
})
export class ContentRowComponent {
  @Input() icon = 'pin_drop';
  @Input() content? = '';
  @Input() noDecorator = false;
  @Input() small = false;
  @Input() cardFooter = false;
}
