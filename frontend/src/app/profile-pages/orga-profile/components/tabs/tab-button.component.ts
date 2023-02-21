import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab-button',
  styles: [
    `
      @use 'palette' as *;
      @use 'theme' as *;

      .button {
        border: none;
        background: none;
        cursor: pointer;
      }
    `
  ],
  template: `
    <button class="button" (click)="handleClick()">
      <app-heading
        size="sm"
        [noMobileSize]="true"
        [thin]="true"
        [color]="active ? 'yellow' : 'none'"
        [active]="active"
        [hoverable]="active ? false : true"
      >
        <ng-content></ng-content>
      </app-heading>
    </button>
  `
})
export class TabButtonComponent {
  @Input() active = false;
  @Output() clicked = new EventEmitter<number>();

  handleClick(): void {
    this.clicked.emit();
  }
}
