import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OutlinedIconComponent } from './outlined-icon.component';

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, OutlinedIconComponent],
  template: `
    <div class="button-wrapper">
      <div class="tab-protection"></div>
      <button
        [ngStyle]="customStyles"
        mat-flat-button
        [color]="color"
        class="slide-button"
        (click)="onToggle()"
      >
        <app-outlined-icon><ng-content></ng-content></app-outlined-icon>
      </button>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    .button-wrapper {
      width: $spacing-14;
      height: $spacing-14;
      position: relative;

      button {
      }

      .tab-protection {
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      .slide-button {
        padding: 0;
        min-width: $spacing-10;
        width: $spacing-10;
        height: $spacing-10;
        position: absolute;
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);
        z-index: $z2;
      }
    }
  `
})
export class ToggleButtonComponent {
  @Input() color = 'accent';
  @Input() customStyles = {};
  @Output() toggled = new EventEmitter();

  onToggle(): void {
    this.toggled.emit();
  }
}
