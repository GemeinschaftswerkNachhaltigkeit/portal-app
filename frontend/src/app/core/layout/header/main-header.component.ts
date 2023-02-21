import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent {
  @Input() mobile = false;
  @Input() open = false;
  @Output() openToggled = new EventEmitter<boolean>();

  toggleOpen(): void {
    this.openToggled.emit(!this.open);
  }
}
