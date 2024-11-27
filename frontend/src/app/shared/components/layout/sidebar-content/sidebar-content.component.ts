import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.scss']
})
export class SidebarContentComponent {
  @Output() closeNav = new EventEmitter();

  closeHandler() {
    this.closeNav.emit();
  }
}
