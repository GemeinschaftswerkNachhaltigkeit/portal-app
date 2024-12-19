import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from '../../models/color';
import { CommonModule } from '@angular/common';
import { OutlinedIconComponent } from './outlined-icon.component';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule, OutlinedIconComponent],
  template: `
    <div
      class="label font-2"
      (click)="clickHandler()"
      [class]="color + ''"
      [ngClass]="{
        clickable: clickable,
        withIcon: icon,
        limitedWidth: limitedWidth
      }"
      >
      @if (icon) {
        <app-outlined-icon>{{ icon }}</app-outlined-icon>
      }
      <ng-content></ng-content>
    </div>
    `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    $text-color: mat.m2-get-color-from-palette($wpgwn-app-primary, 500);

    :host {
      width: 100%;
      height: $spacing-7;
      overflow: hidden;
      &:hover {
        .label.clickable {
          cursor: pointer;
        }
      }
    }

    .primary {
      background-color: $blue-navy;
      color: white;
    }

    .accent {
      background-color: $magenta;
      color: white;
    }

    .green {
      background-color: $green;
      color: white;
    }

    .bordeauxe {
      background-color: $bordeauxe;
      color: white;
    }

    .orange {
      background-color: $orange;
      color: white;
    }

    .yellow {
      background-color: $yellow;
      color: $blue-navy;
    }

    .blue {
      background-color: $dan-blue;
      color: white;
    }

    .label {
      border: none;
      display: block;
      padding: 0 $spacing-2;
      height: 100%;
      line-height: $spacing-7;
      width: fit-content;
      gap: $spacing-1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      max-width: 200px;

      &.withIcon {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    @media screen and (min-width: 500px) {
      .label {
        max-width: none;
      }
    }

    @media screen and (min-width: 1200px) {
      .label {
        &.limitedWidth {
          max-width: 200px;
        }
      }
    }

    @media screen and (min-width: 1300px) {
      .label {
        &.limitedWidth {
          max-width: 240px;
        }
      }
    }

    @media screen and (min-width: 1350px) {
      .label {
        &.limitedWidth {
          max-width: 280px;
        }
      }
    }

    @media screen and (min-width: 1350px) {
      .label {
        &.limitedWidth {
          max-width: 280px;
        }
      }
    }

    @media screen and (min-width: 1400px) {
      .label {
        &.limitedWidth {
          max-width: none;
        }
      }
    }
  `
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
