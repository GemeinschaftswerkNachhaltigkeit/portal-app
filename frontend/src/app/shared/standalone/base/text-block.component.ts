import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-block',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="text-block" [class]="width">
    <ng-content></ng-content>
  </div> `,
  styles: `
    .text-block {
      margin: 0;
      padding: 0;
      &.narrow {
        max-width: 80ch;
      }
      &.default {
        max-width: 100ch;
      }
      &.wide {
        max-width: 120ch;
      }
    }
  `
})
export class TextBlockComponent {
  @Input() width: 'narrow' | 'default' | 'wide' = 'default';
}
