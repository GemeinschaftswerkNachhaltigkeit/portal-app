import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss']
})
export class AddBannerComponent {
  @Output() add = new EventEmitter();
}
