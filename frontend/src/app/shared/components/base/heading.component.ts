import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-heading',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (type === 'h1') {
      <h1 class="title" [ngClass]="options()" [class]="getClasses('xl')">
        <mark>
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </mark>
      </h1>
    }
    @if (type === 'h2') {
      <h2 class="title" [ngClass]="options()" [class]="getClasses('lg')">
        <mark>
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </mark>
      </h2>
    }
    @if (type === 'h3') {
      <h3 class="title" [ngClass]="options()" [class]="getClasses('md')">
        <mark>
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </mark>
      </h3>
    }
    @if (type === 'h4') {
      <h4 class="title" [ngClass]="options()" [class]="getClasses('sm')">
        <mark>
          <ng-container *ngTemplateOutlet="contentTpl"></ng-container>
        </mark>
      </h4>
    }
    <ng-template #contentTpl><ng-content></ng-content></ng-template>
  `,
  styles: `
    @use '@angular/material' as mat;
    @use 'palette' as *;
    @use 'theme' as *;

    $mobile-xs: 1rem;
    $mobile-sm: 1.2rem;
    $mobile-md: 1.6rem;
    $mobile-lg: 2rem;
    $mobile-xl: 2.4rem;
    $xs: 1.4rem;
    $sm: 1.8rem;
    $md: 2.4rem;
    $lg: 2.8rem;
    $xl: 3.2rem;

    .title {
      margin: 0;
      font-weight: 800;

      &.thin:not(.active) {
        font-weight: normal;
      }

      --shadow-color: #{$yellow};

      &.blue {
        --shadow-color: #{$blue-light};
      }
      &.none {
        --shadow-color: transparent;
        &.hoverable:hover {
          --shadow-color: #{$yellow};

          &.blue {
            --shadow-color: #{$blue-light};
          }
        }
      }

      mark {
        box-decoration-break: clone;
        background: transparent;
        box-shadow:
          0 -16px 0 inset var(--shadow-color),
          0 6px 0 var(--shadow-color);
        color: $blue-navy;
        position: relative;
        z-index: $z1;
        padding: 0 $spacing-2;
        margin: 0 (-$spacing-2);
        transition: all 500ms;
      }

      &.xl {
        font-size: $mobile-xl;
        mark {
          box-shadow:
            0 -16px 0 inset var(--shadow-color),
            0 6px 0 var(--shadow-color);
        }
      }
      &.lg {
        font-size: $mobile-lg;
        mark {
          box-shadow:
            0 -14px 0 inset var(--shadow-color),
            0 4px 0 var(--shadow-color);
        }
      }
      &.md {
        font-size: $mobile-md;
        mark {
          box-shadow:
            0 -13px 0 inset var(--shadow-color),
            0 4px 0 var(--shadow-color);
        }
      }
      &.sm {
        font-size: $mobile-sm;
        mark {
          box-shadow:
            0 -10px 0 inset var(--shadow-color),
            0 2px 0 var(--shadow-color);
        }
      }
      &.xs {
        font-size: $mobile-xs;
        mark {
          box-shadow:
            0 -8px 0 inset var(--shadow-color),
            0 2px 0 var(--shadow-color);
        }
      }

      &.uppercase {
        text-transform: uppercase;
      }

      &.mobileOff {
        &.xs {
          font-size: $xs;
        }
        &.sm {
          font-size: $sm;
        }
        &.md {
          font-size: $md;
        }
        &.lg {
          font-size: $lg;
        }
        &.xl {
          font-size: $xl;
        }
      }
    }

    @media screen and (min-width: $breakpoint-sm) {
      .title {
        font-family: 'AzeretMono', monospace;
        margin: 0;
        font-weight: 800;

        &.xl {
          font-size: $xl;
        }
        &.lg {
          font-size: $lg;
        }
        &.md {
          font-size: $md;
        }
        &.sm {
          font-size: $sm;
        }
        &.xs {
          font-size: $xs;
        }
      }
    }
  `
})
export class HeadingComponent {
  @Input() type: 'h1' | 'h2' | 'h3' | 'h4' = 'h1';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '' = '';
  @Input() color: 'none' | 'yellow' | 'blue' = 'yellow';
  @Input() hoverable = false;
  @Input() uppercase = false;
  @Input() thin = false;
  @Input() active = false;
  @Input() noMobileSize = false;

  options(): { [key: string]: boolean } {
    return {
      uppercase: this.uppercase,
      hoverable: this.hoverable,
      thin: this.thin,
      active: this.active,
      mobileOff: this.noMobileSize
    };
  }

  getClasses(defaultSize: string): string {
    const size = this.size ? this.size : defaultSize;
    const color = this.color ? this.color : 'yellow';
    const classes = size + ' ' + color;
    return classes;
  }
}
