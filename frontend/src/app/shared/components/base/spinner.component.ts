import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="spinner"
      [ngClass]="{
        mini: mini()
      }"
    >
      <div class="shapes"></div>
    </div>
  `,
  styles: `
    @use 'theme' as *;
    @use 'palette' as *;
    @use '@angular/material' as mat;

    .spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .shapes {
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        background: $magenta;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        animation-name: loading;
        animation-duration: 2.4s;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.3, 1, 0, 1);
      }

      &.mini {
        .shapes {
          width: 3rem;
          height: 3rem;
        }
      }

      @keyframes loading {
        33% {
          opacity: 1;
          border-radius: 0;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          background: $yellow;
        }

        66% {
          border-radius: 0;
          clip-path: polygon(50% 0, 50% 0, 100% 100%, 0 100%);
          background: $blue-navy;
        }
      }
    }
  `
})
export class SpinnerComponent {
  mini = input<boolean>();

  constructor() {}
}
