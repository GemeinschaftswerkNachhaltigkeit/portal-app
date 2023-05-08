import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-with-heading-layout',
  templateUrl: './list-with-heading-layout.component.html',
  styleUrls: ['./list-with-heading-layout.component.scss']
})
export class ListWithHeadingLayoutComponent {
  @Input() title = '';
}
