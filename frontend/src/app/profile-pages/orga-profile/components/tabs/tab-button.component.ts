import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HeadingComponent } from 'src/app/shared/components/base/heading.component';

@Component({
  selector: 'app-tab-button',
  standalone: true,
  imports: [MatButtonModule, HeadingComponent],
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
