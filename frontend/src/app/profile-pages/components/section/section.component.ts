import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent {
  @Input() subtitle? = '';
  @Input() info? = '';
  @Input() infoType?: 'ORGANISATION' | 'ACTIVITY' = 'ORGANISATION';
  @Input() title? = '';
}
