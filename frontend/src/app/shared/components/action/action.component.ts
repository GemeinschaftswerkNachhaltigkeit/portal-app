import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input() icon = '';
  @Input() full = false;
  @Input() color?: 'primary' | 'accent' | 'green' | 'bordeauxe' | 'yellow' =
    'accent';
  @Input() clickable? = false;
  @Input() disabled? = false;
  @Input() stroked? = false;
  @Input() onlyIcon? = false;
  @Input() small? = false;
  @Input() toggle? = false;
  @Input() toggleValue? = false;
  @Input() tooltip = '';
  @Output() clicked = new EventEmitter();
  @HostBinding('class.full') isFull = false;

  clickHandler(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  getColor(): string {
    if (this.toggle) {
      return this.toggleValue ? 'accent' : 'default';
    } else {
      return 'accent';
    }
  }

  ngOnInit(): void {
    this.isFull = this.full;
  }
}
