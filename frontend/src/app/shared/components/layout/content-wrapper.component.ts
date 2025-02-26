import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    [class]="wrapperClasses"
    [ngClass]="{
      narrow: narrow,
      onlyX: onlyX,
      mobileNoMargin: mobileNoMargin,
      fitHeight: fitHeight
    }"
  >
    <ng-content></ng-content>
  </div> `,
  styles: `
    @use 'theme' as *;
    :host {
      width: 100%;
      height: 100%;
    }
    .content-wrapper {
      width: 100%;
      height: 100%;
      padding: $spacing-4 $spacing-4;
      position: relative;
      &.fitHeight {
        height: auto;
      }
      &.mobileNoMargin {
        padding: $spacing-4 0;
      }
      &.narrow {
        padding: $spacing-4 $spacing-4;
      }
      &.onlyX {
        padding-top: 0;
        padding-bottom: 0;
      }
      margin: auto;
      &.full {
        width: 100%;
      }
      &.xs {
        width: auto;
        max-width: 60rem;
      }
      &.sm {
        width: auto;
        max-width: 75rem;
      }
      &.md {
        width: auto;
        max-width: 90rem;
      }
      &.lg {
        width: auto;
        max-width: 105rem;
      }
      &.xl {
        width: auto;
        max-width: 140rem;
      }
    }

    @media screen and (min-width: $breakpoint-mobile-menu) {
      .content-wrapper {
        padding: $spacing-8 $spacing-14;
        &.mobileNoMargin {
          padding: $spacing-8 $spacing-14;
        }
        &.narrow {
          padding: $spacing-4 $spacing-14;
        }
      }
    }
  `
})
export class ContentWrapperComponent implements OnInit {
  @Input() narrow = false;
  @Input() onlyX = false;
  @Input() mobileNoMargin = false;
  @Input() fitHeight = false;
  @Input() size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  wrapperClasses = 'full';

  ngOnInit(): void {
    this.wrapperClasses = `content-wrapper ${this.size || 'full'}`;
  }
}
