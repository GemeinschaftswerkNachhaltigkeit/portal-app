import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent {
  @Input() new = false;
  @Input() title = '';
  open = false;

  toggle() {
    this.open = !this.open;
  }
  setClosed() {
    this.open = false;
  }
}
