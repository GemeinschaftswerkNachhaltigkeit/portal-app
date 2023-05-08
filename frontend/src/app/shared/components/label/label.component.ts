import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from '../../models/color';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {
  @Input() icon = '';
  @Input() color?: Color = 'accent';
  @Input() clickable = false;
  @Input() limitedWidth? = false;
  @Output() clicked = new EventEmitter();

  clickHandler(): void {
    this.clicked.emit();
  }
}
