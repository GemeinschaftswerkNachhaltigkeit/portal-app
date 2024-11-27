import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-entry',
  templateUrl: './menu-entry.component.html',
  styleUrls: ['./menu-entry.component.scss']
})
export class MenuEntryComponent {
  @Input() url = '';
  @Input() internal = true;
  @Input() underline = false;
  @Input() last = false;
  @Input() button = false;
  @Input() blue = false;
  @Input() active = false;
  @Input() new = false;

  @Output() routeClicked = new EventEmitter();

  clickHandler(): void {
    this.routeClicked.emit();
  }
}
