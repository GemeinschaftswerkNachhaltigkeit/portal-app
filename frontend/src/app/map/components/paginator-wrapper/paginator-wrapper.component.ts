import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paginator-wrapper',
  templateUrl: './paginator-wrapper.component.html',
  styleUrls: ['./paginator-wrapper.component.scss']
})
export class PaginatorWrapperComponent {
  @Input() total?: number;
}
