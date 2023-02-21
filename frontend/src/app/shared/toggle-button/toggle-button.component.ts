import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent {
  @Input() color = 'accent';
  @Input() customStyles = {};
  @Output() toggled = new EventEmitter();

  onToggle(): void {
    this.toggled.emit();
  }
}
