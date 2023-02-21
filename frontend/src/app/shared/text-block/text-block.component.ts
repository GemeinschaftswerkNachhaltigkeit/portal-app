import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.scss']
})
export class TextBlockComponent {
  @Input() width: 'narrow' | 'default' | 'wide' = 'default';
}
