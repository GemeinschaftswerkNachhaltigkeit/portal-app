import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        })
      ),
      state(
        'closed',
        style({
          opacity: 1,
          transform: 'translateX(0px)'
        })
      ),
      transition('open <=> closed', [animate('1s')])
    ])
  ]
})
export class ExampleComponent {
  open = false;

  toggle(): void {
    this.open = !this.open;
  }
}
