import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-with-header-layout',
  templateUrl: './page-with-header-layout.component.html',
  styleUrls: ['./page-with-header-layout.component.scss']
})
export class PageWithHeaderLayoutComponent {
  @Input() title = '';
  @Input() firstName? = '';
  @Input() noEntriesTitle = '';
  @Input() showNoEntriesWarning = false;
}
