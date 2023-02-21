import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-char-count',
  templateUrl: './char-count.component.html',
  styleUrls: ['./char-count.component.scss']
})
export class CharCountComponent {
  @Input() count = 0;
  @Input() total = 0;
}
